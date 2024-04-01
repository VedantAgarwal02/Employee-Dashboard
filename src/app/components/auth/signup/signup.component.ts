import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthNavbarComponent } from '../auth-navbar/auth-navbar.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { backendUrl } from '../../../backend-url';
import { AlertService } from '../../../alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    AuthNavbarComponent,
    FormsModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    HttpClientModule,
    CommonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  email!: string;
  name!: string;
  password!: string;
  image!: string | ArrayBuffer | null;
  displayNone: object = {
    display: 'none',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
  ) {}

  @ViewChild('check1') check1!: ElementRef;
  @ViewChild('check2') check2!: ElementRef;

  redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  nameChecker(): boolean {
    let n = this.name.length;

    for (let i = 0; i < n; i++) {
      if (!/^[A-Za-z]$/.test(this.name[i]) && this.name[i] !== ' ')
        return false;
    }

    return true;
  }

  emailChecker(): boolean {
    return (
      this.email.match(
        /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) != null
    );
  }

  passwordChecker(): boolean {
    let specialChar = false,
      number = false,
      alphabet = false;
    let n = this.password.length;
    let c1 = true,
      c2 = true;

    if (n < 8) c1 = false;

    for (let i = 0; i < n; i++) {
      if (/[0-9]/.test(this.password[i])) {
        number = true;
      } else if (/[A-Za-z]/.test(this.password[i])) {
        alphabet = true;
      } else {
        specialChar = true;
      }
    }

    c2 = number && alphabet && specialChar;

    if (!c1) {
      this.check1.nativeElement.style.display = 'flex';
    }

    if (!c2) {
      this.check2.nativeElement.style.display = 'flex';
    }

    if (!c1 || !c2) {
      document.getElementById('password')?.focus();
      return false;
    }
    return true;
  }

  async fileSelected(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const imageData = reader.result;
      // console.log(imageData);
      this.image = imageData;
    };
  }

  handleSubmit(): void {
    this.check1.nativeElement.style.display = 'none';
    this.check2.nativeElement.style.display = 'none';

    if (!this.name || !this.email || !this.password) {
      this.alertService.triggerAlert('Please fill out all fields.', 'danger');
      document.getElementById('name')?.focus();
      return;
    }

    if (!this.nameChecker()) {
      this.alertService.triggerAlert('Name can only have letters.', 'danger');
      document.getElementById('name')?.focus();
      return;
    }
    if (!this.emailChecker()) {
      this.alertService.triggerAlert('Enter a valid E-mail address.', 'danger');
      document.getElementById('email')?.focus();
      return;
    }
    if (!this.passwordChecker()) return;

    this.http
      .post<any>(backendUrl + '/auth/signup', {
        name: this.name,
        email: this.email,
        password: this.password,
        profilePicture: this.image,
      })
      .subscribe((response) => {
        if (response.status === 200) {
          this.alertService.triggerAlert(
            'User Signup Success. Try to login.',
            'success'
          );
          this.router.navigate(['/auth/login']);
        } else {
          this.alertService.triggerAlert(`${response.message}`, 'warning');
        }
      });
  }
}
