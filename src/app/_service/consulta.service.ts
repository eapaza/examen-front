import { FiltroConsulta } from './../_model/filtroConsulta';
import { Consulta } from './../_model/consulta';
import { ConsultaResumen } from './../_model/consultaResumen';
import { ConsultaListaExamen } from './../_model/consultaListaExamen';
import { HttpClient } from '@angular/common/http';
import { HOST } from './../_shared/var.constant';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  url: string = `${HOST}/consultas`;
  constructor(private http: HttpClient) { }

  registrar(consultaListaExamen: ConsultaListaExamen){
    return this.http.post(this.url, consultaListaExamen);
  }

  buscar(filtroConsulta: FiltroConsulta){
    return this.http.post<Consulta[]>(`${this.url}/buscar`, filtroConsulta);
  }

  listarResumen(){
    return this.http.get<ConsultaResumen[]>(`${this.url}/listarResumen`);
  }

  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`, {
      responseType: 'blob'
    });
  }

  guardarArchivo(data: File){
    let formData: FormData = new FormData();
    formData.append('file', data);

    return this.http.post(`${this.url}/guardarArchivo`, formData, {responseType: 'text'});
  }

  leerArchivo(){
    return this.http.get(`${this.url}/leerArchivo/1`, {
      responseType: 'blob'
    });
  }
}