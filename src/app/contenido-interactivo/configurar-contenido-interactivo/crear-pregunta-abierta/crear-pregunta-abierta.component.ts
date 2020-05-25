import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidoService } from 'src/app/services/contenido.service';

export interface DialogData {
  marca: any;
  tiene_retroalimentacion?: boolean;
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
      marca_id: [this.data.marca.pregunta ? this.data.marca.pregunta.marca : ''],
      abierta_id: [this.data.marca.pregunta ? this.data.marca.pregunta.id : ''],
      enunciado: [this.data.marca.pregunta ? this.data.marca.pregunta.enunciado : '', [Validators.required]],
      nombre: [this.data.marca.pregunta ? this.data.marca.pregunta.nombre : '', [Validators.required]],
      tieneRetroalimentacion: [this.data.marca.tieneRetroalimentacion ? this.data.marca.pregunta.tieneRetroalimentacion : false],
      retroalimentacion: [this.data.marca.retroalimentacion ? this.data.marca.pregunta.retroalimentacion : ''],
    });
    if(this.data.tiene_retroalimentacion){
      this.questionForm.get('tieneRetroalimentacion').setValue(true);
    }
    if (!this.data.marca.pregunta) {
      this.questionForm.removeControl('marca_id');
      this.questionForm.removeControl('abierta_id');
    }
  }

  delete() {
    Swal.fire({
      title: '¿Eliminar?',
      text: "¿Estas a punto de elminiar la marca creada, estas seguro?",
      type:'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        this.contenidoService
          .eliminarMarcaPregunta(this.data.marca.id)
          .subscribe(
            (result) => {
              Swal.fire(
                'Marca Eliminada!',
                'Tu marca ha sido eliminada exitosamente.',
                'success'
              );
              this.dialogRef.close();
            },
            (error) => {
              console.error(error);
              Swal.fire(
                'Oops...',
                'Ocurrió un error al tratar de eliminar la marca, por favor inténtalo de nuevo',
                'error'
              );
            }
          );
      }
    }).catch(error => {
      console.log(error);
    })
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
