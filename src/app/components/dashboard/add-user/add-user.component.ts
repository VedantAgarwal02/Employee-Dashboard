import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  TemplateRef,
  OnInit
} from '@angular/core';
import { backendUrl } from '../../../backend-url';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../alert.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent implements OnInit {
  name!: string;
  email!: string;
  password!: string;
  image!: string | ArrayBuffer | null;
  imageData:any;
  @ViewChild('check1') check1!: ElementRef;
  @ViewChild('check2') check2!: ElementRef;
  private modalService = inject(NgbModal);
  excelData!: any[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    sessionStorage.setItem('route', this.router.url);
    this.http.get<any>('assets/images.json').subscribe(data => {
      this.imageData = data;
    })
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  handleFileInpt(event: any): void {
    this.uploadExcelData(event)
      .then(() => {
        this.alertService.triggerAlert('Upload initiated', 'info');
        this.modalService.dismissAll();
      })
      .catch((error) => {
        console.error('Error occured', error);
      });
  }

  uploadExcelData(event: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (event: any) => {
        const arrayBuffer: ArrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer);
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        this.excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        for (let i = 1; i < this.excelData.length; i++) {
          if (this.excelData[i].length === 0) continue;

          let excelName = this.excelData[i][0];
          let excelEmail = this.excelData[i][1];
          let excelPassword = this.excelData[i][2];

          this.http
            .post<any>(backendUrl + '/auth/signup', {
              name: excelName,
              email: excelEmail,
              password: excelPassword,
            })
            .subscribe((response) => {
              if (response.status !== 200) {
                this.alertService.triggerAlert(
                  `Error Occured while uploading: ${excelEmail}, ${response.message}`,
                  'info'
                );
              } else {
                this.alertService.triggerAlert(
                  `User with email: ${response.user.email}, Uploaded`,
                  'success'
                );
              }
            });
        }

        resolve();
      };

      reader.readAsArrayBuffer(event.target.files[0]);
    });
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

  pictureInput(e: any): void {
    const file = e.target.files[0] as File;
    console.log(file.name, file.size);

    if (file.size > 2097152) {
      this.alertService.triggerAlert(
        `Size of profile picture can not be greater than 2MB. Your size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`,
        'danger'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      this.image = imageData;
    };
    reader.readAsDataURL(file);
  }

  handleSubmit(): void {
    console.log(this.name, this.email, this.password, this.image);

    this.check1.nativeElement.style.display = 'none';
    this.check2.nativeElement.style.display = 'none';

    if (!this.name || !this.email || !this.password) {
      this.alertService.triggerAlert('Please fill out all fields.', 'danger');
      document.getElementById('name')?.focus();
      return;
    }
    if (!this.nameChecker()) {
      this.alertService.triggerAlert('Name can only have letters', 'danger');
      document.getElementById('name')?.focus();
      return;
    }
    if (!this.emailChecker()) {
      this.alertService.triggerAlert('Enter a valid E-mail Address.', 'danger');
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
          this.alertService.triggerAlert('User Added', 'success');
          this.router.navigate(['/app/users']);
        } else {
          this.alertService.triggerAlert(`${response.message}`, 'warning');
        }
      });
  }
}
