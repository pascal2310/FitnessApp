import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories','state'];

  private exChangedSubscription : Subscription;


    @ViewChild(MatSort, {static: true}) sort : MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator : MatPaginator;

  constructor(private trainingService : TrainingService) { }


  ngOnInit() {
    this.exChangedSubscription = this.trainingService.pastExercisesChanged.subscribe(exercises => {
      this.dataSource.data = exercises
    })
    this.trainingService.fetchPastExercises();
  }

  ngOnDestroy(){
    this.exChangedSubscription.unsubscribe();
  }
  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(input : string){
    this.dataSource.filter= input.trim().toLowerCase();
  }
}
