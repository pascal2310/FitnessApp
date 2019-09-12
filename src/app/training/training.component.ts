import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import{ Store } from '@ngrx/store';

import { TrainingService } from './training.service';
import * as fromTraining from './training.reducer'


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
    ongoingTraining$: Observable<boolean>;

  constructor(private store: Store<fromTraining.TrainingState>) {
   }

  ngOnInit() {
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining)

  }
}
