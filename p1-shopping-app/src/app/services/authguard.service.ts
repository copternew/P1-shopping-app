import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // บริการสำหรับจัดการการล็อกอิน/เช็คสถานะผู้ใช้
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1), // ใช้เพื่อให้ Observable จบการทำงานหลังจากรับค่าแรก
      map((user) => !!user), // แปลงผู้ใช้เป็น Boolean (ถ้ามีผู้ใช้ return true, ถ้าไม่มี return false)
      tap((loggedIn) => {
        if (!loggedIn) {
          console.log('Access denied - Redirecting to login');
          this.router.navigate(['/login']); // เปลี่ยนเส้นทางไปยังหน้า Login
        }
      })
    );
  }
}
