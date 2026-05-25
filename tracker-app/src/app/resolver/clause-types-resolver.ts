import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ApiClient } from '../services/api-client/api.client';

export const clauseTypesResolver: ResolveFn<string[]> = (route, state) => {
  return inject(ApiClient).getClauseTypes();
};
