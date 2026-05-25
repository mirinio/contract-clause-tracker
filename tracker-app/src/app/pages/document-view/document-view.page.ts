import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Clause, Document } from '../../models/document.model';
import { DatePipe, NgClass } from '@angular/common';
import { SegmenterService } from '../../services/segmenter/segmenter.service';
import { DocumentClausePopupData, SelectClausePopup } from '../../components/select-clause-popup/select-clause-popup';
import { ApiClient } from '../../services/api-client/api.client';
import { first } from 'rxjs';

@Component({
  selector: 'app-document-view',
  imports: [
    RouterLink,
    DatePipe,
    NgClass,
    SelectClausePopup,
  ],
  templateUrl: './document-view.page.html',
  styleUrl: './document-view.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewPage {
  private readonly segmenterService = inject(SegmenterService);
  private readonly apiClient = inject(ApiClient);

  protected readonly document = model.required<Document>();
  protected readonly clauseTypes = model.required<string[]>();
  protected readonly labeledCount = computed(() => this.document()?.clauses.length ?? 0);

  protected readonly labeledSentences = computed(() => new Set(this.document().clauses.map(clause => clause.sentence)));

  protected readonly sentences = computed(() => {
    return [...this.segmenterService.split(this.document().content)].map(x => x.segment)
  });

  protected popupData = signal<DocumentClausePopupData | undefined>(undefined);

  protected openPopup(sentence: string, event: PointerEvent) {
    const clause = this.document()?.clauses.find(c => c.sentence === sentence);
    const x = Math.min(event.clientX, window.innerWidth - 240);
    const y = event.clientY + 10;

    this.popupData.set({
      sentence: sentence,
      clause,
      x,
      y,
    });
  }

  protected onPopupClosed() {
    this.popupData.set(undefined);
  }

  protected onLabelRemoved() {
    const clause = this.popupData()?.clause;
    if (!clause) return;
    this.removeLabel(clause);
  }

  protected onClauseApplied(clauseType: string) {
    const sentence = this.popupData()?.sentence;
    if (!sentence) return;
    this.applyLabel(sentence, clauseType);
  }

  private removeLabel(clause: Clause) {
    this.apiClient.deleteClause(clause.id).pipe(first(),
    ).subscribe(() => {

      this.document.update(doc => doc ? {
        ...doc,
        clauses: doc.clauses.filter(c => c.id !== clause.id),
      } : doc);

      this.onPopupClosed();
    });
  }

  private applyLabel(sentence: string, clauseType: string) {
    if (!clauseType.trim()) return;
    const docId = this.document()!.id;
    const existing = this.popupData()?.clause;

    if (existing) {
      this.apiClient.updateClause(existing.id, clauseType).pipe(first()).subscribe(updated => {
        this.document.update(doc => doc ? {
          ...doc,
          clauses: doc.clauses.map(c => c.id === updated.id ? updated : c),
        } : doc);
      });
    } else {
      this.apiClient.createClause(docId, sentence, clauseType).pipe(first()).subscribe(clause => {
        this.document.update(doc => doc ? {
          ...doc,
          clauses: [...doc.clauses, clause],
        } : doc);
      });
    }

    if (!this.clauseTypes().includes(clauseType)) {
      this.clauseTypes.update(types => [...types, clauseType]);
    }

    this.onPopupClosed();
  }
}
