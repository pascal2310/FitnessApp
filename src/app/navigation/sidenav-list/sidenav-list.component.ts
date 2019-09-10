import { Component, OnInit,EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import {Subscription} from 'rxjs'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sideNavClose = new EventEmitter()
  isAuth = false;
  subscription =  new Subscription();

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.subscription = this.authService.authChange.subscribe(authCheck => {
      this.isAuth = authCheck;
    });
  }
  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();

  }
closeSideNav(){
    this.sideNavClose.emit();
  }
}
