import { OpcionesPreguntaMultiple } from './optionsQuestionMultiple.model';
export class PreguntaOpcionMultiple {

  constructor(
    public id: number,
    public enunciado: string,
    public esMultipleResp: boolean,
    public opciones: Array<OpcionesPreguntaMultiple>,
    public tieneRetroalimentacion: boolean
  ) { }

}
