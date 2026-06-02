import { Component } from '@angular/core';
import { NgForm, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router, Route } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environment/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';


export interface SigninModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [
    FormsModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzSpinModule, CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private router: Router, private authService: AuthService, private notification: NzNotificationService) {}

   createNotification(position: 'top', type: 'success'| 'info'| 'warning'| 'error', title: string, message: string ){
    this.notification.create(type, title, message, {nzPlacement: position, nzDuration: 3000});
  }

   signinData: SigninModel = {
    username: '',
    password: '',
  };
  loading: boolean = false;

  onSubmit(item: NgForm) {
    this.loading = true;
    this.authService.signin(this.signinData).subscribe({
      next: (response) => {
        const username = response?.username; 
        if(username) {
          localStorage.setItem('userInfo', username);
        }
        this.createNotification('top', "success", "SUCCESS", "Login successful!");
        this.router.navigate(['/app/bank-config']);
        this.loading = false;
      },
      error: (error) => {
        // console.error("error logging in", error)
        this.createNotification('top', "error", "Error", "Login failed");
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    }) 
  }
} 
 