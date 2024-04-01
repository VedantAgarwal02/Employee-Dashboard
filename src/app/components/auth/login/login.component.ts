import { Component, OnInit } from '@angular/core';
import { AuthNavbarComponent } from '../auth-navbar/auth-navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { backendUrl } from '../../../backend-url';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '../../../alert.service';

@Component({
  selector: 'app-login',
  providers: [CookieService],
  standalone: true,
  imports: [
    AuthNavbarComponent,
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService:AlertService
  ) {}

  ngOnInit(): void {
      if(localStorage.getItem('user')) {
        this.router.navigate(['/'])
      }
  }

  emailChecker(): boolean {
    return (
      this.email.match(
        /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) != null
    );
  }

  redirectToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  redirectToForgotPass(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  handleSubmit(): void {
    if (!this.email || !this.password) {
      this.alertService.triggerAlert("Please fill out all fields", "danger");
      return;
    }
    
    if (!this.emailChecker()) {
      this.alertService.triggerAlert('Enter a valid E-mail address.', 'danger');
      return;
    }
    
    this.http
    .post<any>(backendUrl + '/auth/login', {
      email: this.email,
      password: this.password,
    })
    .subscribe((response) => {
      if (response.status === 200) {
        response.user.password = this.password;
        
        const user = {
          email:response.user.email,
          name:response.user.name,
          _id:response.user._id,
          profilePicture:response.user.profilePicture,
          activeFeatures:response.user.activeFeatures
        };

        let users = localStorage.getItem('users');
        if(users===null) {
          sessionStorage.setItem('token', response.token)
          sessionStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('users', JSON.stringify([user._id]))
          this.alertService.triggerAlert("Login Success", "success")
          this.router.navigate(['/app'])
        }
        else {
          users=JSON.parse(users)
          if(users?.includes(user._id)) {
            this.alertService.triggerAlert('This account is already active in another tab.', 'danger')
            return;
          }
          else {
            sessionStorage.setItem('token', response.token)
            sessionStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('users', JSON.stringify([...users!, user._id]))
            this.alertService.triggerAlert("Login Success", "success")
            this.router.navigate(['/app']);
          }
        }

      } else {
        this.alertService.triggerAlert(`${response.message}`, "warning")
      }
    });
  }
}
