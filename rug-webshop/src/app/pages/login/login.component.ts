import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})  
export class LoginComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email],);
  password = new FormControl('', [Validators.required, Validators.minLength(10)]);

  errorMessage = '';
  passwordError = '';

  constructor(private router: Router, private authService: AuthService){}

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'Kötelező!';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Nem valós email!';
    } else {
      this.errorMessage = '';
    }
  }

  updateErrorPassword() {
    if (this.password.hasError('required')) {
      this.passwordError = 'Kötelező!';
    } else if (this.password.hasError('minlength')) {
      this.passwordError = 'Túl rövid jelszó minimum 10 karakter!';
    } else {
      this.passwordError = '';
    }
  }

  login() {
    if(this.email.valid && this.password.valid){
      this.authService.login(this.email.value as string, this.password.value as string)
      .then(cred => {
        // console.log(cred);
        this.router.navigateByUrl('/main');
      }).catch(error => {
        console.error(error);
      });
    }
  }
}