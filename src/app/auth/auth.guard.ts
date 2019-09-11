import { Router, CanLoad} from '@angular/router'
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';

@Injectable()
export class AuthGuard implements  CanLoad{

constructor(private authService : AuthService, private router : Router){}
    canLoad(route: Route){
        if (this.authService.isAuth()){
            return true;
        }else{
            this.router.navigate(['/login']);
       }
    }
}