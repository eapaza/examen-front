import { DialogoComponent } from './dialogo/dialogo.component';
import { MedicoService } from './../../_service/medico.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Medico } from 'src/app/_model/medico';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  displayedColumns = ['idMedico', 'nombres', 'apellidos', 'cmp', 'acciones'];
  dataSource : MatTableDataSource<Medico>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private medicoService: MedicoService, private dialog: MatDialog, private snackBar: MatSnackBar ) { }

  ngOnInit() {
    /*this.medicoService.confirmacion.subscribe(data => {
      let rpta = data ? 'Acepto' : 'Rechazo';
      this.snackBar.open(rpta, 'RESULTADO',{
        duration: 2000
      });
    })*/

    this.medicoService.medicoCambio.subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.medicoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data,'AVISO', {
        duration: 2000
      });
    });

    this.medicoService.listar().subscribe(data => {
      //console.log(data);
      //this.medicos = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  openDialog(medico?: Medico){
    let med = medico != null ? medico : new Medico();
    this.dialog.open(DialogoComponent, {
      width: '250px',
      disableClose: false,
      data : med
    })
  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(medico: Medico){
    this.medicoService.eliminar(medico.idMedico).subscribe(data =>{
      this.medicoService.listar().subscribe(medicos => {
        this.medicoService.medicoCambio.next(medicos);
        this.medicoService.mensajeCambio.next('Se elimino');
      })
    });
  }

}
