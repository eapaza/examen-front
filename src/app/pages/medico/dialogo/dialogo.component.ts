import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MedicoService } from './../../../_service/medico.service';
import { Medico } from 'src/app/_model/medico';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent implements OnInit {

  medico: Medico;
  edicion: boolean = true;
  
  constructor(private dialogRef: MatDialogRef<DialogoComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: Medico, 
              private medicoService: MedicoService) { }

  ngOnInit() {
    /*this.medico = this.data;*/
    this.medico = new Medico();
    this.medico.idMedico = this.data.idMedico;
    this.medico.nombres = this.data.nombres;
    this.medico.apellidos = this.data.apellidos;
    this.medico.cmp = this.data.cmp;
  }

  cancelar(){
    //this.medicoService.confirmacion.next(false)
    this.dialogRef.close();
  }

  operar(){

    if((this.medico != null) && (this.medico.idMedico > 0) ){
      this.medicoService.modificar(this.medico).subscribe(data => {
        this.medicoService.listar().subscribe( medicos => {
          this.medicoService.medicoCambio.next(medicos);
          this.medicoService.mensajeCambio.next('Se modifico');
        });
      });
    }else{
      this.medicoService.registrar(this.medico).subscribe(data=> {
        this.medicoService.listar().subscribe( medicos => {
          this.medicoService.medicoCambio.next(medicos);
          this.medicoService.mensajeCambio.next('Se creo');
        });
      });
    }
    
    this.dialogRef.close();
    //this.medicoService.confirmacion.next(true);
  }

}
