import { MenuService } from './../_service/menu.service';
import { LoginService } from './../_service/login.service';
import { Component, OnInit } from '@angular/core';
import '../login-animation.js';
import { TOKEN_NAME } from '../_shared/var.constant';
import { Router } from '@angular/router';
import * as decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string = "";
  error: string = "";

  constructor(private loginService: LoginService,
              private router: Router,
              private menuService: MenuService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    (window as any).initialize();
  }

  iniciarSesion(){
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      //console.log(data);
      if (data) {
        const helper = new JwtHelperService();
        
        let token = JSON.stringify(data);
        console.log(`Token: ${token}`);
        sessionStorage.setItem(TOKEN_NAME, token);
        
        let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
        const decodedToken = helper.decodeToken(tk.access_token);
        //const decodedToken = decode(tk.access_token);
        
        this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
          this.menuService.menuCambio.next(data);
        });
        this.router.navigate(['paciente']);
      }
    });
  }

}
