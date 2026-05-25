import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Document } from '../../models/document.model';
import { DatePipe } from '@angular/common';
import { SegmenterService } from '../../services/segmenter/segmenter.service';

@Component({
  selector: 'app-document-view',
  imports: [
    RouterLink,
    DatePipe,
  ],
  templateUrl: './document-view.page.html',
  styleUrl: './document-view.page.scss',
})
export class DocumentViewPage {
  private readonly segmenterService = inject(SegmenterService);

  protected readonly document = input.required<Document>();
  protected readonly labeledCount = computed(() => this.document()?.clauses.length ?? 0);
  protected readonly sentences = computed(() => {
    return [...this.segmenterService.split(this.document().content)].map(x => x.segment)
  });

}
