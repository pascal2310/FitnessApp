import { AuthData } from './auth-data.model';
import { Subject} from 'rxjs/Subject';
import {AngularFireAuth} from 'angularfire2/auth'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';


@Injectable()
export class AuthService{
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router : Router, private afAuth : AngularFireAuth, private trainingService : TrainingService, private uiService: UIService, private store : Store<fromRoot.State>){
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
        this.store.dispatch(new UI.StartLoading)
       // this.uiService.loadingStateChanged.next(true);

        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.store.dispatch(new UI.StopLoading)
                // console.log(result);
                // this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.store.dispatch(new UI.StopLoading)

                this.uiService.showSnackbar(error, null, 3000)
                // this.uiService.loadingStateChanged.next(false);   
            });
    }

    login(authData: AuthData){
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading)


        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiService.loadingStateChanged.next(false)
                this.store.dispatch(new UI.StopLoading)

            })
            .catch(error => {
                this.uiService.showSnackbar(error, null, 3000)
                // this.uiService.loadingStateChanged.next(false)
                this.store.dispatch(new UI.StopLoading)

            });
    }

    logout(){
        this.afAuth.auth.signOut();
    }

    isAuth(){
        return this.isAuthenticated;
    }

    
}