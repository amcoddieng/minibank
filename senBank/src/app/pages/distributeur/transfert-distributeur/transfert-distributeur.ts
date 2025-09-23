import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepotService } from '../../../services/transaction/depot/depot';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfert-distributeur',
  imports: [ReactiveFormsModule],
  templateUrl: './transfert-distributeur.html',
  styleUrl: './transfert-distributeur.css'
})
export class TransfertDistributeur implements OnInit{
  transForm!: FormGroup
  user : any
  compte : any
  token: string | null = ""
    isBrowser: boolean;
  constructor(private trans : DepotService,@Inject(PLATFORM_ID) private platformId: Object,private route : Router,private depotbuilder : FormBuilder) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    this.initForm()
      this.compte = JSON.parse(localStorage.getItem("compte") || '{}')
      this.user = JSON.parse(localStorage.getItem("user") || '{}')
      this.token = localStorage.getItem("token")
      this.transForm.patchValue({
      idCompte : this.compte.idCompte
      })
  }
  tranfert(){
    if(this.transForm.valid){
      this.trans.transfert(this.transForm.value).subscribe({
        next:(res)=>{
          console.log(res)
        },
        error:(err)=>{
          console.log(err)
        }
      })
      alert(this.transForm.value.idCompte)
    }else{
      alert("no")
    }
  }
  initForm(){
    this.transForm = this.depotbuilder.group({
      dest : new FormControl("",Validators.required),
      montant : new FormControl("",Validators.required),
      montantRecu : new FormControl("",Validators.required),
      idCompte : new FormControl("",Validators.required)
    })
  }
  depot(){
    this.route.navigate(['depot'])
  }
  retrait(){
    this.route.navigate(['retrait'])
  }
}
