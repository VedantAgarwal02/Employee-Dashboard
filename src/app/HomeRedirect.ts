import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashNavbarComponent } from './components/dashboard/dash-navbar/dash-navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-b',
  providers: [],
  standalone: true,
  imports: [RouterOutlet, DashNavbarComponent, CommonModule],
  template: `
    <app-dash-navbar> </app-dash-navbar>
    <router-outlet></router-outlet>
  `,
})
export class HomeRedirect {}
