import { Component } from '@angular/core';
import { Order } from '../../shared/models/Order';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  orders: Array<Order> = [];
  constructor(private cartServices: CartService) {}
  ngOnInit(): void {
    this.cartServices.getOrders().subscribe((data) => {
      this.orders = data;
    });
  }
}
