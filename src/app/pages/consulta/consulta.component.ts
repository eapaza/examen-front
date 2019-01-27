import { ConsultaListaExamen } from './../../_model/consultaListaExamen';
import { Consulta } from './../../_model/consulta';
import { MatSnackBar } from '@angular/material';
import { DetalleConsulta } from './../../_model/detalleConsulta';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from './../../_service/medico.service';
import { Especialidad } from './../../_model/especialidad';
import { Examen } from './../../_model/examen';
import { EspecialidadService } from './../../_service/especialidad.service';
import { ExamenService } from './../../_service/examen.service';
import { Component, OnInit } from '@angular/core';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import Utils from 'src/app/utils';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes: Paciente[] = [];
  examenes: Examen[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  idPacienteSeleccionado: number;
  idExamenSeleccionado: number;
  idEspecialidadSeleccionado: number;
  idMedicoSeleccionado: number;

  constructor(private consultaService: ConsultaService, 
              private pacienteService: PacienteService, 
              private examenService: ExamenService, 
              private especialidadService: EspecialidadService,
              private medicoService: MedicoService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.listarPacientes();
    this.listarExamenes();
    this.listarEspecialidades();
    this.listarMedicos();
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(data=>{
      this.pacientes = data;
    })
  }

  listarExamenes(){
    this.examenService.listar().subscribe(data=>{
      this.examenes = data;
    })
  }

  listarEspecialidades(){
    this.especialidadService.listar().subscribe(data=>{
      this.especialidades = data;
    })
  }

  listarMedicos(){
    this.medicoService.listar().subscribe(data=>{
      this.medicos = data;
    })
  }

  agregarDetalle(){
    //console.log(`${this.diagnostico} - ${this.tratamiento}`);
    //if (( this.diagnostico ) && ( this.tratamiento )) {
    if (( this.diagnostico ) && ( this.tratamiento )) {
      let det = new DetalleConsulta();
      det.tratamiento = this.diagnostico;
      det.diagnostico = this.tratamiento;
      this.detalleConsulta.push(det);
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tratamiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000});
    }
  }

  removerDiagnostico(index: number){
    this.detalleConsulta.splice(index, 1);
  }

  agregarExamen(){
    if(this.idExamenSeleccionado > 0) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont ++;
          break;
        }
      }

      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", {duration: 2000});
      } else {
        let examen = new Examen();
        examen.idExamen = this.idExamenSeleccionado;
        this.examenService.listarExamenPorId(this.idExamenSeleccionado).subscribe(data => {
          examen.nombre = data.nombre;
          this.examenesSeleccionados.push(examen);
        });
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 })
    }
  }

  removerExamen(index: number){
    this.examenesSeleccionados.splice(index, 1);
  }

  estadoBotonRegistrar(): boolean {
  /*  console.log('detalle consulta: ' + this.detalleConsulta.length);
    console.log('idEspecialidadSeleccionado: ' + this.idEspecialidadSeleccionado);
    console.log('idMedicoSeleccionado: ' + this.idMedicoSeleccionado);
    console.log('idPacienteSeleccionado: ' + this.idPacienteSeleccionado);*/
    
    return (this.detalleConsulta.length === 0 
            || this.idEspecialidadSeleccionado === undefined 
            || this.idMedicoSeleccionado === undefined 
            || this.idPacienteSeleccionado === undefined
            || this.fechaSeleccionada === null);
  }
 
  aceptar() {
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;
    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;
    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let consulta = new Consulta();
    consulta.medico = medico;
    consulta.especialidad = especialidad;
    consulta.paciente = paciente;
    consulta.detalleConsulta = this.detalleConsulta;
    //console.log(`fecha seleccionada: ${this.fechaSeleccionada}`);
    consulta.fecha = Utils.toISODate(this.fechaSeleccionada);
    
    /*let lstExamen: Examen[] = [];
    lstExamen = this.examenesSeleccionados;*/
    //console.log(consulta);
    let consultaListaExamen: ConsultaListaExamen = new ConsultaListaExamen();
    consultaListaExamen.consulta = consulta;
    consultaListaExamen.lstExamen = this.examenesSeleccionados;
    this.consultaService.registrar(consultaListaExamen).subscribe(() => {
      this.snackBar.open("Se regsitrò", "Aviso", { duration : 2000});
      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles(){
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
  }

}
