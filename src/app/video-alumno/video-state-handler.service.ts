import { Observable, Subject, Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import * as _ from 'loadsh';

@Injectable({
  providedIn: 'root',
})
export class VideoStateHandler {
  modalOpened: boolean;
  player: YT.Player;
  marks: any[] = [];
  mustOpenMark$: Subject<any> = new Subject<any>();
  reset$: Subject<any> = new Subject<any>();
  changesListeningSubscription: Subscription;
  interval$: Observable<any> = interval(1000);
  lastMarkShown: any;
  lastTimeSeen: number;
  currentVideoTime: number;

  constructor() {}

  async handleVideoState() {
    this.currentVideoTime = Math.round(this.player.getCurrentTime());
    console.log('Player current time', this.currentVideoTime);
    const mark = _.find(this.marks, { punto: this.currentVideoTime });
    if (this.lastMarkShown && this.lastTimeSeen < this.currentVideoTime) {
      this.lastMarkShown = null;
    }
    if (mark && mark !== this.lastMarkShown) {
      this.lastMarkShown = mark;
      this.lastTimeSeen = this.currentVideoTime;
      this.player.pauseVideo();
      this.open(mark);
    }
  }

  open(marca: any) {
    this.modalOpened = true;
    this.mustOpenMark$.next(marca);
  }

  init(marcas: any[], player: YT.Player) {
    this.marks = marcas;
    this.player = player;
    this.changesListeningSubscription = this.interval$
      .pipe(filter(() => !this.modalOpened))
      .subscribe((data) => this.handleVideoState());
  }

  reset() {
    this.reset$.next();
    this.currentVideoTime = -1;
    this.lastTimeSeen = -1;
    this.lastMarkShown = null;
    this.modalOpened = false;
    this.marks = [];
    this.player = null;
    if (this.changesListeningSubscription) {
      this.changesListeningSubscription.unsubscribe();
    }
  }
}
