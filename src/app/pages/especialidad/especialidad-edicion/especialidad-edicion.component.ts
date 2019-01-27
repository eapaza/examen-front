import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Especialidad } from 'src/app/_model/especialidad';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {

  id: number;
  form: FormGroup;
  edicion: boolean = false;
  especialidad: Especialidad;

  constructor(private route: ActivatedRoute, private router: Router, private especialidadService: EspecialidadService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl('')
    });

    this.especialidad =  new Especialidad();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;

      this.initForm();

    });
  }

  initForm(){
    if(this.edicion){
      //cargar la data del servicio hacia el form
      this.especialidadService.listarEspecialidadPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id' : new FormControl(data.idEspecialidad),
          'nombre' : new FormControl(data.nombre)
        });
      });
    }
  }
  
  operar(){
    this.especialidad.idEspecialidad = this.form.value['id'];
    this.especialidad.nombre = this.form.value['nombre'];

    if(this.edicion){
      this.especialidadService.modificar(this.especialidad).subscribe(data => {
        this.especialidadService.listar().subscribe( especialidades => {
          this.especialidadService.especialidadCambio.next(especialidades);
          this.especialidadService.mensajeCambio.next('Se modifico');
        });
      });
    }else{
      this.especialidadService.registrar(this.especialidad).subscribe(data=> {
        this.especialidadService.listar().subscribe( especialidades => {
          this.especialidadService.especialidadCambio.next(especialidades);
          this.especialidadService.mensajeCambio.next('Se creo');
        });
      });
    }
    this.router.navigate(['especialidad']);
  }
}
