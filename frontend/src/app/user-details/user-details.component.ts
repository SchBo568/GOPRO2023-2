import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { FlexLayoutModule, MediaObserver, MediaChange, BreakPointRegistry } from '@angular/flex-layout';
import { UserSession } from '../models/UserSession';
import { UpdateUserDto } from '../models/UpdateUserDto';
import { UserDetailsBody } from '../models/UserDetailsBody';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SessionStorageService } from '../services/SessionStorageService';
import { UserService } from '../../ApiServices/UserService';
import { ModalUpdatePasswordComponent } from '../modal-update-password/modal-update-password.component';
import { ResponseStatus } from '../models/ResponseStatus';

export interface DialogData {
  token: string;
  username: string;
}

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule
  ],
  providers: [UserService],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  // Properties initialization
  isMobile: boolean = false;
  isLoggedIn?: boolean;
  user?: UserSession | null;
  updateUser: UpdateUserDto = {
    // Default values for UpdateUserDto
    firstname: "rejhad",
    lastname: "abazovic",
    email: "rejhad2000@gmail.com",
    birthdate: "2000-10-24",
    phone_number: "+352 691 574 552"
  };
  userDetailsBody: UserDetailsBody = {
    userDetails: this.updateUser
  };
  
  // Constructor with injected services
  constructor (
    private mediaObserver: MediaObserver,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public userService: UserService
  ) {}

  // Subscription for media changes
  mediaSub: Subscription = new Subscription;
  sessionStorageService: SessionStorageService = new SessionStorageService;

  // Method to open a dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalUpdatePasswordComponent, {
      // Passing data to the dialog
      data: {
        token: this.sessionStorageService.getUser()?.access_token,
        username: this.sessionStorageService.getUser()?.PK_username
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.openSnackBar(result.message, "success-snackbar");
    });
  }

  // Lifecycle hook for component initialization
  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.asObservable().subscribe(
      (change: MediaChange[]) => {
        this.isMobile = (change[0].mqAlias === 'xs');
        console.log(this.isMobile);
      }
    );

    if (this.sessionStorageService.getUser() != null) {
      this.isLoggedIn = true;
      this.user = this.sessionStorageService.getUser();
      console.log("This is User ngOnInit "+this.user?.PK_username);
    } else {
      this.isLoggedIn = false;
    }
  }

  // Lifecycle hook for component destruction
  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

  // Form controls initialization for user details
  email = new FormControl(this.sessionStorageService.getUser()?.email, [Validators.required, Validators.email]);
  firstname = new FormControl(this.sessionStorageService.getUser()?.firstname, [Validators.required]);
  lastname = new FormControl(this.sessionStorageService.getUser()?.lastname, [Validators.required]);
  birthdate = new FormControl(this.sessionStorageService.getUser()?.birthdate, [Validators.required]);
  phoneNumber = new FormControl(this.sessionStorageService.getUser()?.phone_number, [Validators.required]);

  // Method to get error message for form fields
  getErrorMessage(field: string) {
    if (field === "email") {
      if (this.email.hasError('required')) {
        return 'You must enter a value';
      } else {
        return this.email.hasError('email') ? 'Not a valid email' : '';
      }
    } else {
      return 'You must enter a value';
    }
  }

  // Method to update user details
  onUpdateUserClick() {
    // Update user details based on form values
    this.updateUser.firstname = this.firstname.value ?? "63904253464236686765";
    this.updateUser.lastname = this.lastname.value ?? "63904253464236686765";
    this.updateUser.email = this.email.value ?? "63904253464236686765";
    this.updateUser.birthdate = this.birthdate.value ?? "63904253464236686765";
    this.updateUser.phone_number = this.phoneNumber.value ?? "63904253464236686765";
    
    // Check if email is valid
    if (this.isValidEmail(this.updateUser.email)) {
      // Check if all required fields are filled
      if (this.updateUser.firstname !== "" && this.updateUser.lastname !== "" && this.updateUser.email !== "" && this.updateUser.birthdate !== "" && this.updateUser.phone_number !== "") {
        const token = this.sessionStorageService.getUser()?.access_token ?? "0000000000";
        const username = this.sessionStorageService.getUser()?.PK_username ?? "0000000000";
        console.log("Token: "+ token)
        this.userService.setToken(token);
        this.userDetailsBody.userDetails = this.updateUser;
        this.userService.updateUser(username, this.updateUser).subscribe((response: ResponseStatus) => {
          // Handle response from API
          const message: string | null = response && Array.isArray(response.message) && response.message.length > 0 ? response.message[0] : null;
          if (response.code == 200) {
            // Update user details in session storage
            let usernameCopy = this.sessionStorageService.getUser()?.PK_username;
            let access_token = this.sessionStorageService.getUser()?.access_token;
            this.sessionStorageService.clearUser();
            this.sessionStorageService.saveUser(
              {
                PK_username: usernameCopy,
                email: this.updateUser.email,
                firstname: this.updateUser.firstname,
                lastname: this.updateUser.lastname,
                birthdate: this.updateUser.birthdate,
                phone_number: this.updateUser.phone_number,
                access_token: access_token
              }
            );
            this.isLoggedIn = true;
            this.openSnackBar(message, "success-snackbar");
          } else {
            this.openSnackBar(message, "error-snackbar");
          }
        });
      }
    }
  }

  openSnackBar(message: string | null, style: string) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom'; // 'top', 'bottom'
    config.horizontalPosition = 'start'; // 'start', 'center', 'end', 'left', 'right'
    config.duration = 2000;
    config.panelClass = [style];

    this._snackBar.open(message ?? "Default", 'Dismiss', config);
  }

  isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  
  
}
