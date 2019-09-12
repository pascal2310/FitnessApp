import { Component, OnInit} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model'; 
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import * as fromTraining from '../training.reducer'
import * as fromRoot from '../../app.reducer'
import {Store} from '@ngrx/store';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit{
  exercises$ : Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.TrainingState>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableTrainings)
  
    this.fetchExercises();
  }

  fetchExercises(){ 
    this.trainingService.fetchAvailableExercises();    
  }

  onStartTraining(f: NgForm){
    let exerciseId = f.value.exercise;
    this.trainingService.startExercise(exerciseId);
  }
}
