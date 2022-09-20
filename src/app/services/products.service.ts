import { Injectable } from '@angular/core';
import { HttpClient,HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry,catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';


import { Product,CreateProductDTO,UpdateProductDTO } from './../models/product.model';
import {environment} from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl=`${environment.API_URL}/api/products`; //en el proxy está la url

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }
    return this.http.get<Product[]>(this.apiUrl, { params })
    .pipe(
      retry(3),
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO){
   return zip( //es lo mismo que Promise.all, envia dos observadores comprimidos y recibir la respuesta al mismo tiempo
    this.getProduct(id),
    this.update(id, dto)
  )
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict){ //409
          return throwError('Algo está fallando en el server');
        }
        if(error.status === HttpStatusCode.NotFound){ //404
          return throwError('El producto no existe');
        }
        if(error.status === HttpStatusCode.Unauthorized){ //401
          return throwError('No estás autorizado');
        }
        return throwError('Ups algo salió mal');
      })
    )
  }

  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: {limit, offset}
    })
    .pipe(
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    )
  }

  create(dto: CreateProductDTO){
    // data se envia en el cuerpo de la petición como un DTO
    //la api devuelve un Producto
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string){
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }


}
