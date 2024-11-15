import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // ฟังก์ชันสำหรับการสมัครสมาชิก (register)
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('User Registered:', userCredential.user);
        return userCredential;
      })
      .catch((error) => {
        console.error('Registration Error:', error);
        throw error;
      });
  }

  // ฟังก์ชันสำหรับการเข้าสู่ระบบ (login)
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('User Logged In:', userCredential.user);
        return userCredential;
      })
      .catch((error) => {
        console.error('Login Error:', error);
        throw error;
      });
  }

  // ฟังก์ชันสำหรับออกจากระบบ (logout)
  logout() {
    return this.afAuth.signOut();
  }
}
