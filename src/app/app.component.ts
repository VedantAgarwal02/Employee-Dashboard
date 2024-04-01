import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AlertComponent } from './components/alert/alert/alert.component';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';
import {NgxSemanticModule} from "ngx-semantic";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AlertComponent, NgxSemanticModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'sample-angular-app';
  private alertSubscription: Subscription;
  alertMessage!: string;
  alertType!: string;

  constructor(private alertService: AlertService, private router: Router) {
    this.alertSubscription = this.alertService.alert$.subscribe(
      ({ message, type }) => {
        this.alertMessage = message;
        this.alertType = type;
        setTimeout(() => {
          this.alertMessage = '';
        }, 3000);
      }
    );
  }

  ngOnInit() {
    const checkLocalSession = localStorage.getItem('users');
    const checksessionStorage = sessionStorage.getItem('user');

    if (!checksessionStorage && !checkLocalSession) {
      this.alertService.triggerAlert('Please Login', 'info');
      this.router.navigate(['/auth/login']);
    } else if (!checksessionStorage) {
      this.alertService.triggerAlert(
        "Can't have multiple instance of same account.",
        'warning'
      );
      this.router.navigate(['/auth/login']);
    } else if (checksessionStorage) {
      let users = localStorage.getItem('users');
      let user = JSON.parse(checksessionStorage);
      let route= sessionStorage.getItem('route')

      if (!users) {
        localStorage.setItem('users', JSON.stringify([user._id]));
        this.router.navigate([route || '/app']);
        return;
      }

      users = JSON.parse(users);
      if (!users?.includes(user._id)) {
        localStorage.setItem('users', JSON.stringify([...users!, user._id]));
        this.router.navigate([route || '/app']);
      }
    }

    const handleUnload = () => {
      const userId = JSON.parse(sessionStorage.getItem('user')!)._id;
      const users = JSON.parse(localStorage.getItem('users')!);
      const updatedUsers = users.filter((id: any) => id !== userId);

      if (updatedUsers.length === 0) {
        localStorage.clear();
        return;
      }

      localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    window.addEventListener('unload', handleUnload);
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
  }
}
