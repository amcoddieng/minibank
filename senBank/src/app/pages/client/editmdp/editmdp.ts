import { Shared } from './../../../services/shared';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Optionnel : import { ToastrService } from 'ngx-toastr'; // Pour des notifications modernes

@Component({
  selector: 'app-editmdp',
  standalone: true, // Si vous utilisez des composants standalone (Angular 14+)
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editmdp.html',
  styleUrl: './editmdp.css'
})
export class Editmdp {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private sharedService: Shared /*, private toastr: ToastrService */) {
    this.passwordForm = this.fb.group({
      ancien: ['', Validators.required],
      nouveau: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('nouveau')?.value === form.get('confirmation')?.value ? null : { mismatch: true };
  }

  changerMotDePasse() {
    if (this.passwordForm.valid) {
      this.sharedService.changermotdepasse(this.passwordForm.value).subscribe({
        next: (res: any) => {
          // this.toastr.success(res.message || '✅ Mot de passe modifié avec succès !'); // Optionnel
          alert(res.message || '✅ Mot de passe modifié avec succès !'); // Si pas de toastr
        },
        error: (err: any) => {
          // this.toastr.error(err.error?.message || '⚠️ Une erreur est survenue.'); // Optionnel
          alert(err.error?.message || '⚠️ Une erreur est survenue.');
        }
      });
    }
  }
}