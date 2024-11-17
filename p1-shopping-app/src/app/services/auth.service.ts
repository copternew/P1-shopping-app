import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      map((user) => {
        if (user) {
          // Clone user object and update providerData
          return {
            ...user,
            providerData: user.providerData.filter((data) => data !== null),
          } as User;
        }
        return null;
      })
    );
  }

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

  logout() {
    return this.afAuth.signOut().then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Logout Successful',
        text: 'You have been logged out.',
      })
      this.router.navigate(['/login']);
    });
  }
}
