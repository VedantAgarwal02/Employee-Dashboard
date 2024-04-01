import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { backendUrl } from '../../../../backend-url';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../alert.service';

@Component({
  selector: 'app-offcanvas',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule],
  templateUrl: './offcanvas.component.html',
  styleUrl: './offcanvas.component.css',
})
export class OffcanvasComponent implements OnInit {
  @Output() closeOffC = new EventEmitter<any>();
  @Output() openLogoutModal = new EventEmitter<any>();
  imageData: any;
  featuresData: any;
  visibleFeatures: number = 0;
  activeFeatures: any;

  constructor(private http: HttpClient, private router: Router, private alertService:AlertService) {}

  ngOnInit(): void {
    this.activeFeatures = JSON.parse(
      sessionStorage.getItem('user')!
    ).activeFeatures;

    this.http.get<any>('assets/images.json').subscribe((data) => {
      this.imageData = data;
    });

    this.http.get<any>(backendUrl + '/feature/get').subscribe((response) => {
      try {
        if (response.status === 200) {
          this.featuresData = response.features;
          for (let feature of this.featuresData) {
            if (this.activeFeatures.includes(feature._id))
              this.visibleFeatures++;
          }
        }
      } catch (error:any) {
        this.alertService.triggerAlert(`${error.message}`, 'warning');
      }
    });
  }

  featureClick(title: string): void {
    this.closeOffcanvas();
    if (title === 'Home') this.router.navigate(['/app']);
    else if (title === 'List of User') this.router.navigate(['/app/users']);
    else if (title === 'Add User') this.router.navigate(['/app/add-user']);
  }

  openOffcanvas() {
    document.getElementById('custom-offcanvas')?.classList.add('active');
  }

  closeOffcanvas() {
    this.closeOffC.emit();
  }
}
