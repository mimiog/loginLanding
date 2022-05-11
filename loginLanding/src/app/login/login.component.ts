import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../types/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginDto: LoginDto = {
    username: '',
    password: ''
  };

  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log();
  }

  async login() {
     await this.authService.login(this.loginDto);
  }

  change(event: any, attribute: string) {
    if (event.target.value) {
      switch (attribute) {
        case 'username':
          this.loginDto.username = event.target.value;
          break;
        case 'password':
          this.loginDto.password = event.target.value;
          break;
      }
    }
  }

}
