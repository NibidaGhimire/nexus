import os
import tempfile
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import shutil
import logging
import time
from datetime import datetime
from transformers import pipeline
from arxiv_plagiarism_detector import ArxivPlagiarismDetector
import fitz  # PyMuPDF for PDF text extraction

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='plagiarism_api.log'
)
logger = logging.getLogger("plagiarism-api")

app = FastAPI(
    title="Plagiarism Detector and Summarizer API",
    description="API for detecting plagiarism and summarizing academic papers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CORPUS_PATH = os.environ.get("CORPUS_PATH", "./arxiv_texts")
CACHE_DIR = os.environ.get("CACHE_DIR", "./embeddings_cache")
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "./uploads")
MODEL_NAME = os.environ.get("MODEL_NAME", "paraphrase-MiniLM-L6-v2")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize summarizer model
summarizer = pipeline("summarization")

detector = None

class SummarizationResult(BaseModel):
    summary: str

class PlagiarismResult(BaseModel):
    overall_plagiarism_percentage: float
    top_matches: List[Dict[str, Any]]
    total_matches_found: int
    total_chunks_analyzed: int

@app.on_event("startup")
async def startup_event():
    global detector
    logger.info("Initializing plagiarism detector...")
    try:
        detector = ArxivPlagiarismDetector(
            corpus_path=CORPUS_PATH,
            model_name=MODEL_NAME,
            chunk_size=1000,
            overlap=200,
            cache_dir=CACHE_DIR
        )
        detector.process_corpus(precompute_embeddings=True, batch_size=32, max_files=None, num_workers=4)
        logger.info("Plagiarism detector initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize plagiarism detector: {str(e)}")
        raise

@app.post("/api/summarize", response_model=SummarizationResult)
async def summarize_text(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are accepted")
    try:
        content = await file.read()
        if file.filename.lower().endswith('.pdf'):
            doc = fitz.open(stream=content, filetype="pdf")
            text = "\n".join([page.get_text("text") for page in doc])
        else:
            text = content.decode("utf-8")
        
        # Handle large text by chunking
        max_input_length = 1024  # Limit input size for the model
        chunks = [text[i:i+max_input_length] for i in range(0, len(text), max_input_length)]
        summaries = [summarizer(chunk, max_length=150, min_length=30, do_sample=False)[0]["summary_text"] for chunk in chunks]
        
        return {"summary": " ".join(summaries)}
    except Exception as e:
        logger.error(f"Error summarizing file {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/check-plagiarism", response_model=PlagiarismResult)
async def check_plagiarism(file: UploadFile = File(...), similarity_threshold: float = Form(0.7), top_k: int = Form(5)):
    if detector is None:
        raise HTTPException(status_code=500, detail="Plagiarism detector not initialized")
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"File uploaded: {file_path}")
        start_time = time.time()
        results = detector.check_pdf_plagiarism(
            pdf_path=file_path,
            top_k=top_k,
            similarity_threshold=similarity_threshold
        )
        processing_time = time.time() - start_time
        logger.info(f"Plagiarism check completed in {processing_time:.2f} seconds")
        if "error" in results:
            raise HTTPException(status_code=500, detail=results["error"])
        logger.info(f"Returning results: {results}")
        return results
    except Exception as e:
        logger.error(f"Error processing file {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def get_status():
    if detector is None:
        return {"status": "not_initialized", "message": "Detector not initialized"}
    try:
        corpus_files = detector.corpus_files
        cache_files = os.listdir(detector.cache_dir) if os.path.exists(detector.cache_dir) else []
        return {
            "status": "ready",
            "corpus_path": detector.corpus_path,
            "cache_dir": detector.cache_dir,
            "model_name": detector.model_name,
            "total_corpus_files": len(corpus_files),
            "cached_files": len(cache_files),
            "device": str(detector.device)
        }
    except Exception as e:
        logger.error(f"Error getting status: {str(e)}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
