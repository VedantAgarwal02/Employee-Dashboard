import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  user: any;
  name!: string | null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    sessionStorage.setItem('route', this.router.url);
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    this.name = this.user.name;
  }
}
