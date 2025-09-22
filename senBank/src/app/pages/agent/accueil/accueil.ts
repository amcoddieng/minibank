import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {}
