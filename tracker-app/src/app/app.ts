import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiClient } from './services/api-client/api-client';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly client = inject(ApiClient);
  protected readonly title = signal('tracker-app');



  testClient = toSignal(this.client.getDocuments());


}
