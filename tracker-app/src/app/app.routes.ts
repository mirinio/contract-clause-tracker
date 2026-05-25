import { Routes } from '@angular/router';
import { UploadPage } from './pages/upload/upload.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { DocumentViewPage } from './pages/document-view/document-view.page';
import { documentResolver } from './resolver/document-resolver';
import { clauseTypesResolver } from './resolver/clause-types-resolver';

export const routes: Routes = [
  {
    path: '',
    resolve: { clauseTypes: clauseTypesResolver },
    component: DashboardPage,
  },
  { path: 'upload', component: UploadPage },
  {
    path: 'documents/:id',
    resolve: { document: documentResolver, clauseTypes: clauseTypesResolver },
    component: DocumentViewPage,
  },
  { path: '**', redirectTo: '' },
];
