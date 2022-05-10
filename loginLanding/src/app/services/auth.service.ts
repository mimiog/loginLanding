import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs';
import { AUTH_ROUTES } from '../../environments/routes';
import { environment } from '../../environments/environment';
import { LoginDto, RegisterDto, UpdateRoleDto } from '../types/auth';

const TOKEN_KEY = 'presence';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public headers = new HttpHeaders();

  constructor(
    private cookie: CookieService,
    private http: HttpClient
  ) {}

  private deleteToken() {
    // These parameters are now required by the library. The '/' is just so that we can access the cookie for our domain. We are not allowed to delete cookies from other domains
    this.cookie.delete('presence', '/', environment.host, false, 'Lax');
    // Since the cookie.delete doesn't seem to want to cooperate in prod I'm explicitly setting it to empty using good old fashioned JS
    document.cookie =
      'presence=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  public initHeaders() {
    const token = this.cookie.get(TOKEN_KEY);
    if (token !== null && token !== undefined && token !== '') {
      this.headers = new HttpHeaders().append('Authorization', `${'Bearer ' + token}`);
    }
  }

  private storeToken(token: string) {
    if (token) {
      this.cookie.set(TOKEN_KEY, token, {
        expires: 1,
        path: '/',
        domain: environment.host,
        secure: false,
        sameSite: 'Lax',
      });
    }
  }

  /**
   * This method clears the authorization header after the user logs out.
   * This prevents errors when the user logs out and attempts to log back in
   */
  private clearAuthHeader() {
    this.headers = new HttpHeaders().delete('Authorization');
  }

  login(loginDto: LoginDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.initHeaders();
      this.http
      .post(
        AUTH_ROUTES.LOGIN(),
        loginDto,
        {
          headers: this.headers
        }
      )
      .pipe(retry(3))
      .toPromise()
      .then((res: any) => {
        this.storeToken(res.access_token);
        // redirect to the dashboard
        resolve(res);
      },
      (error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  register(registerDto: RegisterDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.initHeaders();
      this.http
      .post(
        AUTH_ROUTES.REGISTER(),
        registerDto, 
        {
          headers: this.headers
        }
      )
      .pipe(retry(3))
      .toPromise()
      .then((res: any) => {
        this.storeToken(res.access_token);
        resolve(res);
      },
      (error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.initHeaders();
      this.http
      .patch(
        AUTH_ROUTES.UPDATE_ROLE(id), 
        updateRoleDto,
        {
          headers: this.headers
        }
      )
      .pipe(retry(3))
      .toPromise()
      .then((res: any) => {
        resolve(res);
      },
      (error) => {
        console.log(error);
        reject(error);
      });
    });
  }

}