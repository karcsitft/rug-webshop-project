import { Injectable} from '@angular/core';
import { Product } from '../models/Product';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: Array<Product> = [];
  dataSubject = new BehaviorSubject<number>(0);
  currentData = this.dataSubject.asObservable();
  supplynumber: number = 0;
  order?: Order;

  constructor(private afs: AngularFirestore) {}

  addToCart(product: Product){
    if (this.cart.length === 0)
    {
      product.supply = 1;
      this.cart.push(product);
      return;
    }

    for (let i = 0; i < this.cart.length; i++){
      if(this.cart[i].id === product.id){
        this.cart[i].supply++;
        // console.log("Növelve a termékszám!");
        // console.log(this.cart);
        return;
      }
    }

    product.supply = 1;
    this.cart.push(product);
    // console.log("Sikeres hozzáadás!");
    // console.log(this.cart);
  }

  updateData(newData: number) {
    this.dataSubject.next(newData);
  }

  getCartItems(){
    return this.cart;
  }

  removeFromCart(item: Product, value: number){
    for(let i = 0; i < this.cart.length; i++){
      if(this.cart[i].id === item.id){
        if(this.cart[i].supply < value){
          this.updateData(this.dataSubject.value - this.cart[i].supply);
          this.cart[i].supply = 0;
          this.cart.splice(i, 1);
        }
        else{
          this.updateData(this.dataSubject.value - value);
          this.cart[i].supply -= value;
        }
        if(this.cart[i]){
          if(this.cart[i].supply === 0){
            this.cart.splice(i, 1);
          }
        }
      }
    }
  }

  deleteCart(){
    this.cart = [];
    this.updateData(0);
  }


  // CRUD DATA BASE

  createOrder(order: Order){
    order.id = this.afs.createId();
    return this.afs.collection<Order>("Orders").doc(order.id).set(order);
  }

  updateOrder(order: Order) {
    return this.afs.collection<Order>("Orders").doc(order.id).update(order);
  }

  getOrders(){
    return this.afs.collection<Order>("Orders").valueChanges();
  }

  deleteOrder(order: Order){
    return this.afs.collection<Order>("Orders").doc(order.id).delete();
  }

}
