import { DialogoPacienteComponent } from './pages/paciente/dialogo/dialogo-paciente.component';
import { TOKEN_NAME } from './_shared/var.constant';
import { ServerErrorsInterceptor } from './_shared/server-errors.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { MaterialModule } from './material/material.module';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { Not403Component } from './pages/not403/not403.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { DialogoComponent } from './pages/medico/dialogo/dialogo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { EspecialComponent } from './pages/consulta/especial/especial.component';
import { DialogoDetalleComponent } from './pages/buscar/dialogo-detalle/dialogo-detalle.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoginComponent } from './login/login.component';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { RecuperarComponent } from './login/recuperar/recuperar.component';
import { TokenComponent } from './login/recuperar/token/token.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PerfilComponent } from './perfil/perfil.component';
import { SignoComponent } from './pages/signo/signo.component';
import { SignoEdicionComponent } from './pages/signo/signo-edicion/signo-edicion.component';

export function tokenGetter() {
  let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
  let token = tk != null ? tk.access_token : '';
  return  token;
}

@NgModule({
  declarations: [
    AppComponent,
    BuscarComponent,
    ConsultaComponent,
    EspecialidadComponent,
    ExamenComponent,
    MedicoComponent,
    PacienteComponent,
    ReporteComponent,
    Not403Component,
    PacienteEdicionComponent,
    EspecialidadEdicionComponent,
    ExamenEdicionComponent,
    DialogoComponent,
    MatConfirmDialogComponent,
    EspecialComponent,
    DialogoDetalleComponent,
    LoginComponent,
    RecuperarComponent,
    TokenComponent,
    PerfilComponent,
    SignoComponent,
    SignoEdicionComponent,
    DialogoPacienteComponent
  ],
  entryComponents: [DialogoComponent, MatConfirmDialogComponent, DialogoDetalleComponent, DialogoPacienteComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost'],
        blacklistedRoutes: ['localhost/#/login/enviarCorreo']
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorsInterceptor,
    multi: true,
  },
  {
    provide: LocationStrategy, useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
