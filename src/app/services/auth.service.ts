import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

import {environment} from './../../environments/environment';
import {Auth} from './../../app/models/auth.model';
import {User} from './../../app/models/user.model'
import { TokenService } from './../services/token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl=`${environment.API_URL}/api/auth`; //en el proxy está la url

  constructor(
    private http: HttpClient
    , private tokenService: TokenService
  ) { }

  login(email:string, password: string){
    return this.http.post<Auth>(`${this.apiUrl}/login`,{email,password})
    .pipe(
      tap(response => this.tokenService.saveToken(response.access_token)) //tiene la response del login, no es async
    );
  }

   getProfile(){ // (token:string) no hace falta porque el interceptor detecta si el usuario tiene un token en el localstorage y lo agrega a la petición
    // const headers= new HttpHeaders();
    // headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profile`,{
      // headers: {
      //   Authorization: `Bearer ${token}`,
        // 'Content-type': 'application/json'
      // }
    });
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap(() => this.getProfile()),
    )
  }

}
