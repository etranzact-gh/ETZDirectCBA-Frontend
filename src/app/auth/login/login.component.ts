import { Component } from '@angular/core';
import { NgForm, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router, Route } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule, ReactiveFormsModule, NzButtonModule, NzFormModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate(['/app/bank-config']);
  }
}
