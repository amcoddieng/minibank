import { Shared } from './../../../services/shared';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { Router } from '@angular/router';
// Optionnel : import { ToastrService } from 'ngx-toastr'; // Pour des notifications modernes

@Component({
  selector: 'app-editmdp',
  standalone: true, // Si vous utilisez des composants standalone (Angular 14+)
  imports: [ReactiveFormsModule, CommonModule,QRCodeComponent],
  templateUrl: './editmdp.html',
  styleUrl: './editmdp.css'
})
export class Editmdp implements OnInit{

  passwordForm! : FormGroup
  isBrowser : boolean
  user : any
  compte: any;
  token: string | null = "";
  qrData: string = "";
  constructor(private route : Router,private sharedService : Shared,private formbuider : FormBuilder,@Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(){
    this.initForm()
        if (this.isBrowser) {
      this.compte = JSON.parse(localStorage.getItem("compte") || '{}')
      this.user = JSON.parse(localStorage.getItem("user") || '{}')
      this.token = localStorage.getItem("token")
      this.qrData = this.compte.numeroCompte;
          // Injecte l'id dans le form
    this.passwordForm.patchValue({
      id: this.user.idUser
    })
  }
  }

  modifier(){
    if(this.passwordForm.value.confirmation !== this.passwordForm.value.nouveau){
      alert("les mot de passe ne corrsepond pas")
    }else if(this.passwordForm.valid){
      this.sharedService.changermotdepasse(this.passwordForm.value).subscribe({
        next:(res:any)=>{
          console.log(res)
        },
        error:(err:any)=>{
          console.log(err)
        }
      })
    }else{
      alert("remplir les tout les champs")
    }
  }

  initForm(){
    this.passwordForm = this.formbuider.group({
      ancien : new FormControl("",Validators.required),
      nouveau : new FormControl("",Validators.required),
      confirmation : new FormControl("",Validators.required),
      id : new FormControl("",Validators.required)
    })
  }
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
  back(){
    this.route.navigate(["/profilClient"])
  }
}