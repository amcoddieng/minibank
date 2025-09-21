import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Shared } from './../../services/shared';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // <-- Import du Router

@Component({
  selector: 'app-connexion',
  imports: [
    ReactiveFormsModule, CommonModule, FormsModule
  ],
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css'] // <-- corrigé styleUrl en styleUrls
})
export class Connexion implements OnInit {
  loginForm!: FormGroup;

  constructor(private sharedService: Shared, 
              private formBuilder: FormBuilder,
              private router: Router) { } // <-- injection du Router

  ngOnInit() {
    this.initForm();
  }

  connexion() {
    if(this.loginForm.valid){
      this.sharedService.login(this.loginForm.value).subscribe({
        next: (res) => {
          
          // console.log(res);
          // redirection après succès
          this.router.navigate(['/profilClient']);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      alert("Formulaire invalide");
    }
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }
}
