import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // แก้จาก styleUrl เป็น styleUrls
})
export class LoginComponent {
  loginForm: FormGroup; // ฟอร์มสำหรับล็อกอิน
  isLoading = false; // สำหรับแสดงสถานะกำลังโหลด

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้กดปุ่ม Submit
  async onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.isLoading = true; // เริ่มแสดงสถานะโหลด
      try {
        await this.authService.login(email, password);
        Swal.fire({
          icon: 'success', // เพิ่มไอคอนแสดงสถานะ
          title: 'Login Successful',
          text: 'Welcome back!',
        }).then(() => {
          this.router.navigate(['/products-list']); // เปลี่ยนเส้นทางเมื่อสำเร็จ
        });
      } catch (error) {
        Swal.fire({
          icon: 'error', // เพิ่มไอคอนแสดงสถานะ
          title: 'Login Failed',
          text: 'Invalid username or password',
        });
      } finally {
        this.isLoading = false; // ปิดสถานะโหลดไม่ว่าจะสำเร็จหรือไม่
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid email and password',
      });
    }
  }
}
