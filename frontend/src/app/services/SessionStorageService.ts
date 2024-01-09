import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { UserSession } from '../models/UserSession';

@Injectable({
    providedIn: 'root'
  })
  export class SessionStorageService {
  
    constructor() { }
  
    // Save user data to session storage
    saveUser(user: UserSession): void {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(user));
      } else {
        // Handle the case when sessionStorage is not available
        console.error('sessionStorage is not available.');
      }
    }
  
    // Retrieve user data from session storage
    getUser(): UserSession | null {
      if (typeof sessionStorage !== 'undefined') {
        const userData = sessionStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
      } else {
        // Handle the case when sessionStorage is not available
        console.error('sessionStorage is not available.');
        return null;
      }
    }
  
    // Clear user data from session storage
    clearUser(): void {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('user');
      } else {
        // Handle the case when sessionStorage is not available
        console.error('sessionStorage is not available.');
      }
    }
  }
  
