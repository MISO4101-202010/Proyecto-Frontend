import { Persona } from './persona.model'

export class AlumnoLogin {

  constructor(
    public persona: Persona,
    public codigo_de_estudiante: string,

  ) { }

}


// "user": {
//       "codigo_de_estudiante": "110911",
//       "first_name": "Eduard",
//       "last_name": "Duarte",
//       "email": "eduard.duarte@hotmail.com",
//       "direccion": "kr 56 151 51",
//       "telefono": "6953004",
//       "username": "eduard"
//   },
//   "token": "d6e7e66dd79b64a851eaeba43afe33bf9d4f5942"
