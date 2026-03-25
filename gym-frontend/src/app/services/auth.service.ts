import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: { username: string, password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role || null;
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getRoleFromToken() === 'admin';
  }

  isPT(): boolean {
    return this.getRoleFromToken() === 'PT';
  }
}