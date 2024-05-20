import { Component} from '@angular/core';
import { MainService } from '../../shared/services/main.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../shared/models/Product';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CartService } from '../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatButtonModule, MatCardModule, MatPaginator,
    CommonModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy{
  AllProducts: Array<Product> = [];
  loadingSubscription?: Subscription;
  pageSlice?: Array<Product>;
  product?: Product;
  message?: string;
  isMessageVisible: boolean = false;
  timeOutId?: any;
  style?: {};

  constructor(private mainService: MainService, private cartService: CartService,
    private productService: ProductService){}

  ngOnInit(): void {
    this.loadingSubscription = this.productService.getProducts().subscribe(
      (data) => {
        this.AllProducts = data;
        this.pageSlice = this.AllProducts.slice(0, 10);
        for (let i = 0; i < data.length; i++) {
          for(let j = 0; j < this.cartService.getCartItems().length; j++){
            if (this.cartService.getCartItems()[j].id === data[i].id){
              this.AllProducts[i].supply -= this.cartService.getCartItems()[j].supply;
              break;
            }
          }
          this.mainService.loadImage(data[i].image_url).subscribe(data =>{
            this.AllProducts[i].image_url = data;
          });
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

  onPageEvent(event: PageEvent){
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = (startIndex + event.pageSize);
    if (endIndex > this.AllProducts.length) {
      endIndex = this.AllProducts.length;
    }
    this.pageSlice = this.AllProducts.slice(startIndex, endIndex);
  }

  cart(productid: string){
    for (let i = 0; i < this.AllProducts.length; i++) {
      if (this.AllProducts[i].id === productid) {
        if(this.AllProducts[i].supply > 0){
          this.AllProducts[i].supply--;
          this.cartService.addToCart(Object.assign({}, this.AllProducts[i]));
          this.cartService.updateData(this.cartService.dataSubject.value + 1)
          this.message = "Sikeresen kosárba helyezve!";
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
          this.showMessage();
        }
        else if(this.AllProducts[i].supply === 0){
          this.style = {
            backgroundColor: "crimson",
            color: 'white',
            borderRadius: '10px',
            width: '50%',
            margin: 'auto',
            padding: '10px',
            textAlign: 'center',
            fontweight: 'bold',
            fontsize: '25px'
          }
          this.message = "Nincsen készleten!";
          this.showMessage();
        }
      }
    }
  }

  showMessage(){
    if(this.timeOutId){
      clearTimeout(this.timeOutId);
    }
    this.isMessageVisible = true;
    
    this.timeOutId = setTimeout(() => {
      this.isMessageVisible = false;
    }, 1000);
  }
}
