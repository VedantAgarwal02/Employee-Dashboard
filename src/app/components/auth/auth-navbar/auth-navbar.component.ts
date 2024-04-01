import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './auth-navbar.component.html',
  styleUrl: './auth-navbar.component.css',
})
export class AuthNavbarComponent implements OnInit {
  isLogin: boolean = true;
  imageData: any;

  private routerEventsSubscription!: Subscription;
  constructor(private router: Router, private http: HttpClient) {
    this.routerEventsSubscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (this.router.url.includes('/auth/login')) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.isLogin = true;
    this.http.get<any>('assets/images.json').subscribe((data) => {
      this.imageData = data;
    });
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
