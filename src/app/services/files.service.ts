import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { tap, map } from 'rxjs/operators';
import {environment} from './../../environments/environment'

interface File {
  originalname: string;
  filename: string;
  location: string;
}


@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private apiUrl=`${environment.API_URL}/api/files`; //en el proxy está la url

  constructor(
   private  http: HttpClient
  ) { }

  getFile(name: string, url: string, type: string){
    return this.http.get(url, {responseType: 'blob'})
    .pipe(
      tap( content => { //cual el obs nos envíe el contenido de la petición, podamos ejecutar lógica
        const blob = new Blob([content], {type});
        saveAs(blob, name); //una vez guardado el archivo
      }),
      map(() => true) //me devuelva un true or flase, no necesito contenido
    )
  }

  uploadFile(file: Blob){
    const dto =  new FormData();
    dto.append('file', file);
    return this.http.post<File>(`${this.apiUrl}/upload`,dto, {
      // headers: {  //si necesita el backend puede ser opcional
      //   'Content-type':"multipart/form-data"
      // }
    })
  }
}
