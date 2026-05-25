from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ClauseCreate(BaseModel):
    sentence: str
    clause_type: str


class ClauseUpdate(BaseModel):
    clause_type: str


class ClauseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    document_id: int
    sentence: str
    clause_type: str
    labeled_at: datetime

class DocumentBase(BaseModel):
    name: str


class DocumentResponse(DocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    uploaded_at: datetime
    clauses: list[ClauseResponse] = []


class DocumentSummary(DocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uploaded_at: datetime
    labeled_clauses: int
