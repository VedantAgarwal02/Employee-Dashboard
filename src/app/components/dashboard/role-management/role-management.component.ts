import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { backendUrl } from '../../../backend-url';
import { AlertService } from '../../../alert.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css',
})
export class RoleManagementComponent implements OnInit {
  features!: any;
  imageData!: any;
  emptyString = "";
  activeFeatures!:any;
  originalFeatures!:any;
  user!:any;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router
  ) {}

  toggleFeature(featureId:any):void {
    if(this.activeFeatures.includes(featureId)) {
      this.activeFeatures = this.activeFeatures.filter((id:any) => id != featureId)
    }
    else {
      this.activeFeatures.push(featureId);
    }
  }

  submit():void {
    if(JSON.stringify(this.originalFeatures)===JSON.stringify(this.activeFeatures)) {
      this.alertService.triggerAlert('No changes were made', 'info')
      return;
    }
    console.log(backendUrl+'/user/update-features/'+this.user._id)
    this.http.post<any>(backendUrl+'/user/update-features/' + this.user._id, {features:this.activeFeatures}, {
      headers : {
        authorization:`Bearer ${sessionStorage.getItem('token')}`
      }
    }).subscribe(response => {
      if(response.status===200) {
        this.user.activeFeatures = this.activeFeatures;
        sessionStorage.setItem('user', JSON.stringify(this.user))

        this.alertService.triggerAlert('Changes saved', 'success')
        setTimeout(()=> {
          window.location.reload()
        }, 1000)
      }
    })
  }

  ngOnInit(): void {
    sessionStorage.setItem('route', this.router.url);
    this.user = JSON.parse(sessionStorage.getItem('user')!)
    this.http.get('assets/images.json').subscribe(data => {
      this.imageData = data;
    })

    const user = JSON.parse(sessionStorage.getItem('user')!);
    this.activeFeatures = user.activeFeatures;

    this.http.get<any>(backendUrl + '/feature/get').subscribe((response) => {
      if (response.status === 200) {
        // Object.assign(this.originalFields, response.fields)
        this.originalFeatures = JSON.parse(JSON.stringify(this.activeFeatures))
        this.features = response.features;
        // for(let feature of this.features) {
        //   if(this.activeFeatures.includes(feature))
        // }
      }
    });
  }
}
