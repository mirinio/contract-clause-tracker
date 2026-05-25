export interface Clause {
  id: number;
  document_id: number;
  sentence: string;
  clause_type: string;
  labeled_at: string;
}

export interface DocumentSummary {
  id: number;
  name: string;
  uploaded_at: string;
  labeled_clauses: number;
}

export interface Document {
  id: number;
  name: string;
  content: string;
  uploaded_at: string;
  clauses: Clause[];
}
