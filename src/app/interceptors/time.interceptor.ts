import { Injectable } from '@angular/core';
import {  HttpRequest,  HttpHandler,  HttpEvent,  HttpInterceptor, HttpContext, HttpContextToken} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const CHECK_TIME = new HttpContextToken<boolean>(()=> false);
export function checkTime(){
  return new HttpContext().set(CHECK_TIME, true)
}

@Injectable()
export class TimeInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.context.get(CHECK_TIME)){
      const start = performance.now(); //evalua el tiempo inicial
      return next
      .handle(request)
      .pipe(
        tap(() => { //tap corre un proceso
          const time = (performance.now() - start) + 'ms'; //una vez que envío una solicitud, evaluo que termino calculo cuanto demoró
          console.log(request.url, time);
        })
      );
    }
    return next.handle(request);
  }
}
