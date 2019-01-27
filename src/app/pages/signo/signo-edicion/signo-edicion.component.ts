import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoPacienteComponent } from './../../paciente/dialogo/dialogo-paciente.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { Signo } from './../../../_model/signo';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';
import { SignoService } from 'src/app/_service/signo.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Observable } from 'rxjs';
import Utils from 'src/app/utils';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {


  form: FormGroup;
  id: number;
  myControlPaciente: FormControl = new FormControl();

  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;

  //fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  filteredOptions: Observable<any[]>;

  temperatura: string;
  pulso: string;
  ritmoRespiratorio: string;

  signo: Signo;

  edicion: boolean = false;

  constructor(private builder: FormBuilder,
              private pacienteService: PacienteService,
              private router: Router,
              private signoService: SignoService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { 
              }

  ngOnInit() {

    this.form = this.builder.group({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });
  
    this.signo = new Signo();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;

      this.initForm();

    });

    this.cargarAuto();

    this.pacienteService.pacienteCambio.subscribe(data=>{
      this.cargarAuto();
    });

    this.pacienteService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data,'AVISO', {
        duration: 2000
      });
    });

  }

  initForm(){
    if(this.edicion){
      //cargar la data del servicio hacia el form
      this.signoService.listarSignoPorId(this.id).subscribe(data => {
        this.pacienteSeleccionado = data.paciente;
        //this.fechaSeleccionada = new Date(data.fecha);
        this.temperatura = data.temperatura;
        this.pulso = data.pulso;
        this.ritmoRespiratorio = data.ritmoRespiratorio;
        this.myControlPaciente = new FormControl(data.paciente);

        this.cargarAuto();

        console.log(data);
        //console.log(this.fechaSeleccionada);
        this.form = this.builder.group({
          'id': new FormControl(data.idSigno),
          'paciente': this.myControlPaciente,
          'fecha': new FormControl(new Date(data.fecha)),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio)
        });
      });
    }
  }

  cargarAuto(){
    this.listarPacientes();
    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
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

   displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(data=>{
      this.pacientes = data;
    })
  }

  seleccionarPaciente(e: any){
    //console.log(e);
    this.pacienteSeleccionado = e.option.value;
  }

  estadoBotonRegistrar(): boolean {   
    return (this.pacienteSeleccionado === undefined
            || this.form.value['fecha'] === undefined
            || this.temperatura === undefined
            || this.pulso === undefined
            || this.ritmoRespiratorio === undefined
            );
  }
 
  aceptar() {
   
    this.signo.idSigno = this.id;
    this.signo.paciente = this.form.value['paciente'];
    this.signo.fecha = Utils.toISODate(this.form.value['fecha']);
    this.signo.temperatura = this.form.value['temperatura'];
    this.signo.pulso = this.form.value['pulso'];
    this.signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    /*console.log('Edicion: ');
    console.log(this.edicion);*/
 


    if(this.edicion){
      this.signoService.modificar(this.signo).subscribe(data => {
        this.signoService.listar().subscribe( signos => {
          /*console.log('fecha:');
          console.log(this.form.value['fecha']);
          console.log('Signo object: ');
          console.log(this.signo);*/
          this.signoService.signoCambio.next(signos);
          this.limpiarControles();
          this.signoService.mensajeCambio.next('Se modifico');
        });
      });
    }else{
      this.signoService.registrar(this.signo).subscribe(data=> {
        this.signoService.listar().subscribe( signos => {
          /*console.log('fecha:');
          console.log(this.form.value['fecha']);
          console.log('Signo object: ');
          console.log(this.signo);*/
          this.signoService.signoCambio.next(signos);
          this.limpiarControles();
          this.signoService.mensajeCambio.next('Se creo');
        });
      });
    }
    this.router.navigate(['signo']);
  }

  limpiarControles(){

    this.pacienteSeleccionado = new Paciente();
    /*this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);*/
    this.temperatura = null;
    this.pulso = null;
    this.ritmoRespiratorio = null;
  }

  openDialog(){
    let sig = new Signo();
    this.dialog.open(DialogoPacienteComponent, {
      width: '250px',
      disableClose: false,
      data : sig
    })
  }

}