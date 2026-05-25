import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, Clause, DocumentSummary } from '../../models/document.model';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  uploadDocument(file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Document>(`${ this.baseUrl }/documents/upload`, formData);
  }

  getDocuments(search?: string, clauseType?: string): Observable<DocumentSummary[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (clauseType) params = params.set('clause_type', clauseType);
    return this.http.get<DocumentSummary[]>(`${ this.baseUrl }/documents`, { params });
  }

  getDocument(id: number): Observable<Document> {
    return this.http.get<Document>(`${ this.baseUrl }/documents/${ id }`);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${ this.baseUrl }/documents/${ id }`);
  }

  createClause(documentId: number, sentence: string, clauseType: string): Observable<Clause> {
    return this.http.post<Clause>(`${ this.baseUrl }/documents/${ documentId }/clauses`, {
      sentence,
      clause_type: clauseType,
    });
  }

  updateClause(clauseId: number, clauseType: string): Observable<Clause> {
    return this.http.patch<Clause>(`${ this.baseUrl }/clauses/${ clauseId }`, {
      clause_type: clauseType,
    });
  }

  deleteClause(clauseId: number): Observable<void> {
    return this.http.delete<void>(`${ this.baseUrl }/clauses/${ clauseId }`);
  }

  getClauseTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${ this.baseUrl }/clause-types`);
  }
}
