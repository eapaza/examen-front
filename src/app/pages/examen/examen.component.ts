import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { ExamenService } from './../../_service/examen.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Examen } from 'src/app/_model/examen';
import { DialogService } from 'src/app/_service/dialog.service';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {

  displayedColumns = ['idExamen', 'nombre', 'descripcion', 'acciones'];
  dataSource : MatTableDataSource<Examen>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private examenService: ExamenService, 
              private dialog: MatDialog, 
              private snackBar: MatSnackBar, 
              public route: ActivatedRoute,
              private dialogService: DialogService ) { }

  ngOnInit() {
    this.examenService.examenCambio.subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.examenService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data,'AVISO', {
        duration: 2000
      });
    });

    this.examenService.listar().subscribe(data => {
      //console.log(data);
      //this.examens = data;
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

  eliminar(examen: Examen){
    this.dialogService.openConfirmDialog('¿Esta seguro de eliminar el registro?').afterClosed().subscribe(res=>{
      if(res){
        this.examenService.eliminar(examen.idExamen).subscribe(data =>{
          this.examenService.listar().subscribe(examens => {
            this.examenService.examenCambio.next(examens);
            this.examenService.mensajeCambio.next('Se elimino');
          })
        });
      }
    });
    /*this.examenService.eliminar(examen.idExamen).subscribe(data =>{
      this.examenService.listar().subscribe(examens => {
        this.examenService.examenCambio.next(examens);
        this.examenService.mensajeCambio.next('Se elimino');
      })
    });*/
  }

}
