import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  ongoingTraining= false;
  timer: any;
  progress= 0;
  currentExercise;

  @Output() trainingExit = new EventEmitter();
  constructor(public dialog: MatDialog, private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.startOrResumeTimer();
    this.currentExercise = this.trainingService.getCurrentExercise();
  }

  startOrResumeTimer(){
    const step = this.trainingService.getCurrentExercise().duration *10;

    this.timer = setInterval(() => {
      this.progress += 1;
      if(this.progress >= 100){
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);

  }

  onStop(){
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress : this.progress,
      }
    });
      dialogRef.afterClosed().subscribe((result)=> {
        if(result){
          this.trainingService.cancelExercise(this.progress);  
        }else{
          this.startOrResumeTimer()
        }
      })
  }
}
