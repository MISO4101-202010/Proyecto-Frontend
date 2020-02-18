export class OpcionesPreguntaMultiple {

  constructor(
    public id: number,
    public opcion: string,
    public esCorrecta: boolean,
    public preguntaSeleccionMultiple: number
  ) { }

}
