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
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ResponseStatus } from '../models/ResponseStatus';

@Component({
  selector: 'app-modal-update-password',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent,
    MatDialogActions, MatDialogClose, MatIconModule, FlexLayoutModule, HttpClientModule],
  providers: [UserService],
  templateUrl: './modal-update-password.component.html',
  styleUrl: './modal-update-password.component.scss'
})
export class ModalUpdatePasswordComponent {
  hide = true
  oldPassword = "";
  newPassword = "";
  wrongPassword: boolean = false
  @ViewChild('oldPasswordInputField', { static: false }) oldPasswordInputField: ElementRef = new ElementRef("");
  @ViewChild('newPasswordInputField', { static: false }) newPasswordInputField: ElementRef = new ElementRef("");

  constructor(
    public dialogRef: MatDialogRef<ModalUpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public userService: UserService, private _snackBar: MatSnackBar
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    if (this.oldPassword != "" && this.newPassword != "") {
      console.log("Old Password: " + this.oldPassword + ", New Password: " + this.newPassword)
      this.userService.setToken(this.data.token);
      this.userService.updatePassword(this.data.username, this.oldPassword, this.newPassword).subscribe((response: ResponseStatus) => {
        console.log(response)
        console.log("status:", response?.status); // 'Bad Request'
        console.log('Code:', response?.code); // 400
        console.log('Message:', response?.message);
        const message: string | null = response && Array.isArray(response.message) && response.message.length > 0 ? response.message[0] : null;
        if (response.code == 200) {
          this.dialogRef.close({ message: message });
        } else {
          this.openSnackBar(message, "error-snackbar")
        }
      })
    }
  }

  oldPasswordValidator = new FormControl('Password', Validators.required);
  newPasswordValidator = new FormControl('Password', Validators.required);

  getErrorMessage() {
    return 'Old password does not match' 
  }

  openSnackBar(message: string | null, style: string) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'start'; 
    config.duration = 2000;
    config.panelClass = [style];

    this._snackBar.open(message ?? "Loading", 'Dismiss', config);
  }
}
