import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../_model/medico';
import { HOST } from '../_shared/var.constant';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  confirmacion = new Subject<boolean>();
  medicoCambio = new Subject<Medico[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${HOST}/medicos`;
  
  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Medico[]>(this.url);
  }

  listarMedicoPorId(id: number){
    return this.http.get<Medico>(`${this.url}/${id}`);
  }

  registrar(medico: Medico){
    return this.http.post(this.url, medico);
  }

  modificar(medico: Medico){
    return this.http.put(this.url, medico);
  }

  eliminar(id: Number){
    return this.http.delete(`${this.url}/${id}`);
  }

}