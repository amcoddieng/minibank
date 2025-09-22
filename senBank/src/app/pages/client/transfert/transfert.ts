import { TransfertService } from './../../../services/transaction/transfert';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfert',
  imports: [ReactiveFormsModule],
  templateUrl: './transfert.html',
  styleUrl: './transfert.css'
})
export class Transfert implements OnInit{
  formTransfert! : FormGroup
  isBrowser : boolean
  user : any
  compte: any;
  token: string | null = "";
  qrData: string = "";
  constructor(private route : Router,private transfertService : TransfertService,private formbuider : FormBuilder,@Inject(PLATFORM_ID) private platformId: Object){
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
    this.formTransfert.patchValue({
      id: this.compte.idCompte
    })
  }
  }

  transferer(){
    if(this.formTransfert.valid){
      this.transfertService.transfert(this.formTransfert.value).subscribe({
        next:(res:any)=>{
          alert(res)
        },
        error:(err)=>{
          alert(err)
        }
      })
    }else{
      alert("remplir les tout les champs")
    }
  }
  
  initForm(){
    this.formTransfert = this.formbuider.group({
      dest : new FormControl("",Validators.required),
      montant : new FormControl("",Validators.required),
      montantRecu : new FormControl("",Validators.required),
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
