import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // ใช้ email แทน username
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.registerForm.valid) {
      const { email, password, confirmPassword } = this.registerForm.value;
      
      // ตรวจสอบว่า password กับ confirmPassword ตรงกันหรือไม่
      if (password === confirmPassword) {
        this.authService.register(email, password).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'สมัครสมาชิกสําเร็จ',
            text: 'คุณได้สมัครสมาชิกเรียบร้อยแล้ว',
          })
          this.router.navigate(['/login']);
        }).catch((error) => {
          console.error(error);
          alert('เกิดข้อผิดพลาดในการสมัครสมาชิก');
        });
      } else {
        alert('Passwords do not match');
      }
    }
  }
}
