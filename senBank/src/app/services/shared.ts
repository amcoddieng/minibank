import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface LoginData {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class Shared {
  constructor(private _http:HttpClient){}
  login(data:LoginData) {
    return this._http.post(environment.baseUrl + "connexion",{ numeroCompte:data.username, motDePasse:data.password})
  }
}
