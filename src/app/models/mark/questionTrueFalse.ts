export class PreguntaFalsoVerdadero {

  constructor(
    public id: number,
    public nombre: string,
    public numeroDeIntentos: number,
    public tieneRetroalimentacion: boolean,
    public retroalimentacion: string,
    public tipoActividad: number,
    public puedeSaltar: boolean,
    public pregunta: string,
    public esVerdadero: boolean,
    public marca: number,
  ) { }

}
