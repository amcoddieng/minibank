import { Component, signal } from '@angular/core';
import { HeaderComponents } from './header/header';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [
    HeaderComponents,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
