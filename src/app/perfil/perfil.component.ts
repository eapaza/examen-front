import { JwtHelperService } from '@auth0/angular-jwt';
import { TOKEN_NAME } from './../_shared/var.constant';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nombre_completo: string;
  rol: string[];

  constructor() { }

  ngOnInit() {
    const helper = new JwtHelperService();
    let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    const decodedToken = helper.decodeToken(tk.access_token);
    //console.log(decodedToken);
  
    this.nombre_completo = decodedToken.user_name;
    this.rol = decodedToken.authorities;
  }

}
