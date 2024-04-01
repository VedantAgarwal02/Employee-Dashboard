import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthNavbarComponent } from '../auth-navbar/auth-navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { BackendUrl } from '../../../../backendUrl';
import { backendUrl } from '../../../backend-url';
import { AlertService } from '../../../alert.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [AuthNavbarComponent, FormsModule, CommonModule, FloatLabelModule,InputTextModule, ButtonModule, PasswordModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email!: string;
  newPassword!: string;
  pathToCross!:string;
  pathToErrorIcon:string;
  displayNone:object = {
    display:"none"
  }

  @ViewChild('check1') check1!: ElementRef;
  @ViewChild('check2') check2!: ElementRef;

  constructor (private http:HttpClient, private router:Router, private alertService:AlertService) {
    this.pathToCross = '../../../../assets/pictures/backArrow.png'
    this.pathToErrorIcon = '../../../assets/pictures/error-icon.svg'
  }

  redirectToLogin():void {
    this.router.navigate(['/auth/login'])
  }

  emailChecker():boolean {
    return this.email.match(
      /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) != null;
  }

  passwordChecker():boolean {
    let specialChar = false, number=false, alphabet=false;
    let n=this.newPassword.length;
    let c1=true, c2=true;

    if(n<8) c1=false;

    for(let i=0; i<n; i++) {
        if(/[0-9]/.test(this.newPassword[i])) {
            number=true;
        }
        else if(/[A-Za-z]/.test(this.newPassword[i])) {
            alphabet=true;
        }
        else {
            specialChar=true;
        }
    }

    c2= number&&alphabet&&specialChar;

    if(!c1) {
      this.check1.nativeElement.style.display = "flex"
  }

  if(!c2) {
      this.check2.nativeElement.style.display = "flex"
  }

  if(!c1 || !c2) {
    document.getElementById('password')?.focus();
    return false;
  }
  return true;
  }

  handleSubmit():void {
    this.check1.nativeElement.style.display = "none"
    this.check2.nativeElement.style.display = "none"

    if(!this.email || !this.newPassword) {
      this.alertService.triggerAlert('Please fill out all fields.', 'danger')
      document.getElementById('name')?.focus();
      return;
    }

    if(!this.emailChecker()) {
      this.alertService.triggerAlert('Enter a valid E-mail address.', 'danger');
      document.getElementById('email')?.focus();
      return;
    }

    if(!this.passwordChecker()) return;

    this.http.patch<any>(backendUrl + '/auth/updatePass', {email:this.email, newPassword:this.newPassword}).subscribe(response => {
      if(response.status===200) {
        this.alertService.triggerAlert('Password Updated. Try to login.', 'success');
        this.router.navigate(['/auth/login'])
      }
      else {
        this.alertService.triggerAlert(`${response.message}`, 'warning')
      }
    })

  }
}
