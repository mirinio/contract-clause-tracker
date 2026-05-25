import { ResolveFn } from '@angular/router';
import { ApiClient } from '../services/api-client/api.client';
import { inject } from '@angular/core';
import { Document } from '../models/document.model';

export const documentResolver: ResolveFn<Document | boolean> = (route, state) => {
  const id = Number(route.paramMap.get('id'));

  if(!id) return false;

  return inject(ApiClient).getDocument(id);
};
