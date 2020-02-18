import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {RequestMethod, RequestOptions} from '@angular/http';
import { DynamicGrid } from '../grid.model';
import {
  HtmlEditorService,
  ImageService,
  LinkService,
  TableService,
  ToolbarService
} from '@syncfusion/ej2-angular-richtexteditor';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Agregar Respuestas</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
 <br>

  <div class="container" style="margin-top: 5%">    
    <table class="table table-striped table-bordered">    
        <thead>    
            <tr>    
                <th>Action</th>    
                <th>Respuesta</th>    
                <th>Es correcta</th>    
                <th style="display:none;">Title 3</th>    
            </tr>    
        </thead>    
        <tbody>    
             <tr *ngFor="let dynamic of dynamicArray; let i = index;">    
              <td (click)="deleteRow(i)">    
                <i class="fa fa-trash fa-2x"></i>    
              </td>    
                <td>    
                  <input [(ngModel)]="dynamicArray[i].respuesta" class="form-control" type="text" />    
                </td>    
                <td>    
                  <input [(ngModel)]="dynamicArray[i].esCorrecta" type="checkbox" name="vehicle" value="Car" checked>  
                </td>    
                <td style="display:none;">
                  <input [(ngModel)]="dynamicArray[i].preguntaSeleccionMultiple" class="form-control" type="text"/>    
                </td>    
                <td (click)="addRow(i)">    
                <i class="fa fa-plus fa-2x"></i>    
              </td>   
            </tr>       
        </tbody>    
    </table>    
  </div>    
    </div>

   <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
        <button type="button" class="btn btn-outline-success" (click)="httpPostExample();activeModal.close('Close click');">Guardar respuestas</button>
    </div>
  `,
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})

// tslint:disable-next-line:component-class-suffix
export class NgbdModal3Content implements OnInit  {
  @Input() preguntaid;
  @Input() respuesta;
  @Input() esCorrecta;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private http: HttpClient, private toastr: ToastrService) {}

  dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};
  ngOnInit(): void {
    this.newDynamic = { respuesta: "", esCorrecta: false, preguntaSeleccionMultiple: this.preguntaid};
      this.dynamicArray.push(this.newDynamic);
  }

  addRow(index) {
    this.newDynamic = { respuesta: "", esCorrecta: false, preguntaSeleccionMultiple: this.preguntaid};
      this.dynamicArray.push(this.newDynamic);
      this.toastr.success('New row added successfully', 'New Row');
    console.log(this.dynamicArray);

      return true;
  }

  deleteRow(index) {
    if (this.dynamicArray.length == 1) {

        this.toastr.error('Cant delete the row when there is only one row', 'Warning');
        return false;
      } else {
          this.dynamicArray.splice(index, 1);
          this.toastr.warning('Row deleted successfully', 'Delete row');
          return true;
      }
  }

  httpPostExample() {

    for (let i = 0; i < this.dynamicArray.length; i++) {



      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

      this.http.post(`${environment.apiUrl}/activities/resp_op_multiple`,
        {
          respuesta: this.dynamicArray[i].respuesta,
          esCorrecta: this.dynamicArray[i].esCorrecta,
          preguntaSeleccionMultiple: this.preguntaid
        }, { headers })
        .subscribe(
          (val: any) => {

            console.log('POST call successful value returned in body',
              val);
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');
          });

    }

  }
}


@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Agregar pregunta</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p></p>
        <textarea name="comentarios" rows="10" cols="40"  placeholder="Escriba aca su pregunta" [(ngModel)]="pregunta"></textarea>
            </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
        <button type="button" class="btn btn-outline-success" (click)="httpPostExample();activeModal.close('Close click');">Crear pregunta</button>
    </div>
  `
})
// tslint:disable-next-line:component-class-suffix
export class NgbdModal2Content {

  @Input() actividadid;
  @Input() pregunta;
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private http: HttpClient) { }

  httpPostExample() {

    console.log('POST call successful value returned in body',
      this.pregunta);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    this.http.post(`${environment.apiUrl}/activities/pregunta`,
      {
        Pregunta: this.pregunta,
        actividad: this.actividadid,
      }, { headers })
      .subscribe(
        (val: any) => {

          console.log('POST call successful value returned in body',
            val);
          const modalRef = this.modalService.open(NgbdModal3Content, { size: 'lg' });
          modalRef.componentInstance.preguntaid = val.id;
        },
        response => {
          console.log('POST call in error', response);
        },
        () => {
          console.log('The POST observable is now completed.');
        });
  }

  /*open() {
    this.modalService.open(NgbdModal2Content, {
      size: 'lg'
    });
  }*/
}




@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Agregar Actividad</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p></p>
        <input type="text" name="nombre de marca" placeholder="Nombre de actividad" [(ngModel)]="nombre" required>
         <br><br>
        <input type="text" name="nombre de marca"  placeholder="Numero de intentos" [(ngModel)]="intentos" required>

    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
        <button type="button" class="btn btn-outline-success" (click)="httpPostExample();activeModal.close('Close click');">Crear Actividad</button>
    </div>
  `
})
// tslint:disable-next-line:component-class-suffix
export class NgbdModal1Content {
  @Input() marcaid;
  @Input() nombre;
  @Input() intentos;
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private http: HttpClient) {}

    httpPostExample() {
const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

this.http.post(`${environment.apiUrl}/activities/actividad`,
    {
    nombre: this.nombre,
    numeroDeIntentos: this.intentos,
    tieneRetroalimentacion: false,
    marca: this.marcaid,

}, {headers})
    .subscribe(
        (val: any) => {

            console.log('POST call successful value returned in body',
                        val);
            const modalRef = this.modalService.open(NgbdModal2Content, {size: 'lg'});
            modalRef.componentInstance.actividadid = val.id;
        },
        response => {
            console.log('POST call in error', response);
        },
        () => {
            console.log('The POST observable is now completed.');
        });
}

  /*open() {
    this.modalService.open(NgbdModal2Content, {
      size: 'lg'
    });
  }*/
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Hola, deseas crear marca en , {{tiempo}}!</p>
        <input type="text" name="nombre de marca" placeholder="Nombre de Marca" [(ngModel)]="marcaNombre" required>

    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
        <button type="button" class="btn btn-outline-success" (click)="httpPostExample();activeModal.close('Close click')">Crear Marca</button>
    </div>
  `
})
// tslint:disable-next-line:component-class-suffix
export class NgbdModalContent {
  marcaNombre;
  @Input() name;
  @Input() tiempo;
  @Input() idcontenido;
  marcaid;


  httpPostExample() {
const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

this.http.post(`${environment.apiUrl}/activities/marca`,
    {
    nombre: this.marcaNombre,
    punto: Math.round(this.tiempo),
    contenido: this.idcontenido
}, {headers})
    .subscribe(

        (val: any) => {
          console.log('POST call successful value returned in body',
                        val);
          const modalRef = this.modalService.open(NgbdModal1Content);
          modalRef.componentInstance.marcaid = val.id;

        },

        response => {
            console.log('POST call in error', response);
        },
        () => {

            console.log('The POST observable is now completed.');
        });
}



  constructor(public activeModal: NgbActiveModal, private http: HttpClient, private modalService: NgbModal) {}

}


@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.css']
})


export class VideoModalComponent implements OnInit {
  @Input() tiempo;
  idcontenido = 6;
  pauseTime = 0;


  constructor(private modalService: NgbModal, private http: HttpClient) {}

  player: YT.Player;
  id = 'qDuKsiwS5xw';

  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }
  onStateChange(event) {


   /* if (event.data == YT.PlayerState.PAUSED) {
          alert('Me detuve en el segundo  dasd' + this.player.getCurrentTime());
        }
    console.log('player state', event.data);
  */
   }


  open() {
    const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg' });
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.tiempo = this.player.getCurrentTime();
    modalRef.componentInstance.idcontenido = this.idcontenido;
    this.tiempo = this.player.getCurrentTime();
  }

  ngOnInit() {
  }

}

