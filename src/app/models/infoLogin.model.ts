import { AlumnoLogin } from './alumnoLogin.model';
import { ProfesorLogin } from './profesorLogin.model';

export class InfoLogin {

  constructor(
    public userToken: string,
    public isAlumno: boolean,
    public dataAlumno: AlumnoLogin,
    public dataProfesor: ProfesorLogin,

  ) { }

}
