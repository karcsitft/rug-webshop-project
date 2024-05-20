import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from './shared/services/cart.service';
import { Subscription } from 'rxjs';
import { MainComponent } from './pages/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule,
    MainComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'rug-webshop';
  loggedInUser?: firebase.default.User | null;
  cartNumber?: number;
  private subscription?: Subscription;

  constructor(private authService: AuthService, private cartService: CartService) { }

  ngOnInit(){
    this.authService.isUserLoggedIn().subscribe(
      user => {
        this.loggedInUser = user;
      }, error => {
        console.error(error);
      });

      this.subscription = this.cartService.currentData.subscribe(data => {
        this.cartNumber = data;
      });
  }

  logout(){
    this.authService.logout().then(() => {
      console.log('Logged out.');
    }).catch(error => {
      console.error(error);
    }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
