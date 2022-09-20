import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {environment} from './../../environments/environment'
import {CreateUserDTO,User } from './../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl=`${environment.API_URL}/api/users`; //en el proxy está la url

  constructor(
    private http: HttpClient
  ) { }

create(dto: CreateUserDTO){
  return this.http.post<User>(this.apiUrl,dto)
}

getAll(dto: CreateUserDTO){
  return this.http.get<User[]>(this.apiUrl)
}

}
