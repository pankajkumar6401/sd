import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { LaravelProvider } from '../laravel/laravel';

/*
  Generated class for the AuthInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthInterceptorProvider implements HttpInterceptor {
  private laravel: LaravelProvider;

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.laravel = this.injector.get(LaravelProvider);
    const idToken = this.laravel.getToken();
    if(idToken){
      const authReq = req.clone({
        headers: req.headers.set('Authorization', idToken)
      });
      return next.handle(authReq);
    }else{
      return next.handle(req);  
    }
  } 

  constructor(private injector: Injector){

  }

}
