import { Paciente } from './../../../_model/paciente';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-dialogo-paciente',
  templateUrl: './dialogo-paciente.component.html',
  styleUrls: ['./dialogo-paciente.component.css']
})
export class DialogoPacienteComponent implements OnInit {

  paciente: Paciente;
  edicion: boolean = true;
  
  constructor(private dialogRef: MatDialogRef<DialogoPacienteComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: Paciente, 
              private pacienteService: PacienteService) { }

  ngOnInit() {
    /*this.paciente = this.data;*/
    this.paciente = new Paciente();
    this.paciente.idPaciente = this.data.idPaciente;
    this.paciente.nombres = this.data.nombres;
    this.paciente.apellidos = this.data.apellidos;
    this.paciente.dni = this.data.dni;
    this.paciente.direccion = this.data.direccion;
    this.paciente.telefono = this.data.telefono;
    this.paciente.email = this.data.email;
   }

  cancelar(){
    //this.pacienteService.confirmacion.next(false)
    this.dialogRef.close();
  }

  operar(){

    if((this.paciente != null) && (this.paciente.idPaciente > 0) ){
      this.pacienteService.modificar(this.paciente).subscribe(data => {
        this.pacienteService.listar().subscribe( pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next('Se modifico');
        });
      });
    }else{
      this.pacienteService.registrar(this.paciente).subscribe(data=> {
        this.pacienteService.listar().subscribe( pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next('Se creo');
        });
      });
    }
    
    this.dialogRef.close();
    //this.pacienteService.confirmacion.next(true);
  }

}
