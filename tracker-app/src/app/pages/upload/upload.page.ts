import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiClient } from '../../services/api-client/api.client';
import { catchError, EMPTY, first } from 'rxjs';

@Component({
  selector: 'app-upload',
  imports: [
    RouterLink,
  ],
  templateUrl: './upload.page.html',
  styleUrl: './upload.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPage {
  private readonly apiClient = inject(ApiClient);
  private readonly router = inject(Router);

  selectedFile = signal<File | undefined>(undefined);
  isDragging = signal(false);
  uploading = signal(false);
  error = signal<string | undefined>(undefined);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setFile(file);
  }

  setFile(file: File) {
    this.error.set(undefined);
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      this.error.set('Only .txt and .md files are supported.');
      return;
    }
    this.selectedFile.set(file);
  }

  upload() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.error.set(undefined);

    this.apiClient.uploadDocument(file).pipe(first(), catchError((error) => {
      this.error.set(error.error?.detail || 'Upload failed. Please try again.');
      this.uploading.set(false);
      return EMPTY;
    })).subscribe((doc) => this.router.navigate(['/documents', doc.id]));
  }
}
