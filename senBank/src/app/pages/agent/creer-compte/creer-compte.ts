import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-creer-compte',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './creer-compte.html',
  styleUrl: './creer-compte.css',
})
export class CreerCompte {
  // user = {
  //   nom: '',
  //   prenom: '',
  //   telephone: '',
  //   role: 'CLIENT',
  // };
  // message = '';
  // constructor(private userService: UserService) {}
  // onSubmit() {
  //   this.userService.createUser(this.user).subscribe({
  //     next: () => (this.message = 'Compte créé avec succès !'),
  //     error: () => (this.message = 'Erreur lors de la création'),
  //   });
  // }
}
