import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CronometroComponent } from './components/cronometro/cronometro.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CronometroComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cronometro');
}
