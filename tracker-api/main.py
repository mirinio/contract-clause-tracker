from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Document, Clause
from schemas import DocumentResponse, DocumentSummary, ClauseResponse, ClauseUpdate, ClauseCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clause Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/documents/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith((".txt", ".md")):
        raise HTTPException(status_code=400, detail="Only .txt and .md files are supported")

    content = (await file.read()).decode("utf-8")
    document = Document(name=file.filename, content=content)
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


@app.get("/documents", response_model=list[DocumentSummary])
def list_documents(
        search: Optional[str] = Query(None),
        clause_type: Optional[str] = Query(None),
        db: Session = Depends(get_db)
):
    query = db.query(Document)

    if search:
        query = query.filter(Document.name.ilike(f"%{search}%"))

    if clause_type:
        query = query.filter(Document.clauses.any(Clause.clause_type == clause_type))

    documents = query.all()

    return [
        DocumentSummary(
            id=doc.id,
            name=doc.name,
            uploaded_at=doc.uploaded_at,
            labeled_clauses=len(doc.clauses)
        )
        for doc in documents
    ]


@app.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@app.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(document)
    db.commit()
    return {"ok": True}


@app.post("/documents/{document_id}/clauses", response_model=ClauseResponse)
def create_clause(document_id: int, body: ClauseCreate, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    existing = db.query(Clause).filter(
        Clause.document_id == document_id,
        Clause.sentence == body.sentence
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Sentence already labeled")

    clause = Clause(
        document_id=document_id,
        sentence=body.sentence,
        clause_type=body.clause_type,
        labeled_at=datetime.now(timezone.utc)
    )
    db.add(clause)
    db.commit()
    db.refresh(clause)
    return clause


@app.patch("/clauses/{clause_id}", response_model=ClauseResponse)
def update_clause(clause_id: int, body: ClauseUpdate, db: Session = Depends(get_db)):
    clause = db.query(Clause).filter(Clause.id == clause_id).first()
    if not clause:
        raise HTTPException(status_code=404, detail="Clause not found")

    clause.clause_type = body.clause_type
    clause.labeled_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(clause)
    return clause


@app.delete("/clauses/{clause_id}")
def delete_clause(clause_id: int, db: Session = Depends(get_db)):
    clause = db.query(Clause).filter(Clause.id == clause_id).first()
    if not clause:
        raise HTTPException(status_code=404, detail="Clause not found")
    db.delete(clause)
    db.commit()
    return {"ok": True}


@app.get("/clause-types", response_model=list[str])
def get_clause_types(db: Session = Depends(get_db)):
    results = db.query(Clause.clause_type).distinct().all()
    return [r[0] for r in results]
