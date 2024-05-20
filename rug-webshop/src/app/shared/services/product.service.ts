import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/Product';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage  
  ) {}

  // CRUD (Create, Read, Update, Delete)

  createProduct(product: Product) {
    return this.afs.collection<Product>('Products').add(product);
  }

  getProducts() {
    return this.afs.collection<Product>('Products').valueChanges();
  }

  updateProduct(productid: string, updatedFields: Partial<Product>){
    return this.afs.collection<Product>('Products').doc(productid).update(updatedFields);
  }

  deleteProduct(productid: string){
    return this.afs.collection<Product>('Products').doc(productid).delete();
  }

}
