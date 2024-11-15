import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm: FormGroup;

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

  onSubmit() {
    console.log(this.loginForm.value);  // ดูค่าของฟอร์มใน console
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).then(() => {
        this.router.navigate(['/home']);  // เปลี่ยนเส้นทางไปหน้า home หรือหน้าอื่นๆ
      }).catch((error) => {
        console.error(error);
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      });
    }
  }
}