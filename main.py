import os
import tempfile
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import shutil
import logging
import time
from datetime import datetime

from arxiv_plagiarism_detector import ArxivPlagiarismDetector

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='plagiarism_api.log'
)
logger = logging.getLogger("plagiarism-api")

app = FastAPI(
    title="ArXiv Plagiarism Detector API",
    description="API for detecting plagiarism in academic papers against arXiv corpus",
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

detector = None

class PlagiarismResult(BaseModel):
    overall_plagiarism_percentage: float
    top_matches: List[Dict[str, Any]]
    total_matches_found: int
    total_chunks_analyzed: int

class ErrorResponse(BaseModel):
    error: str

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
        
        detector.process_corpus(
            precompute_embeddings=True, 
            batch_size=32,
            max_files=None,  
            num_workers=4    
        )
        
        logger.info("Plagiarism detector initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize plagiarism detector: {str(e)}")
        raise

def process_corpus_background(max_files: Optional[int] = None):
    """Background task to process corpus files"""
    global detector
    try:
        logger.info(f"Starting background processing of corpus (max_files={max_files})")
        detector.process_corpus(
            precompute_embeddings=True, 
            batch_size=32,
            max_files=max_files,
            num_workers=4
        )
        logger.info("Background corpus processing completed")
    except Exception as e:
        logger.error(f"Background corpus processing failed: {str(e)}")

@app.post("/api/process-corpus", status_code=202)
async def api_process_corpus(
    background_tasks: BackgroundTasks,
    max_files: Optional[int] = None
):
    """API endpoint to trigger corpus processing in the background"""
    global detector
    
    if detector is None:
        raise HTTPException(status_code=500, detail="Detector not initialized")
    
    background_tasks.add_task(process_corpus_background, max_files)
    
    return {"message": f"Corpus processing started in background (max_files={max_files})"}

@app.post("/api/check-plagiarism", response_model=PlagiarismResult)
async def check_plagiarism(
    file: UploadFile = File(...),
    similarity_threshold: float = Form(0.7),
    top_k: int = Form(5)
):
    global detector
    
    if detector is None:
        raise HTTPException(status_code=500, detail="Detector not initialized")
    
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
    
    finally:
        pass

@app.get("/api/status")
async def get_status():
    global detector
    
    if detector is None:
        return {"status": "not_initialized", "message": "Detector not initialized"}
    
    try:
        corpus_files = detector.corpus_files
        cache_files = []
        
        if os.path.exists(detector.cache_dir):
            cache_files = [f for f in os.listdir(detector.cache_dir) if f.endswith('.pkl')]
        
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