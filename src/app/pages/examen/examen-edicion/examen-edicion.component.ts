import { ExamenService } from 'src/app/_service/examen.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Examen } from 'src/app/_model/examen';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-examen-edicion',
  templateUrl: './examen-edicion.component.html',
  styleUrls: ['./examen-edicion.component.css']
})
export class ExamenEdicionComponent implements OnInit {

  id: number;
  form: FormGroup;
  edicion: boolean = false;
  examen: Examen;

  constructor(private route: ActivatedRoute, private router: Router, private examenService: ExamenService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl(''),
      'descripcion' : new FormControl('')
    });

    this.examen =  new Examen();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;

      this.initForm();

    });
  }

  initForm(){
    if(this.edicion){
      //cargar la data del servicio hacia el form
      this.examenService.listarExamenPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id' : new FormControl(data.idExamen),
          'nombre' : new FormControl(data.nombre),
          'descripcion' : new FormControl(data.descripcion)
        });
      });
    }
  }
  
  operar(){
    this.examen.idExamen = this.form.value['id'];
    this.examen.nombre = this.form.value['nombre'];
    this.examen.descripcion = this.form.value['descripcion'];

    if(this.edicion){
      this.examenService.modificar(this.examen).subscribe(data => {
        this.examenService.listar().subscribe( examens => {
          this.examenService.examenCambio.next(examens);
          this.examenService.mensajeCambio.next('Se modifico');
        });
      });
    }else{
      this.examenService.registrar(this.examen).subscribe(data=> {
        this.examenService.listar().subscribe( examens => {
          this.examenService.examenCambio.next(examens);
          this.examenService.mensajeCambio.next('Se creo');
        });
      });
    }
    this.router.navigate(['examen']);
  }
}
