import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/models/Product';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../shared/models/Order';
import { AuthService } from '../../shared/services/auth.service';
import { ProductService } from '../../shared/services/product.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: Array<Product> = [];
  value: number = 0;
  order?: Order;
  totalPrice: number = 0;
  loggedInUser?: firebase.default.User | null;
  UserId: string = '';
  subscription?: Subscription;
  subscription2?: Subscription;
  product: Array<Product> = [];
  updatedFields?: Partial<Product>;
  message?: string;
  isMessageVisible: boolean = false;
  timeOutId?: any;
  style?: {};

  constructor(private cartService: CartService, private authService: AuthService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.authService.isUserLoggedIn().subscribe(
      user => {
        this.loggedInUser = user;
        if(this.loggedInUser){
          this.UserId = this.loggedInUser.uid;
        }
        // console.log(this.loggedInUser?.uid);
      }, error => {
        console.error(error);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  increment(itemsupply: number) {
    if(this.value < itemsupply){
      this.value += 1;
    }
  }

  decrement() {
    if (this.value > 1) {
      this.value -= 1;
    }
  }

  getTotalPrice() {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.supply, 0);
  }

  removeItem(item: Product, value: number){
    this.cartService.removeFromCart(item, value);
  }

  clearCart() {
    this.cartItems = [];
  }

  addOrder(){
    this.message = "Rendelését sikeresen felvettük!";
    this.showMessage();
    this.style = {
      backgroundColor: 'green',
      color: 'white',
      borderRadius: '10px',
      width: '50%',
      margin: 'auto',
      padding: '10px',
      textAlign: 'center',
      fontweight: 'bold',
      fontsize: '25px'
    }
    const products = this.cartItems.map(item => ({
      id: item.id as string,
      amount: item.supply as number
    }));

    this.cartService.createOrder(
      {
        products,
        state: "Szállítás alatt",
        userid: this.UserId,
        totalprice: this.getTotalPrice()
      }
    ).then( () => {
      // console.log("hoozz");
      this.subscription2 = this.productService.getProducts().subscribe(
        (data) => {
          this.product = data
          for (let i = 0; i < this.product.length; i++){
            for(let j = 0; j < products.length; j++){
              if(this.product[i].id === products[j].id){
                this.updatedFields = {
                  supply: this.product[i].supply - products[j].amount
                };
                this.productService.updateProduct(this.product[i].id, this.updatedFields);
              }
            }
          }
          this.subscription2?.unsubscribe();
        }
      );
      this.cartService.deleteCart();
      this.cartItems = [];
    }).catch( (e) => {
      console.error(e);
    });
  }

  showMessage(){
    if(this.timeOutId){
      clearTimeout(this.timeOutId);
    }
    this.isMessageVisible = true;
    
    this.timeOutId = setTimeout(() => {
      this.isMessageVisible = false;
    }, 3000);
  }
}