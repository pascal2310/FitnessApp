import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromTraining from '../training/training.reducer';
import * as Training from '../training/training.actions';
import * as UI from '../shared/ui.actions';
import { take } from 'rxjs/operators';


@Injectable()
export class TrainingService{
    private authSubscriptions: Subscription[] = [];

    constructor(private db : AngularFirestore, private uiService: UIService, private store: Store<fromTraining.TrainingState>){        
    }
    
    fetchAvailableExercises(){
        this.authSubscriptions.push(this.db.collection('availableExcercises').snapshotChanges().map(docData => {
            return docData.map((doc) => {
              return {
               id: doc.payload.doc.id,
               ...doc.payload.doc.data()
              }      
            })
          }).subscribe((exercises : Exercise[]) => {
            this.store.dispatch(new UI.StopLoading);
            this.store.dispatch(new Training.SetAvailableTrainings(exercises))

          }, error => {
            this.store.dispatch(new UI.StopLoading);
            this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000),
            this.store.dispatch(new UI.StopLoading);

        }));
    }
    startExercise(exerciseId: string){
        this.store.dispatch(new Training.StartTraining(exerciseId))
      }

    completeExercise(){
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex, 
                date: new Date(), 
                state: 'completed'
            });
        this.store.dispatch(new Training.StopTraining());
        });
    }  
    cancelExercise(percentage : number){
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex, 
                date: new Date(), 
                state: 'cancelled', 
                duration: ex.duration/100 * percentage, 
                calories: ex.calories/100 * percentage, 
            });
            this.store.dispatch(new Training.StopTraining());
        })   
    }

    private addDataToDatabase(exercise : Exercise){
        this.db.collection('finishedExercises').add(exercise);
    }

    fetchPastExercises(){
        this.store.dispatch(new UI.StartLoading())

        this.authSubscriptions.push(this.db.collection('finishedExercises').snapshotChanges().map(docArray =>{
            return docArray.map((doc)=> {
                return { id: doc.payload.doc.id,
                ...doc.payload.doc.data()
                }
            })
        }).subscribe((exercises:Exercise[])=> {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));            
        }, error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000),
            this.store.dispatch(new UI.StopLoading);

        }));
    }
      cancelSubsctiptions(){
          this.authSubscriptions.forEach(sub => sub.unsubscribe());
      }
}