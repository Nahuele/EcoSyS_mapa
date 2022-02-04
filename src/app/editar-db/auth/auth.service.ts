import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from './user';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {RoleValidator} from './role-validator';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {
  public user$: Observable<User>;
  public user: User;
  public userid : string

  constructor(public afAuth: AngularFireAuth,
              private afs: AngularFirestore) {
    super();
    this.user$ = this.afAuth.authState.pipe(
      switchMap( (user) => {
        if (user) {
          this.userid = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  async login(email: string, password: string): Promise<User>  {
    try {
      const {user} = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user)
      return user;
    } catch (e) {
      return e;
      console.log(e);
    }
  }

  async sendVerificationEmail(): Promise<void> {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (e) {
      console.log(e);
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const {user} = await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.sendVerificationEmail();
      // this.logout();
      return user;
    } catch (e) {
      return e;
      console.log(e);
    }
  }

  async resetPass(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (e) {
      console.log(e);
    }
  }

  updateUserData(user:User) {
    const userRef : AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      roles: {
        editor: true
      }
    }
    return userRef.set(data, {merge: true});
  }

  isUserAdmin(userUid) {
    return this.afs.doc<User>(`users/${userUid}`).valueChanges();
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

}
