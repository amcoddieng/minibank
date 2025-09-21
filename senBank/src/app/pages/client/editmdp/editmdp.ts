import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editmdp',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './editmdp.html',
  styleUrl: './editmdp.css'
})
export class Editmdp {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      ancien: ['', [Validators.required]],
      nouveau: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', [Validators.required]]
    });
  }

  changerMotDePasse() {
    if (this.passwordForm.valid) {
      const ancien = this.passwordForm.get('ancien')?.value;
      const nouveau = this.passwordForm.get('nouveau')?.value;
      const confirmation = this.passwordForm.get('confirmation')?.value;

      if (nouveau !== confirmation) {
        alert("⚠️ Les nouveaux mots de passe ne correspondent pas !");
        return;
      }

      // 👉 Ici tu peux appeler ton service pour envoyer au backend
      console.log("Ancien :", ancien);
      console.log("Nouveau :", nouveau);

      alert("✅ Mot de passe modifié avec succès !");
    } else {
      alert("⚠️ Remplis tous les champs correctement !");
    }
  }
}
