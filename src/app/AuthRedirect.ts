import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthNavbarComponent } from './components/auth/auth-navbar/auth-navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-a',
  providers: [CookieService],
  standalone: true,
  imports: [
    RouterOutlet,
    AuthNavbarComponent,
    FormsModule,
    CommonModule
  ],
  template: `
    <app-auth-navbar></app-auth-navbar>
    <router-outlet></router-outlet>
  `,
})
export class AuthRedirect implements OnInit {
  type!: string;
  message!: string;

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    if (sessionStorage.getItem('user')) {
      this.router.navigate(['/app']);
    }
  }
}
