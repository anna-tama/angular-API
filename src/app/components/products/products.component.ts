import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen : Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: ''
      ,name: ''
    },
    description: ''
  }
  limit = 10;
  offset = 0;
  statusDetail: 'loading'| 'sucess' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10,0) //trae 10 elementos, inicia el offset en 0
    .subscribe(data => {
      this.products = data;
      this.offset += this.limit;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail= !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productsService.getProduct(id)
    .subscribe(data=>{
      this.productChosen = data;
      this.statusDetail = 'sucess';
    }, errorMsg => {
      window.alert(errorMsg);
      //console.log(response) //devuelve las que puse en el service con HttpStatusCode
      // console.error(response.error.message); //devuelve el error del backend
      this.statusDetail = 'error';
    })
  }

  readAndUpdate(id: string){
    this.productsService.getProduct(id)
    .pipe(
      //switchmap corre primero una y luego otra a diferencia de zip que lo hace en paralelo
      switchMap( (product) => this.productsService.update(product.id, {title:'change'} )),
      // switchMap( (product) => this.productsService.update(product.id, {title:'change'} )), ser??a lo mismo que las promises .then
      // switchMap( (product) => this.productsService.update(product.id, {title:'change'} )),
    )
    .subscribe(data => {
      console.log(data);
      //todo esto es un callback hell
      // const product = data;
      // this.productsService.update(product.id, {title:'change'})
      // .subscribe(rtaUpdate => {
      //   console.log(rtaUpdate)
      // })
    });
  this.productsService.fetchReadAndUpdate(id,{title:'change'} )
    .subscribe(response => {
      const read = response[0]; //getProduct
      const update = response[1] //update
    })
  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title: 'Nuevo producto',
      description: 'bla bla',
      images: [''],
      price: 1000,
      categoryId: 2
    }
    this.productsService.create(product)
    .subscribe(data => {
      console.log('created',data)
      this.products.unshift(data);
      //inserta en la primera posici??n del array
    })
  }

  updateProduct(){
    const changes: UpdateProductDTO = {
      title : 'Nuevo title',
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id)
      this.products[productIndex] = data;
      this.productChosen = data;
    })
  }

  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(() => { //est?? vaci?? porque el m??todo productsService.delete(id) devuelve boolean
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id)
      this.products.splice(productIndex,1);
      this.showProductDetail = false;
    })
  }

  loadMore(){
    this.productsService.getProductsByPage(this.limit,this.offset) //trae 10 elementos, inicia el offset en 0
    .subscribe(data => {
     this.products = this.products.concat(data); //no sobreescribe, concatena nuevos elementos
     this.offset += this.limit;
    });
  }






}
