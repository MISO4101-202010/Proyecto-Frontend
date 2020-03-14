import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';

export interface DialogData {
  marca: any;
}

@Component({
  selector: 'app-crear-pregunta-verdadero-falso',
  templateUrl: './crear-pregunta-verdadero-falso.component.html',
  styleUrls: ['./crear-pregunta-verdadero-falso.component.css']
})
export class CrearPreguntaVerdaderoFalsoComponent implements OnInit {

  questionForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CrearPreguntaVerdaderoFalsoComponent>) {
    this.initializeForm();
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      nombre: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  crearMarca(){
  }

}
