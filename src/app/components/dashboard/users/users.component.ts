import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, inject } from '@angular/core';
import { backendUrl } from '../../../backend-url';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AlertService } from '../../../alert.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HttpClientModule, CommonModule, EditUserComponent, NgbModalModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private modalSerice = inject(NgbModal);
  users: any;
  userToBeDeleted!:any;
  imageData:any;
  parentContainer!:ElementRef<any>;
  message!:string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {
    this.users = [];
  }

  redirectToAddUser(): void {
    this.router.navigate(['/app/add-user']);
  }

  openModal(content: TemplateRef<any>, type: 'edit' | 'confirm', userToBeDeleted:any) {
    if (type === 'confirm') {
      this.modalSerice.open(content)
      this.userToBeDeleted = userToBeDeleted;
    }
    else this.modalSerice.open(content, { centered: true });
  }

  closeModal(): void {
    this.modalSerice.dismissAll();
  }

  fetchUsers(): void {
    this.message = 'Loading Users'
    this.http
      .get<any>(backendUrl + '/user/allUsers', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
      .subscribe((response) => {
        this.users = response.allUser;
        if(response.nbHits === 0) {
          this.message = 'No User'
        }
      });
  }

  handleUpdate(user: any): void {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i]._id === user._id) {
        this.users[i].email = user.email;
        this.users[i].name = user.name;
        if(user.profilePicture!==null)
        this.users[i].profilePicture = user.profilePicture;
      }
    }

    this.alertService.triggerAlert('Details Updated.', 'success');
  }

  handleDelete(): void {
    let currEmail = JSON.parse(sessionStorage.getItem('user')!).email;

    if (currEmail === this.userToBeDeleted.email) {
      this.closeModal()
      this.alertService.triggerAlert(
        'You are currently logged in  with this account.',
        'danger'
      );
      return;
    }

    this.http
      .delete<any>(backendUrl + '/user/delete-user/' + this.userToBeDeleted._id, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
      .subscribe((response) => {
        this.closeModal()
        if (response.status === 200) {
          let indexofUser = this.users.indexOf(this.userToBeDeleted);
          this.users.splice(indexofUser, 1);
          this.alertService.triggerAlert('User deleted.', 'success');
        } else {
          this.alertService.triggerAlert(`${response.message}`, 'warning');
        }
      });
  }

  ngOnInit(): void {
    sessionStorage.setItem('route', this.router.url);
    this.fetchUsers();
    // console.log(this.users)
    
    this.http.get<any>('assets/images.json').subscribe(data => {
      this.imageData = data;
    })
  }
}
