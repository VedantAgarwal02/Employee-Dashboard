import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { backendUrl } from '../../../backend-url';
import { AlertService } from '../../../alert.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{
  @Input() user:any;
  @Input() modal!:any;
  @Output() usersUpdated:EventEmitter<any> = new EventEmitter();
  name!:string;
  email!:string;
  image!:string | ArrayBuffer | null;

  constructor(private http:HttpClient, private alertService:AlertService){}

  ngOnInit(): void {
      this.name = this.user.name;
      this.email = this.user.email;
      this.image = this.user.profilePicture;
      console.log(this.user)
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

  handleClose(){
    this.modal.dismiss();
  }

  pictureInput(e:any) {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file)
    reader.onload = ()=> {
      const imageData = reader.result;
      this.image = imageData;
    }
  }

  handleSubmit():void {

    if(!this.nameChecker()) {
      this.handleClose();
      this.alertService.triggerAlert('Name can only have letters.', 'danger')
      return;
    }

    if(!this.emailChecker()) {
      this.handleClose();
      this.alertService.triggerAlert('Please provide a valid E-mail.', 'danger')
      return;
    }

    if(this.name===this.user.name && this.email===this.user.email && this.image===this.user.profilePicture) {
      this.alertService.triggerAlert("No Changes were made.", 'info')
      this.handleClose();
    }
    else if(this.email===this.user.email) {
      this.http.patch<any>(backendUrl+'/user/updateName', {name:this.name, email:this.email, profilePicture:this.image}, {
        headers:{
          Authorization:`Bearer ${sessionStorage.getItem('token')}`
        }
      }).subscribe(response => {
        if(response.status===200) {
          let updatedUser = {
            name:this.name,
            email:this.email,
            _id:this.user._id,
            profilePicture:this.image
          }
          
          this.usersUpdated.emit(updatedUser)
          this.handleClose();
        }
        else {
          this.handleClose()
          this.alertService.triggerAlert(`${response.message}`, 'warning')
        }
      })
    }
    else {
      this.http.patch<any>(backendUrl+'/user/update/'+this.user._id, {name:this.name, email:this.email, profilePicture:this.image}, {
        headers:{
          Authorization:`Bearer ${sessionStorage.getItem('token')}`
        }
      }).subscribe(response => {
        if(response.status===200) {
          
          let updatedUser = {
            name:this.name,
            email:this.email,
            _id:this.user._id,
            profilePicture:this.image
          }
          
          this.usersUpdated.emit(updatedUser)
          this.handleClose();
        }
        else {
          this.handleClose()
          this.alertService.triggerAlert(`${response.message}`, 'warning')
        }
      })
    }
  }
}