import { ConsultaListaExamen } from './../_model/consultaListaExamen';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Examen } from '../_model/examen';
import { HOST } from '../_shared/var.constant';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  examenCambio = new Subject<Examen[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${HOST}/examenes`;
  
  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Examen[]>(this.url);
  }

  listarExamenPorId(id: number){
    return this.http.get<Examen>(`${this.url}/${id}`);
  }

  registrar(examen: Examen){
    return this.http.post(this.url, examen);
  }

  modificar(examen: Examen){
    return this.http.put(this.url, examen);
  }

  eliminar(id: Number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listarExamenPorConsulta(idConsulta: number){
    return this.http.get<ConsultaListaExamen[]>(`${HOST}/consultaexamenes/${idConsulta}`);
  }
}