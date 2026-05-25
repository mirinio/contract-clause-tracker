import { Routes } from '@angular/router';
import { UploadPage } from './pages/upload/upload.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { DocumentViewPage } from './pages/document-view/document-view.page';

export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'upload', component: UploadPage },
  { path: 'documents/:id', component: DocumentViewPage },
  { path: '**', redirectTo: '' },
];
