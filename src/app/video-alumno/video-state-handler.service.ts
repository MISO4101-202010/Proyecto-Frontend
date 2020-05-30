import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root',
})
export class VideoStateHandler {
  modalOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  player: YT.Player;
  marks: any[] = [];
  mustOpenMark$: Subject<any> = new Subject<any>();
  reset$: Subject<any> = new Subject<any>();
  changesListeningSubscription: Subscription;
  interval$: Observable<any> = interval(1000);
  lastMarkShown: any;
  lastTimeSeen: number;
  currentVideoTime: number;
  isFinished$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  async handleVideoState() {
    this.currentVideoTime = Math.round(this.player.getCurrentTime());
    console.log('Player current time', this.currentVideoTime);
    if(this.isFinished()){
      this.isFinished$.next(true);
    }
    const mark = _.find(this.marks, { punto: this.currentVideoTime });
    if (this.lastMarkShown && (this.lastTimeSeen > this.currentVideoTime)) {
      this.lastMarkShown = null;
    }
    if (mark && mark !== this.lastMarkShown) {
      this.lastMarkShown = mark;
      this.lastTimeSeen = this.currentVideoTime;
      this.player.pauseVideo();
      this.open(mark);
    }
  }

  isFinished(){
    return Math.round(this.player.getDuration()) === this.currentVideoTime;
  }

  open(marca: any) {
    this.modalOpened$.next(true);
    this.mustOpenMark$.next(marca);
  }

  init(marcas: any[], player: YT.Player) {
    this.marks = marcas;
    this.player = player;
    this.changesListeningSubscription = this.interval$
      .pipe(filter(() => !this.modalOpened$.getValue()))
      .subscribe((data) => this.handleVideoState());
  }

  reset() {
    this.reset$.next();
    this.isFinished$.next(false);
    this.currentVideoTime = -1;
    this.lastTimeSeen = -1;
    this.lastMarkShown = null;
    this.modalOpened$.next(false);
    this.marks = [];
    this.player = null;
    if (this.changesListeningSubscription) {
      this.changesListeningSubscription.unsubscribe();
    }
  }
}
