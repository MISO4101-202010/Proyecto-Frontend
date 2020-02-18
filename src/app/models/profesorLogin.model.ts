import { Persona } from './persona.model'

export class ProfesorLogin {

    constructor(
        public persona: Persona,
        public facultad?: string,
        public cursos?: [string]
    ) { }

}


// "user": {
//       "username": "profesoruno",
//       "first_name": "carlos",
//       "last_name": "donoso",
//       "email": "carlos.donoso@hotmail.com",
//       "direccion": "kr 56 151 51",
//       "telefono": "6953004",
//       "facultad": "sistemas",
//       "cursos": []
//   },
//   "token": "5851d2906b019a4e78259b766eac0220bcbbef22"
// }
