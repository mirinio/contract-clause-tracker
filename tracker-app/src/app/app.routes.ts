import { Routes } from '@angular/router';
import { UploadPage } from './pages/upload/upload.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { DocumentViewPage } from './pages/document-view/document-view.page';
import { documentResolver } from './resolver/document-resolver';

export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'upload', component: UploadPage },
  {
    path: 'documents/:id',
    resolve: { document: documentResolver },
    component: DocumentViewPage },
  { path: '**', redirectTo: '' },
];
