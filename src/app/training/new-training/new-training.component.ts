import { Component, OnInit, OnDestroy} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model'; 
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/map'
import { UIService } from 'src/app/shared/ui.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy{
  exercises : Exercise[];
  exerciseSubcription : Subscription;

  isLoading = false;
  loadingSubscription : Subscription;


  constructor(private trainingService: TrainingService, private uiService : UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(result => this.isLoading = result);
    this.exerciseSubcription = this.trainingService.exercisesChanged
    .subscribe( 
      exercises => {
        this.exercises = exercises;
      });
    this.trainingService.fetchAvailableExercises();    
  }
  ngOnDestroy(){
    this.exerciseSubcription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }

  onStartTraining(f: NgForm){
    let exerciseId = f.value.exercise;
    this.trainingService.startExercise(exerciseId);
  }
}
