import { Actividad } from './activity.model'

export class Marca {

  constructor(
    public punto: Int16Array,
    public nombre: string,
    public actividades: Array<Actividad>
  ) { }

}
