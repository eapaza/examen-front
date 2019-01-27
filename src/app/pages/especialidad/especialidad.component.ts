import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { EspecialidadService } from './../../_service/especialidad.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Especialidad } from 'src/app/_model/especialidad';
import { DialogService } from 'src/app/_service/dialog.service';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {

  displayedColumns = ['idEspecialidad', 'nombre', 'acciones']
  dataSource : MatTableDataSource<Especialidad>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private especialidadService: EspecialidadService, 
              private dialog: MatDialog, 
              private snackBar: MatSnackBar, 
              public route: ActivatedRoute,
              private dialogService: DialogService ) { }

  ngOnInit() {
    this.especialidadService.especialidadCambio.subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.especialidadService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data,'AVISO', {
        duration: 2000
      });
    });

    this.especialidadService.listar().subscribe(data => {
      //console.log(data);
      //this.especialidads = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(especialidad: Especialidad){
    this.dialogService.openConfirmDialog('¿Esta seguro de eliminar el registro?').afterClosed().subscribe(res=>{
      if(res){
        this.especialidadService.eliminar(especialidad.idEspecialidad).subscribe(data =>{
          this.especialidadService.listar().subscribe(especialidads => {
            this.especialidadService.especialidadCambio.next(especialidads);
            this.especialidadService.mensajeCambio.next('Se elimino');
          })
        });
      }
    });
    /*this.especialidadService.eliminar(especialidad.idEspecialidad).subscribe(data =>{
      this.especialidadService.listar().subscribe(especialidads => {
        this.especialidadService.especialidadCambio.next(especialidads);
        this.especialidadService.mensajeCambio.next('Se elimino');
      })
    });*/
  }

}
