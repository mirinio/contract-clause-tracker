import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Clause } from '../../models/document.model';
import { FormsModule } from '@angular/forms';


export interface DocumentClausePopupData {
  x: number;
  y: number;
  sentence: string;
  clause?: Clause;
}

@Component({
  selector: 'app-select-clause-popup',
  imports: [
    FormsModule,
  ],
  templateUrl: './select-clause-popup.html',
  styleUrl: './select-clause-popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectClausePopup {
  data = input.required<DocumentClausePopupData>();
  clauseTypes = input<string[]>([]);

  closed = output<void>();
  apply = output<string>();
  remove = output<void>();

  customClauseType = '';

  close() {
    this.closed.emit();
  }

  onApplyType(type: string) {
    const normalizedType = type.trim();
    if (!normalizedType) return;
    this.apply.emit(normalizedType);
  }

  onApplyCustom() {
    const value = this.customClauseType.trim();
    if (!value) return;

    this.apply.emit(value);
    this.customClauseType = '';
  }

  onRemove() {
    this.remove.emit();
  }
}
