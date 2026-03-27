"""Document storage routes."""

import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Document, User

router = APIRouter()


class SaveDocumentRequest(BaseModel):
    title: str
    form_data: dict


class DocumentSummary(BaseModel):
    id: int
    title: str
    created_at: str


class DocumentDetail(BaseModel):
    id: int
    title: str
    form_data: dict
    created_at: str


@router.get("/api/documents", response_model=list[DocumentSummary])
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    docs = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )
    return [
        DocumentSummary(id=d.id, title=d.title, created_at=d.created_at.isoformat())
        for d in docs
    ]


@router.post("/api/documents", response_model=DocumentSummary)
def save_document(
    body: SaveDocumentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = Document(
        user_id=current_user.id,
        title=body.title,
        form_data=json.dumps(body.form_data),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return DocumentSummary(id=doc.id, title=doc.title, created_at=doc.created_at.isoformat())


@router.put("/api/documents/{doc_id}", response_model=DocumentSummary)
def update_document(
    doc_id: int,
    body: SaveDocumentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.get(Document, doc_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.title = body.title
    doc.form_data = json.dumps(body.form_data)
    db.commit()
    db.refresh(doc)
    return DocumentSummary(id=doc.id, title=doc.title, created_at=doc.created_at.isoformat())


@router.get("/api/documents/{doc_id}", response_model=DocumentDetail)
def get_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.get(Document, doc_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentDetail(
        id=doc.id,
        title=doc.title,
        form_data=json.loads(doc.form_data),
        created_at=doc.created_at.isoformat(),
    )
