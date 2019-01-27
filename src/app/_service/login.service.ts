import { Router } from '@angular/router';
import { TOKEN_NAME } from './../_shared/var.constant';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOST, TOKEN_AUTH_USERNAME, TOKEN_AUTH_PASSWORD } from '../_shared/var.constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    url: string = `${HOST}/oauth/token`;
    
    constructor(private http
        : HttpClient,
                private router: Router) { }

    login(usuario: string, contrasena: string){
        const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;
        
        return this.http.post(this.url, body, {
            headers: new HttpHeaders().
                set('Content-Type', 
                'application/x-www-form-urlencoded; charset=UTF-8').
                    set('Authorization', 
                    'Basic ' + btoa(TOKEN_AUTH_USERNAME + ':' + TOKEN_AUTH_PASSWORD))
        });
    }

    estaLogeado(){
        let token = sessionStorage.getItem(TOKEN_NAME);
        //console.log(`Estas logeado: ${token}` );
        return token != null;
    }

    cerrarSesion(){
        let token = JSON.parse(sessionStorage.getItem('access_token')).access_token;
        this.http.get(`${HOST}/anular/`);
        sessionStorage.clear();
        this.router.navigate(['login']);
    }

    enviarCorreo(correo: string) {
        console.log(`URL: ${HOST}/login/enviarCorreo` );
        return this.http.post<number>(`${HOST}/login/enviarCorreo`, correo, {
          headers: new HttpHeaders().set('Content-Type', 'text/plain')
        });
    }

    verificarTokenReset(token: string){
        return this.http.get<number>(`${HOST}/login/restablecer/verificar/${token}`);  
    }

    restablecer(token: string, clave: string){
        return this.http.post<number>(`${HOST}/login/restablecer/${token}`, clave, {
            headers: new HttpHeaders().set('Content-Type','text/plain')
        })
    }
}