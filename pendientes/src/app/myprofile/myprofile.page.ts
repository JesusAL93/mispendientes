import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
})
export class MyprofilePage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  passwordFieldType: string = 'password';

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.username = user.username || 'No user found';
      this.email = user.email || 'No email found';
      this.password = user.password || 'No password found';
    } else {
      this.username = 'No user found';
      this.email = 'No email found';
      this.password = 'No password found';
    }
  }

  saveUserData() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    localStorage.setItem('user', JSON.stringify(user));
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  logout() {
    this.router.navigate(['/folder']);  // Cambia '/folder' por la ruta que desees
  }
}
