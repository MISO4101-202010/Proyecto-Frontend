import { Component, OnInit } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-almuno-interactivo',
  templateUrl: './almuno-interactivo.component.html',
  styleUrls: ['./almuno-interactivo.component.css']
})
export class AlmunoInteractivoComponent implements OnInit {

  idcontenido = 1;
  pauseTime = 0;


  constructor(private modalService: NgbModal, private http: HttpClient) { }

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


  /*open() {
    const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg' });
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.tiempo = this.player.getCurrentTime();
    modalRef.componentInstance.idcontenido = this.idcontenido;
    this.tiempo = this.player.getCurrentTime();
  }*/

  ngOnInit() {
  }
}
