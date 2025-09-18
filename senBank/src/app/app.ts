import { Component, signal } from '@angular/core';
import { HeaderComponents } from './header/header';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [
    HeaderComponents,
    RouterOutlet
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
