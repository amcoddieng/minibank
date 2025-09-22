import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
interface transfertData {
  dest:string;
  montant: any;
  id:any;
}
interface alltransactByidCompteData{
  idCompte : number
}
@Injectable({
  providedIn: 'root'
})
export class TransfertService {
  constructor(private _http:HttpClient){}
  transfert(data:transfertData){
    return this._http.post(environment.baseUrl + "transfert",{idCompte:data.id,compteDestinataire:data.dest,montant:data.montant})
  }
  AlltransactionClient(data:alltransactByidCompteData){
    return this._http.post(environment.baseUrl + "alltransactByidCompte",{idCompte:data.idCompte})
  }
}
