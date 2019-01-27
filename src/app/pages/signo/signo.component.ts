import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Signo } from 'src/app/_model/signo';
import { SignoService } from 'src/app/_service/signo.service';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {


  public cantidad: number;
  dataSource: MatTableDataSource<Signo>;
  displayedColumns = ['idSigno', 'paciente', 'fecha', 'temperatura', 'pulso', 'ritmoRespiratorio', 'acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private signoService : SignoService, private snackBar: MatSnackBar, public route: ActivatedRoute) { }

  ngOnInit() {
    this.signoService.signoCambio.subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data,'AVISO', {
        duration: 2000
      });
    });

    this.signoService.listar().subscribe(data => {
      //console.log(data);
      //this.pacientes = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  eliminar(idPaciente: number){
    this.signoService.eliminar(idPaciente).subscribe(data =>{
      this.signoService.listar().subscribe(pacientes => {
        this.signoService.signoCambio.next(pacientes);
        this.signoService.mensajeCambio.next('Se elimino');
      })
    });
  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

  }

}

