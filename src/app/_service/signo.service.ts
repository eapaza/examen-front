import { HttpClient } from '@angular/common/http';
import { HOST } from './../_shared/var.constant';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Signo } from '../_model/signo';

@Injectable({
  providedIn: 'root'
})
export class SignoService {

  signoCambio = new Subject<Signo[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${HOST}/signos`;
  
  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Signo[]>(this.url);
  }

  listarSignoPorId(id: number){
    return this.http.get<Signo>(`${this.url}/${id}`);
  }

  registrar(signo: Signo){
    return this.http.post(this.url, signo);
  }

  modificar(signo: Signo){
    return this.http.put(this.url, signo);
  }

  eliminar(id: Number){
    return this.http.delete(`${this.url}/${id}`);
  }
}
