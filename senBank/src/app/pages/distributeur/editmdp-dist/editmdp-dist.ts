import { Shared } from './../../../services/shared';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { Router } from '@angular/router';
// Optionnel : import { ToastrService } from 'ngx-toastr'; // Pour des notifications modernes

@Component({
  selector: 'app-editmdp-dist',
  imports: [ReactiveFormsModule, CommonModule,],
  templateUrl: './editmdp-dist.html',
  styleUrl: './editmdp-dist.css'
})
export class EditmdpDist  implements OnInit{

  passwordForm! : FormGroup
  isBrowser : boolean
  user : any
  compte: any;
  token: string | null = "";
  constructor(private route : Router,private sharedService : Shared,private formbuider : FormBuilder,@Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(){
    this.initForm()
        if (this.isBrowser) {
      this.compte = JSON.parse(localStorage.getItem("compte") || '{}')
      this.user = JSON.parse(localStorage.getItem("user") || '{}')
      this.token = localStorage.getItem("token")
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
  back(){
    this.route.navigate(["/profilDistributeur"])
  }
}
 