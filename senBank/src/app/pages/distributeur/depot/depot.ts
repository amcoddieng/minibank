import { DepotService } from './../../../services/transaction/depot/depot';
import { isPlatformBrowser } from '@angular/common';

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-depot',
  imports: [ReactiveFormsModule],
  templateUrl: './depot.html',
  styleUrl: './depot.css'
})
export class Depot implements OnInit{
  depot!: FormGroup
  user : any
  compte : any
  token: string | null = ""
    isBrowser: boolean;
  constructor(private dept : DepotService,@Inject(PLATFORM_ID) private platformId: Object,private route : Router,private depotbuilder : FormBuilder,private router :Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    this.initForm()
      this.compte = JSON.parse(localStorage.getItem("compte") || '{}')
      this.user = JSON.parse(localStorage.getItem("user") || '{}')
      this.token = localStorage.getItem("token")
      this.depot.patchValue({
      idCompte : this.compte.idCompte
      })
  }
deposer() {
  if(this.depot.valid) {
    const confirmation = confirm("Voulez-vous vraiment valider ?");
    if (confirmation) {
      this.dept.depot(this.depot.value).subscribe({
        next: (res) => {
          console.log("Succès :", res);
          alert("Dépôt effectué avec succès !");
        },
        error: (err) => {
          console.error( err);
          alert(err.error.error);
        }
      });
    }
  } else {
    alert("Veuillez remplir tous les champs !");
  }
}

  initForm(){
    this.depot = this.depotbuilder.group({
      client : new FormControl("",Validators.required),
      montant : new FormControl("",Validators.required),
      idCompte : new FormControl("",Validators.required)
    })
  }
  retrait(){
    this.router.navigate(['retrait'])
  }
    trans(){
    this.router.navigate(['transfertDistributeur'])
  }
  back(){
    this.route.navigate(['profilDistributeur'])
  }
}
