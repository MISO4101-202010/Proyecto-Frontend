import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/usuario/auth.service';
import { Persona } from '../models/persona.model';
import { Login } from '../models/login.model';
import Swal from 'sweetalert2';
declare const gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame = false;
  auth2: any;

  username: any;
  password: any;

  usuario: Persona;
  constructor(
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
  }
  // this.usuario
  ingresar(forma: NgForm) {
    console.log(forma);
    if (forma.invalid) {
      Swal.fire('Oops...', 'revisa los datos ingresados', 'error');
      return;
    }

    const userLogin = new Login(forma.value.username, forma.value.password);
    this.authService.login(userLogin)
      .subscribe(
        result => {
          console.log(result);
          if (result.isAlumno) {
            this.router.navigate(['/cursos/misCursos']);
          } else {
            this.router.navigate(['/cursos']);
          }
        },
        error => {
          console.log(error);
          Swal.fire('Oops...', 'revisa los datos ingresados', 'error');
        },
      );
  }
  // "username": "eduard",
  // "password": "2614eduard2614"

  //     "username": "profesoruno",
  // "password": "2614eduard"
}
