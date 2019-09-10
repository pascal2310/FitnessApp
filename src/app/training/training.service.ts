import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService{
    exerciseChange = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    pastExercisesChanged = new Subject<Exercise[]>();

    private runningExercise: Exercise;
    private availableExercises: Exercise[] = [];
    private pastExercises : Exercise[] = [];
    private authSubscriptions: Subscription[] = [];


    constructor(private db : AngularFirestore){
        
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
            this.availableExercises = exercises,
            this.exercisesChanged.next([...this.availableExercises]);

          }));
    }
    startExercise(exerciseId: string){
        this.runningExercise = this.availableExercises.find(exercise => exercise.id === exerciseId);
        this.exerciseChange.next({...this.runningExercise});
      }


    completeExercise(){
        this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'})
        this.runningExercise = null;
        this.exerciseChange.next(null);
    }  
    cancelExercise(percentage : number){
        this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'cancelled', duration: this.runningExercise.duration/100 *percentage , calories: this.runningExercise.calories/100 * percentage, })
        this.runningExercise = null;
        this.exerciseChange.next(null);
    }

    private addDataToDatabase(exercise : Exercise){
        this.db.collection('finishedExercises').add(exercise);

    }

    fetchPastExercises(){
        this.authSubscriptions.push(this.db.collection('finishedExercises').snapshotChanges().map(docArray =>{
            return docArray.map((doc)=> {
                return { id: doc.payload.doc.id,
                ...doc.payload.doc.data()
                }
            })
        }).subscribe((exercises:Exercise[])=> {
            this.pastExercises = exercises;
            this.pastExercisesChanged.next([...this.pastExercises])
            
        }));
    }
      getCurrentExercise(){
          return ({...this.runningExercise});
      }
      cancelSubsctiptions(){
          this.authSubscriptions.forEach(sub => sub.unsubscribe());
      }
}