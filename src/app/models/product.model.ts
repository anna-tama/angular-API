export interface Category {
  id: string;
name: string;
}


export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
}

export interface CreateProductDTO extends Omit<Product, 'id' | 'category'>{
  categoryId: number;
}
// Omit<Product, 'id' | 'category'> traeme un producto sin id o category


export interface UpdateProductDTO extends Partial<CreateProductDTO>{
  //Partial coloca como optional todos los atributos

}
