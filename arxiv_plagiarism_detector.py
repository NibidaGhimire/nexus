# Save this as arxiv_plagiarism_detector.py
import os
import gc
import torch
import numpy as np
from sentence_transformers import SentenceTransformer, util
import PyPDF2
from tqdm import tqdm
import nltk
import pickle
from concurrent.futures import ProcessPoolExecutor, as_completed
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("plagiarism-detector")

nltk.download('punkt', quiet=True)

class ArxivPlagiarismDetector:
    def __init__(self, corpus_path, model_name="paraphrase-MiniLM-L6-v2", chunk_size=1000, overlap=200, cache_dir=None):
      
        self.corpus_path = corpus_path
        self.model_name = model_name
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.cache_dir = cache_dir or os.path.join(os.path.dirname(corpus_path), "embeddings_cache")
        
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
            
        logger.info(f"Loading model: {model_name}")
        self.model = SentenceTransformer(model_name)
       
        if torch.cuda.is_available():
            self.device = torch.device("cuda")
            torch.cuda.empty_cache()
        else:
            self.device = torch.device("cpu")
            
        self.model.to(self.device)
        
        self.corpus_chunks = {}
        self.corpus_embeddings = {}
        self.corpus_files = self._get_corpus_files()
        
    def _get_corpus_files(self):
        return [f for f in os.listdir(self.corpus_path) if f.endswith('.txt')]
        
    def clear_memory(self):
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        gc.collect()
        
    def chunk_text(self, text):
        
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = min(start + self.chunk_size, text_length)
            chunk = text[start:end]
            
            if chunk.strip():
                chunks.append(chunk)
            
            start += self.chunk_size - self.overlap
            
        return chunks

    def _process_file(self, file_name):
        """
        Process a single corpus file (for parallel processing)
        """
        file_path = os.path.join(self.corpus_path, file_name)
        
        cache_file = os.path.join(self.cache_dir, f"{file_name}.pkl")
        if os.path.exists(cache_file):
            return file_name, None, None 
            
        try:
            with open(file_path, "r", encoding="utf-8", errors='ignore') as f:
                text = f.read().strip()
            
            if not text:
                return file_name, [], None
                
            chunks = self.chunk_text(text)
            
            return file_name, chunks, None
            
        except Exception as e:
            return file_name, None, str(e)
        
    def _encode_chunks(self, file_name, chunks, batch_size=32):
    
        cache_file = os.path.join(self.cache_dir, f"{file_name}.pkl")
        if os.path.exists(cache_file):
            try:
                with open(cache_file, "rb") as f:
                    data = pickle.load(f)
                return file_name, data['chunks'], data['embeddings'], None
            except Exception as e:
                pass  
        
        try:
            all_embeddings = []
            
            for i in range(0, len(chunks), batch_size):
                batch = chunks[i:i+batch_size]
                with torch.no_grad():
                    batch_embeddings = self.model.encode(
                        batch,
                        convert_to_tensor=True,
                        show_progress_bar=False
                    )
                    batch_embeddings_np = batch_embeddings.cpu().numpy()
                    all_embeddings.append(batch_embeddings_np)
                
            if all_embeddings:
                embeddings = np.vstack(all_embeddings)
                
                with open(cache_file, "wb") as f:
                    pickle.dump({'chunks': chunks, 'embeddings': embeddings}, f)
                
                return file_name, chunks, embeddings, None
            else:
                return file_name, chunks, None, "No embeddings generated"
                
        except Exception as e:
            return file_name, chunks, None, str(e)
            
    def process_corpus(self, precompute_embeddings=True, batch_size=32, max_files=None, num_workers=4):
        """
        Process the arXiv corpus files in optimized chunks
        
        Args:
            precompute_embeddings: Whether to precompute and store embeddings
            batch_size: Number of chunks to process at once
            max_files: Maximum number of files to process (None for all)
            num_workers: Number of parallel workers
        """
        logger.info(f"Processing arXiv corpus from {self.corpus_path}...")
        corpus_files = self.corpus_files[:max_files] if max_files else self.corpus_files
        
        logger.info(f"Found {len(corpus_files)} text files in corpus")
        logger.info(f"Processing with {num_workers} workers")
        
        files_to_process = []
        for file_name in corpus_files:
            cache_file = os.path.join(self.cache_dir, f"{file_name}.pkl")
            if not os.path.exists(cache_file):
                files_to_process.append(file_name)
                
        logger.info(f"Need to process {len(files_to_process)} files, {len(corpus_files) - len(files_to_process)} already cached")
        
        if files_to_process:
            with ProcessPoolExecutor(max_workers=num_workers) as executor:
                futures = [executor.submit(self._process_file, file_name) for file_name in files_to_process]
                
                for future in tqdm(as_completed(futures), total=len(futures), desc="Chunking corpus files"):
                    file_name, chunks, error = future.result()
                    if error:
                        logger.error(f"Error processing {file_name}: {error}")
                    elif chunks:
                        self.corpus_chunks[file_name] = chunks
        
        if precompute_embeddings:
            files_to_encode = files_to_process if files_to_process else corpus_files
            
            for file_name in tqdm(files_to_encode, desc="Encoding chunks"):
                if file_name not in self.corpus_chunks:
                    continue
                    
                chunks = self.corpus_chunks[file_name]
                _, _, embeddings, error = self._encode_chunks(file_name, chunks, batch_size)
                
                if error:
                    logger.error(f"Error encoding {file_name}: {error}")
                elif embeddings is not None:
                    logger.info(f"Encoded {file_name}: {len(chunks)} chunks")
                
        total_chunks = sum(len(chunks) for chunks in self.corpus_chunks.values())
        logger.info(f"Processed {len(self.corpus_chunks)} files with {total_chunks} total chunks")
        
    def load_corpus_for_comparison(self, file_batch_size=10):
        corpus_files = self.corpus_files
        
        for i in range(0, len(corpus_files), file_batch_size):
            batch_files = corpus_files[i:i+file_batch_size]
            batch_data = []
            
            for file_name in batch_files:
                cache_file = os.path.join(self.cache_dir, f"{file_name}.pkl")
                
                if os.path.exists(cache_file):
                    try:
                        with open(cache_file, "rb") as f:
                            data = pickle.load(f)
                            chunks = data['chunks']
                            embeddings = torch.tensor(data['embeddings'], device=self.device)
                            batch_data.append((file_name, chunks, embeddings))
                    except Exception as e:
                        logger.error(f"Error loading cached embeddings for {file_name}: {e}")
                else:
                    logger.warning(f"No cached embeddings for {file_name}")
            
            yield batch_data
        
    def extract_text_from_pdf(self, pdf_path):
        try:
            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num in range(len(pdf_reader.pages)):
                    text += pdf_reader.pages[page_num].extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            return ""
            
    def check_plagiarism(self, input_text, top_k=5, similarity_threshold=0.7, file_batch_size=10):
        if not self.corpus_files:
            return {"error": "No corpus files found"}
            
        input_chunks = self.chunk_text(input_text)
        if not input_chunks:
            return {"error": "Input text is empty or could not be processed"}
            
        logger.info(f"Checking {len(input_chunks)} chunks for plagiarism...")
        
        batch_size = 16
        all_input_embeddings = []
        
        for i in range(0, len(input_chunks), batch_size):
            batch = input_chunks[i:i+batch_size]
            with torch.no_grad():
                batch_embeddings = self.model.encode(
                    batch, 
                    convert_to_tensor=True,
                    show_progress_bar=False
                )
                all_input_embeddings.append(batch_embeddings)
                
            self.clear_memory()
            
        input_embeddings = torch.cat(all_input_embeddings)
        
        all_matches = []
        
        corpus_batch_iterator = self.load_corpus_for_comparison(file_batch_size)
        
        for batch_idx, batch_data in enumerate(tqdm(corpus_batch_iterator, desc="Comparing with arXiv papers")):
            for file_name, corpus_chunks, corpus_emb in batch_data:
                if corpus_emb is None or len(corpus_emb) == 0:
                    continue
                
                for i, input_emb in enumerate(input_embeddings):
                    similarities = util.pytorch_cos_sim(input_emb, corpus_emb)[0]
                    
                    top_indices = torch.argsort(similarities, descending=True)[:top_k]
                    top_scores = similarities[top_indices].cpu().numpy()
                    
                    for idx, score in zip(top_indices.cpu().numpy(), top_scores):
                        if score >= similarity_threshold and idx < len(corpus_chunks):
                            all_matches.append({
                                "input_chunk_idx": i,
                                "input_chunk": input_chunks[i][:150] + "...",  
                                "corpus_file": file_name,
                                "corpus_chunk": corpus_chunks[idx][:150] + "...",  
                                "similarity": float(score),
                            })
            
            self.clear_memory()
        
        sorted_matches = sorted(all_matches, key=lambda x: x["similarity"], reverse=True)[:top_k]
        
        if sorted_matches:
            plagiarized_chunks = set()
            for match in all_matches:
                plagiarized_chunks.add(match["input_chunk_idx"])
                        
            plagiarism_percentage = (len(plagiarized_chunks) / len(input_chunks)) * 100
        else:
            plagiarism_percentage = 0.0
            
        return {
            "overall_plagiarism_percentage": plagiarism_percentage,
            "top_matches": sorted_matches,
            "total_matches_found": len(all_matches),
            "total_chunks_analyzed": len(input_chunks)
        }
        
    def check_pdf_plagiarism(self, pdf_path, top_k=5, similarity_threshold=0.7):
        logger.info(f"Extracting text from PDF: {pdf_path}")
        text = self.extract_text_from_pdf(pdf_path)
        if not text:
            return {"error": "Failed to extract text from PDF or PDF is empty"}
            
        logger.info(f"Extracted {len(text)} characters from PDF")
        return self.check_plagiarism(text, top_k, similarity_threshold)
    