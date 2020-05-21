import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { InfoLogin } from '../../models/infoLogin.model';
import { AlumnoLogin } from '../../models/alumnoLogin.model';
import { ProfesorLogin } from '../../models/profesorLogin.model';
import { Login } from '../../models/login.model';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  authUrl = `${environment.apiUrl}/users/api-token-auth/`;

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  dataLog: InfoLogin = {
    userToken: null,
    isAlumno: null,
    dataAlumno: null,
    dataProfesor: null,
  };

  constructor(private router: Router, public http: HttpClient) {
    console.log('se llamo el servicio');
  }

  login(usuario: Login): Observable<InfoLogin> {
    return this.http.post(this.authUrl, JSON.stringify(usuario), this.httpOptions)
      .pipe(
        map((response: Response) => {
          this.dataLog.userToken = response.token;
          if (response.role === 'alumno') {
            this.dataLog.isAlumno = true;
            this.dataLog.dataAlumno = response.user;
          } else {
            this.dataLog.isAlumno = false;
            this.dataLog.dataProfesor = response.user;
          }
          this.storage(this.dataLog);
          return this.dataLog;
        }),
        retry(1),
        catchError(err => {
          console.log('Error en el login', err);
          return Observable.throw(err);
        }
        )
      );
  }

  public logout() {
    sessionStorage.removeItem('userConectaTe');
    window.location.href = '/login';
  }

  getDatos(): InfoLogin {
    return this.dataLog;
  }

  private storage(infoLogin: InfoLogin) {
    sessionStorage.setItem('userConectaTe', JSON.stringify(infoLogin));
  }

  getInfoLogin(): InfoLogin {
    if (sessionStorage.getItem('userConectaTe')) {
      this.dataLog = JSON.parse(sessionStorage.getItem('userConectaTe'));
    } else {
      console.log('key not exists');
    }
    return this.dataLog;
  }

  canActivate(): boolean {
    if (!this.dataLog.userToken) {
      this.dataLog = this.getInfoLogin();
    }
    const signedIn = !!this.dataLog.userToken;
    console.log('signedIn: ', signedIn);
    if (!signedIn) {
      this.router.navigateByUrl('/login');
    }
    return signedIn;
  }
}

interface Response {
  token: string;
  role: string;
  user: AlumnoLogin;
}
