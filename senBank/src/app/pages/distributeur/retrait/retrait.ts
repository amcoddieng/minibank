import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepotService } from '../../../services/transaction/depot/depot';

@Component({
  selector: 'app-retrait',
  imports: [ReactiveFormsModule],
  templateUrl: './retrait.html',
  styleUrls: ['./retrait.css'] // corrigé
})
export class Retrait implements OnInit {
  formRetrait!: FormGroup;
  user: any;
  compte: any;
  token: string | null = "";
  isBrowser: boolean;

  constructor(
    private retraitBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private retraitService : DepotService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.compte = JSON.parse(localStorage.getItem("compte") || '{}');
      this.user = JSON.parse(localStorage.getItem("user") || '{}');
      this.token = localStorage.getItem("token");
    }

    this.formInit(); // initialisation du formulaire

    // Patcher l'ID du compte après la création du formulaire
    if (this.compte && this.compte.numeroCompte) {
      this.formRetrait.patchValue({
        id: this.compte.idCompte
      });
    }
  }

  // Création du formulaire
  formInit() {
    this.formRetrait = this.retraitBuilder.group({
      client:new FormControl ('', Validators.required),
      id:new FormControl ('', Validators.required),
      montant: new FormControl("",Validators.required)
    });
  }

  // Méthode de retrait
  retrait() {
    if (this.formRetrait.valid) {
      this.retraitService.retrait(this.formRetrait.value).subscribe({
        next:(res:any)=>{
          console.log(res)
        },
        error:(err:any)=>{
          console.log(err)
        }
      })
    } else {
      alert("Veuillez remplir tous les champs correctement !");
    }
  }
}
