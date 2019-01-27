import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MedicoService } from './../../../_service/medico.service';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { ConsultaListaExamen } from './../../../_model/consultaListaExamen';
import { Consulta } from './../../../_model/consulta';
import { DetalleConsulta } from './../../../_model/detalleConsulta';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';
import { Medico } from 'src/app/_model/medico';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Utils from 'src/app/utils';

@Component({
  selector: 'app-especial',
  templateUrl: './especial.component.html',
  styleUrls: ['./especial.component.css']
})
export class EspecialComponent implements OnInit {

  form: FormGroup;

  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();

  pacientes: Paciente[] = [];
  examenes: Examen[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  filteredOptions: Observable<any[]>;
  filteredOptionsMedico: Observable<any[]>;

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  pacienteSeleccionado: Paciente;
  examenSeleccionado: Examen;
  especialidadSeleccionado: Especialidad;
  medicoSeleccionado: Medico;

  consulta: Consulta;

  constructor(private builder: FormBuilder,
              private consultaService: ConsultaService, 
              private pacienteService: PacienteService, 
              private examenService: ExamenService, 
              private especialidadService: EspecialidadService,
              private medicoService: MedicoService,
              private snackBar: MatSnackBar) { 
              }

  ngOnInit() {

    this.form = this.builder.group({
      'paciente': this.myControlPaciente,
      'especialidad': new FormControl(),
      'medico': this.myControlMedico,
      'fecha': new FormControl(new Date()),
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });

    this.listarPacientes();
    this.listarExamenes();
    this.listarEspecialidades();
    this.listarMedicos();

    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
    this.filteredOptionsMedico = this.myControlMedico.valueChanges.pipe(map(val => this.filtereMedico(val)));
  }

  filter(val: any){
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  filtereMedico(val: any){
    if (val != null && val.idMedico > 0) {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.cmp.includes(val.cmp));
    } else {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.cmp.includes(val));
    }
  }

  displayFnMedico(val: Medico) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
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

  seleccionarPaciente(e: any){
    //console.log(e);
    this.pacienteSeleccionado = e.option.value;
  }

  seleccionarMedico(e : any){
    this.medicoSeleccionado = e.option.value;
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
    if(this.examenSeleccionado != null) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont ++;
          break;
        }
      }

      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", {duration: 2000});
      } else {
          this.examenesSeleccionados.push(this.examenSeleccionado);
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
            || this.especialidadSeleccionado === undefined 
            || this.medicoSeleccionado === undefined 
            || this.pacienteSeleccionado === undefined
            || this.fechaSeleccionada === null);
  }
 
  aceptar() {
    let medico = new Medico();
    /*medico.idMedico = this.idMedicoSeleccionado;
    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;
    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;*/

    /*let consulta = new Consulta();
    consulta.medico = this.medicoSeleccionado;
    consulta.especialidad = this.especialidadSeleccionado;
    consulta.paciente = this.pacienteSeleccionado;
    consulta.detalleConsulta = this.detalleConsulta;
    //console.log(`fecha seleccionada: ${this.fechaSeleccionada}`);
    consulta.fecha = Utils.toISODate(this.fechaSeleccionada);*/
    
    this.consulta = new Consulta();
    this.consulta.especialidad = this.form.value['especialidad'];
    this.consulta.paciente = this.form.value['paciente'];
    this.consulta.medico = this.form.value['medico'];
    this.consulta.detalleConsulta = this.detalleConsulta;
    this.consulta.fecha = Utils.toISODate(this.form.value['fecha']);

    /*let lstExamen: Examen[] = [];
    lstExamen = this.examenesSeleccionados;*/
    //console.log(consulta);
    let consultaListaExamen: ConsultaListaExamen = new ConsultaListaExamen();
    consultaListaExamen.consulta = this.consulta;
    consultaListaExamen.lstExamen = this.examenesSeleccionados;
    this.consultaService.registrar(consultaListaExamen).subscribe(() => {
      this.snackBar.open("Se regsitó", "Aviso", { duration : 2000});
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
    this.pacienteSeleccionado = new Paciente();
    this.especialidadSeleccionado = new Especialidad();
    this.examenSeleccionado = new Examen();
    this.medicoSeleccionado = new Medico();
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
  }

}