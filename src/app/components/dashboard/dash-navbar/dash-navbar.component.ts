import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import {
  NgbOffcanvas,
  NgbAccordionModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../alert.service';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dash-navbar',
  standalone: true,
  imports: [
    NgbAccordionModule,
    CommonModule,
    FormsModule,
    RouterLink,
    OffcanvasComponent,
    HttpClientModule
  ],
  templateUrl: './dash-navbar.component.html',
  styleUrl: './dash-navbar.component.css',
})
export class DashNavbarComponent implements OnInit {
  private offcanvasService = inject(NgbOffcanvas);
  isLoggedIn: boolean = false;
  isOffcanvasOpen: boolean = false;
  currentUrl!: string;
  public modalService = inject(NgbModal);
  imageData:any;

  constructor(private router: Router, private alertService: AlertService, private http:HttpClient) {}

  openModal(content: TemplateRef<any>) {
    console.log(this.modalService);

    this.modalService.open(content);
  }

  ngOnInit(): void {
    this.http.get<any>('assets/images.json').subscribe(data => {
      this.imageData = data;
    })
  }

  redirectToHome(): void {
    this.router.navigate(['/app']);
    this.offcanvasService.dismiss();
  }

  redirectToUsers(): void {
    this.router.navigate(['/app/users']);
    this.offcanvasService.dismiss();
  }

  redirectToAddUser(): void {
    this.router.navigate(['/app/add-user']);
    this.offcanvasService.dismiss();
  }

  logout(): void {
    const userId = JSON.parse(sessionStorage.getItem('user')!)._id;
    const users = JSON.parse(localStorage.getItem('users')!);
    const updatedUsers = users.filter((id: any) => id !== userId);

    sessionStorage.clear();
    if (updatedUsers.length === 0) localStorage.clear();
    else localStorage.setItem('users', JSON.stringify(updatedUsers));
    this.router.navigate(['/auth/login']);

    this.modalService.dismissAll();
    this.alertService.triggerAlert('Logout Success', 'success');
  }

  openOffcanvas() {
    document.getElementById('custom-offcanvas')?.classList.add('active');
    setTimeout(() => {
      this.isOffcanvasOpen = true;
    }, 300);
  }

  closeOffcanvas() {
    document.getElementById('custom-offcanvas')?.classList.remove('active');
    setTimeout(() => {
      this.isOffcanvasOpen = false;
    }, 300);
  }
}
