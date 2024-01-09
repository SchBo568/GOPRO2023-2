import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, MediaObserver, MediaChange, BreakPointRegistry } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { BreakPoint } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { SessionStorageService } from '../services/SessionStorageService';
import { Router, Routes } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalLoginComponent } from '../modal-login/modal-login.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, FlexLayoutModule, MatSidenavModule, MatListModule, MatButtonModule, MatCheckboxModule, FormsModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  events: string[] = [];
  opened: boolean = false;

  isMobile:boolean = false;
  
  isLoggedIn = false;

  constructor (private mediaObserver: MediaObserver, public dialog: MatDialog,) {}
  mediaSub: Subscription = new Subscription;
  sessionStorageService: SessionStorageService = new SessionStorageService;
  router: Router = new Router

  ngOnInit(): void{
    this.mediaSub = this.mediaObserver.asObservable().subscribe(
      (change: MediaChange[]) => {
        this.isMobile = (change[0].mqAlias === 'xs' || change[0].mqAlias === 'sm');
        console.log(this.isMobile)
      }
    );

    if(this.sessionStorageService.getUser() != null) {
      this.isLoggedIn = true
    } else {
      this.isLoggedIn = false
    }
  }
  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalLoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
        this.isLoggedIn = result;
        window.location.reload();
    });
  }

  demoLogin() {
    this.isLoggedIn = true;
  }

  navigateUserDetails() {
    console.log("Clicked")
    this.router.navigate(['/user-details'])
  }

  navigateRegister() {
    console.log("Clicked")
    this.router.navigate(['/register'])
  }

  navigateAddTool() {
    console.log("Clicked")
    this.router.navigate(['/add-tool'])
  }

  demoLogout() {
    this.sessionStorageService.clearUser();
    this.isLoggedIn = false;
    window.location.reload();
  }
}
