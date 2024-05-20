import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Location } from '@angular/common';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  hide = true;

  signUpForm = new FormGroup({
    email: new FormControl(
      '',
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'change'
      }
    ),
    password: new FormControl(
      '',
      {
        validators: [Validators.required, Validators.minLength(10)],
        updateOn: 'change'
      }
    ),
    name: new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
    })
  });

  errorMessage = "";
  passwordError = "";

  constructor(private location: Location, private authService: AuthService, private userService: UserService) {}

  updateErrorMessage() {
    if (this.signUpForm.get('email')?.hasError('required')) {
      this.errorMessage = 'Kötelező!';
    } else if (this.signUpForm.get('email')?.hasError('email')) {
      this.errorMessage = 'Nem valós email!';
    } else {
      this.errorMessage = '';
    }
  }

  updateErrorPassword() {
    if (this.signUpForm.get('password')?.hasError('required')) {
      this.passwordError = 'Kötelező!';
    } else if (this.signUpForm.get('password')?.hasError('minlength')) {
      this.passwordError = 'Túl rövid jelszó minimum 10 karakter!';
    } else {
      this.passwordError = '';
    }
  }

  onSubmit() {
    this.authService.register(this.signUpForm.get('email')?.value as string, this.signUpForm.get('password')?.value as string).then(
      cred => {
        // User létrehozása
        const user: User={
          id: cred.user?.uid as string,
          email: this.signUpForm.get('email')?.value as string, 
          name: {
            firstname: this.signUpForm.get('name.firstname')?.value as string,
            lastname: this.signUpForm.get('name.lastname')?.value as string
          }
        };

        // User adatbázisba helyezése
        this.userService.createUser(user).catch(error => {
          console.error(error);
        });

      }).catch(error => {
        console.error(error);
      });
  }

  goBack() {
    this.location.back();
  }
}