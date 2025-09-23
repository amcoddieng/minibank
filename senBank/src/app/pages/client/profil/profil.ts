
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.html',
  standalone:true,
  imports:[CommonModule,QRCodeComponent],
  styleUrl: './profil.css'
})
export class Profil implements OnInit{
  user : any
  compte : any
  token: string | null = ""
  isBrowser: boolean;
  qrData: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route:Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    if (this.isBrowser) {
      this.compte = JSON.parse(localStorage.getItem("compte") || '{}')
      this.user = JSON.parse(localStorage.getItem("user") || '{}')
      this.token = localStorage.getItem("token")
      this.qrData = this.compte.numeroCompte;
  }}

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // JS pur pour rafraîchir le QR toutes les 5s
      setInterval(() => {
        const qrImg = document.querySelector('qrcode canvas') as HTMLCanvasElement;
        if (qrImg) {
          // On recrée le QR code en changeant juste un paramètre invisible
          this.qrData = `${this.compte.numeroCompte}?t=${Date.now()}`;
        }
      }, 5000);
    }
  }
  goEditmdp(){
    this.route.navigate(['/editmdp'])
  }
}