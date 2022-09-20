import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FilesService {

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
}
