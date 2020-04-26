import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidoService } from 'src/app/services/contenido.service';

export interface DialogData {
  marca: any;
}

@Component({
  selector: 'app-crear-pregunta-abierta',
  templateUrl: './crear-pregunta-abierta.component.html',
  styleUrls: ['./crear-pregunta-abierta.component.css']
})
export class CrearPreguntaAbiertaComponent implements OnInit {

  questionForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrearPreguntaAbiertaComponent>,
    private contenidoService: ContenidoService) {

    this.initializeForm();
  }

  ngOnInit() {
  }

  initializeForm() {
    console.log('abierta',this.data);
    this.questionForm = this.formBuilder.group({
      marca_id: [this.data.marca.pregunta ? this.data.marca.pregunta[0].marca : ''],
      abierta_id: [this.data.marca.pregunta ? this.data.marca.pregunta[0].id : ''],
      enunciado: [this.data.marca.pregunta ? this.data.marca.pregunta[0].enunciado : '', [Validators.required]],
      nombre: [this.data.marca.pregunta ? this.data.marca.pregunta[0].nombre : '', [Validators.required]]
    });
    if (!this.data.marca.pregunta) {
      this.questionForm.removeControl('marca_id');
      this.questionForm.removeControl('abierta_id');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  agregarMarca() {
    console.log('data', this.data);
    console.log('form', this.questionForm.value);
    if (this.questionForm.valid) {
      let texto;
      let texto2;
      let texto3;
      if (this.data.marca.pregunta) {
        delete this.data.marca.pregunta;
        texto = 'Actualizar Marca';
        texto2 = 'Marca actualizada correctamente';
        texto3 = 'actualizando';
      } else{
        texto = 'Agregar Marca';
        texto2 = 'Marca agregada correctamente';
        texto3 = 'agregando';
      }
      this.questionForm.value.marca = this.data.marca;
      this.contenidoService.agregarMarcaPreguntaAbierta(this.questionForm.value).subscribe(result => {
        Swal.fire(texto, texto2, 'success');
        this.dialogRef.close();
      }, error => {
        console.error(error);
        Swal.fire('Oops...', 'Ocurrió un error '+ texto3 +' la marca, por favor inténtalo de nuevo', 'error');
      });
    }
  }
}
