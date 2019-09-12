import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import {Subscription, Observable} from 'rxjs'
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sideNavClose = new EventEmitter()
  isAuth$: Observable<boolean>;
  subscription =  new Subscription();

  constructor(private authService : AuthService, private store : Store<fromRoot.State>) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }
  onLogout(){
    this.authService.logout();
  }

closeSideNav(){
    this.sideNavClose.emit();
  }
}
