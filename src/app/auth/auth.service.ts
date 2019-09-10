import { AuthData } from './auth-data.model';
import { Subject} from 'rxjs/Subject';
import {AngularFireAuth} from 'angularfire2/auth'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui.service';


@Injectable()
export class AuthService{
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router : Router, private afAuth : AngularFireAuth, private trainingService : TrainingService, private snackbar : MatSnackBar, private uiService: UIService){
    }
    initAuthListener(){
        this.afAuth.authState.subscribe(user =>{
            if(user){
                this.authChange.next(true);
                this.router.navigate(['/training']);
                this.isAuthenticated = true;
            }else{
                this.trainingService.cancelSubsctiptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        })
    }

    registerUser(authData: AuthData){
        this.uiService.loadingStateChanged.next(true);

        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.snackbar.open(error.message, null, {duration: 3000})
                this.uiService.loadingStateChanged.next(false);   
            });
    }

    login(authData: AuthData){
        this.uiService.loadingStateChanged.next(true);

        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false)
            })
            .catch(error => {
                this.snackbar.open(error, null, {duration: 3000}); 
                this.uiService.loadingStateChanged.next(false)
            });
    }

    logout(){
        this.afAuth.auth.signOut();
    }

    isAuth(){
        return this.isAuthenticated;
    }

    
}