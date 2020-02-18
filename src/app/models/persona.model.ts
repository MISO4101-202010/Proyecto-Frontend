export class Persona {

  constructor(
    public username: string,
    public email: string,
    public first_name: string,
    public last_name?: string,
    public direccion?: string,
    public telefono?: string,
  ) { }

}
