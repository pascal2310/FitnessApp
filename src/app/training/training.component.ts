import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import { TrainingService } from './training.service';


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
    exerciseSubscription: Subscription;
    ongoingTraining = false;
  constructor(private trainingsService : TrainingService) {
   }

  ngOnInit() {
    this.exerciseSubscription = this.trainingsService.exerciseChange.subscribe(exercise => {
      if(exercise){
        this.ongoingTraining = true;
      }else{
        this.ongoingTraining = false;
      }
    });

  }
  
  ngOnDestroy(){
    this.trainingsService.exerciseChange.unsubscribe();
  }
  test(){
    console.log("test")
  }
}
