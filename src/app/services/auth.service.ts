import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {environment} from './../../environments/environment';
import {Auth} from './../../app/models/auth.model';
import {User} from './../../app/models/user.model'



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl=`${environment.API_URL}/api/auth`; //en el proxy está la url

  constructor(
    private http: HttpClient
  ) { }

  login(email:string, password: string){
    return this.http.post<Auth>(`${this.apiUrl}/login`,{email,password});
  }

  profile(token: string){
    // const headers= new HttpHeaders();
    // headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profile`,{
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-type': 'application/json'
      }
    });
  }

}
