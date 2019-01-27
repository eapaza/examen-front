import { DetalleConsulta } from './detalleConsulta';
import { Especialidad } from './especialidad';
import { Paciente } from "./paciente";
import { Medico } from './medico';

export class Consulta{
    public idConsulta: number;
    public paciente: Paciente;
    public fecha: string;
    public medico: Medico;
    public especialidad: Especialidad;
    public detalleConsulta: DetalleConsulta[];
}