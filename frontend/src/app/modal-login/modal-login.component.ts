import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogData } from '../user-details/user-details.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserService } from '../../ApiServices/UserService';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { response } from 'express';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ResponseStatus } from '../models/ResponseStatus';
import { SessionStorageService } from '../services/SessionStorageService';
import { UserSession } from '../models/UserSession';
import { AuthService } from '../../ApiServices/AuthService';


@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent,
    MatDialogActions, MatDialogClose, MatIconModule, FlexLayoutModule, HttpClientModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.scss'
})
export class ModalLoginComponent {
  hide = true
  sessionStorageService: SessionStorageService = new SessionStorageService;
  constructor(
    public dialogRef: MatDialogRef<ModalLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public authService: AuthService, private _snackBar: MatSnackBar,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onLoginClick(): void {
    if (this.username.value != "" && this.password.value != "") {
      console.log("Username: " + this.username.value + ", Password: " + this.password.value)
      //this.userService.setToken(this.data.token);
      this.authService.login(this.username.value ?? "t", this.password.value ?? "t").subscribe((response: any) => {
        response = response.user
        console.log(response.email)
        if (response.email != undefined) {
          this.sessionStorageService.saveUser(
            {
              PK_username: response.PK_username,
              email: response.email,
              firstname: response.firstname,
              lastname: response.lastname,
              birthdate: response.birthdate,
              phone_number: response.phone_number,
              access_token: response.access_token
            }
          );
          console.log(this.sessionStorageService.getUser())
         this.dialogRef.close(true);
        } else {
          //this.openSnackBar("Email or Password is/are incorrect", "error-snackbar")
        }
      })
    }
  }

  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  /* getErrorMessage() {
    return 'Username and/or Password is/are incorrect!'
  }

  openSnackBar(message: string | null, style: string) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'start';
    config.duration = 2000;
    config.panelClass = [style];

    this._snackBar.open(message ?? "Loading", 'Dismiss', config);
  } */
}
