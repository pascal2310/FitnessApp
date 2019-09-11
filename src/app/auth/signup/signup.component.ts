import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    maxDate;
    isLoading = false;
    subsSubscription : Subscription;

  constructor(private authService : AuthService, private uiService: UIService) { }

  ngOnInit() {
    this.subsSubscription = this.uiService.loadingStateChanged.subscribe(result => this.isLoading = result);
    this.maxDate = new Date()
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }
  
  ngOnDestroy(){
    if(this.subsSubscription){
      this.subsSubscription.unsubscribe();
    }
  }

  onSubmit(f: NgForm){
    this.authService.registerUser({email: f.value.email, password: f.value.password})
  }
}
