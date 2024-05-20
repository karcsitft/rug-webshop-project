import { Component} from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../shared/models/Product';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../shared/services/product.service';
import { User } from '../../shared/models/User';
import { Order } from '../../shared/models/Order';
import { UserService } from '../../shared/services/user.service';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy{
  AllProducts: Array<Product> = [];
  loadingSubscription?: Subscription;
  users?: Array<User>;
  orders?: Array<Order>;

  constructor(private adminService: AdminService, private productService: ProductService,
    private userService : UserService, private cartService: CartService
  ){}

  ngOnInit(): void {
    this.loadingSubscription = this.productService.getProducts().subscribe(
      (data) => {
        this.AllProducts = data;
        for (let i = 0; i < data.length; i++) {
          this.adminService.loadImage(data[i].image_url).subscribe(data =>{
            this.AllProducts[i].image_url = data;
          });
        }
      }
    );
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data as User[];
      }
    );
    this.cartService.getOrders().subscribe(
      (data) => {
        this.orders = data as Order[];
      }
    );
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }
}