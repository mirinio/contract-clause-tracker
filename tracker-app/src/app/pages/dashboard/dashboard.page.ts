import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiClient } from '../../services/api-client/api.client';
import { DocumentSummary } from '../../models/document.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, startWith, switchMap, take } from 'rxjs';
import { groupBy } from 'lodash-es';

interface SearchForm {
  query: FormControl<string | undefined>;
  clauseType: FormControl<string | undefined>;
  groupBy: FormControl<'none' | 'labeled'>;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  private readonly apiClient = inject(ApiClient);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly searchForm = new FormGroup<SearchForm>({
    query: this.fb.control(''),
    clauseType: this.fb.control(''),
    groupBy: this.fb.control('none'),
  });
  protected readonly documents = signal<DocumentSummary[]>([]);
  protected readonly clauseTypes = signal<string[]>([]);

  grouped = computed(() => {
    const grouped = groupBy(this.documents(), (doc) =>
      doc.labeled_clauses > 0 ? 'Has Labels' : 'No Labels',
    );

    return Object.entries(grouped).map(([key, docs]) => ({
      key,
      docs,
    }));
  });

  ngOnInit() {
    this.apiClient.getClauseTypes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(types => this.clauseTypes.set(types));

    this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.value),
      debounceTime(400),
      switchMap((value) => this.apiClient.getDocuments(value.query, value.clauseType)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((docs) => {
      this.documents.set(docs);
    });
  }

  deleteDocument(id: number) {
    if (!confirm('Delete this document?')) return;

    this.apiClient.deleteDocument(id).pipe(
      switchMap(() =>
        this.apiClient.getDocuments(this.searchForm.value.query, this.searchForm.value.clauseType)),
      take(1),
    ).subscribe(docs => this.documents.set(docs));
  }
}
