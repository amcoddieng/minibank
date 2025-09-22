import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profil2',
  imports: [],
  templateUrl: './profil2.html',
  styleUrl: './profil2.css'
})
export class Profil2 implements OnInit{
  user : any
  compte : any
  token: string | null = ""
    isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
      this.compte = JSON.parse(localStorage.getItem("compte") || '{}')
      this.user = JSON.parse(localStorage.getItem("user") || '{}')
      this.token = localStorage.getItem("token")
  }
}
