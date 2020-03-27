import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import Swal from "sweetalert2";
import { ContenidoService } from "src/app/services/contenido.service";

export interface DialogData {
  marca: any;
}

@Component({
  selector: "app-crear-pregunta-pausa",
  templateUrl: "./crear-pregunta-pausa.component.html",
  styleUrls: ["./crear-pregunta-pausa.component.css"]
})
export class CrearPreguntaPausaComponent implements OnInit {
  questionForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrearPreguntaPausaComponent>,
    private contenidoService: ContenidoService
  ) {
    this.initializeForm();
  }

  ngOnInit() {}

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      tiempo: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      enunciado: ["", [Validators.required]]
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  agregarMarca() {
    if (this.questionForm.valid) {
      this.questionForm.value.marca = this.data.marca;
      this.contenidoService
        .agregarMarcaPreguntaPausa(this.questionForm.value)
        .subscribe(
          result => {
            Swal.fire(
              "Agregar Marca",
              "Marca agregada correctamente",
              "success"
            );
            this.dialogRef.close();
          },
          error => {
            console.error(error);
            Swal.fire(
              "Oops...",
              "Ocurrió un error agregando la marca, por favor inténtalo de nuevo",
              "error"
            );
          }
        );
    }
  }
}
