
export class LoadVideo {

  constructor(
    public url: string,
    public nombre: string,
    public cursos_seleccionados?: [Cursos]
  ) { }


}
interface Cursos {
  id: number;
}
// "url": "https://www.youtube.com/watch?v=3JuYkJyJh7c",
// "nombre": "We Finally Understand Supergirl's Bizarre History",
// "cursos_seleccionados": [{ "id": 1 }]
