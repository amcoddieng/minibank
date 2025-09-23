import { Transfert } from './../../../pages/client/transfert/transfert';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StringifyOptions } from 'querystring';
interface depotData{
  client : string
  montant : number
  idCompte : number
}
interface transData{
  idCompte : number
  dest:string
  montant:number
}
interface retraitData{
  client : string
  id : number
  montant : string
}
@Injectable({
  providedIn: 'root'
})

export class DepotService {
  constructor(private _http:HttpClient){}
  depot(data:depotData){
    return this._http.post(environment.baseUrl + "depot",{compteDestinataire:data.client,montant:data.montant,idCompte:data.idCompte})
  }
  retrait(data:retraitData){
    return this._http.post(environment.baseUrl + 'retrait',{numeroCompteClient:data.client, idCompteDistributeur:data.id, montant:data.montant})
  }
  transfert(data:transData){
    return this._http.post(environment.baseUrl + "transfertDist",{idCompte:data.idCompte, compteDestinataire:data.dest, montant:data.montant })
  }
}
