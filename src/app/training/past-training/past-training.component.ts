import { Component, OnInit, ViewChild, AfterViewInit, } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer'

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories','state'];

    @ViewChild(MatSort, {static: true}) sort : MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator : MatPaginator;

  constructor(private trainingService : TrainingService, private store : Store<fromTraining.TrainingState>) { }


  ngOnInit() {
    this.store.select(fromTraining.getFinishedTrainings).subscribe(ex => this.dataSource.data = ex);
    this.trainingService.fetchPastExercises();
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(input : string){
    this.dataSource.filter= input.trim().toLowerCase();
  }
}
