import { Injectable } from '@angular/core';
import {  HttpRequest,  HttpHandler,  HttpEvent,  HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService} from './../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addToken(request); //envío el request original
    return next
    .handle(request);
  }

  private addToken(request: HttpRequest<unknown>){
    const token = this.tokenService.getToken();
    if(token) {
      const authReq = request.clone({
        headers: request.headers.set( 'Authorization', `Bearer ${token}`)
      })
      return authReq; //request clonado y modificado el header
    }
    return request; //request original
  }
}
