import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import * as firebase from "firebase/app";
import { AngularFireAuth } from "angularfire2/auth";
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from "angularfire2/firestore";

import { Observable, of } from "rxjs";
import { switchMap, take, map } from "rxjs/operators";

export interface User {
    uid: string;
    email: string;
    userName?: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
    error: string = "";
    user: Observable<User>;
    needUsername: boolean = false;
    isloading: boolean = false;

    constructor(
        private fireAuth: AngularFireAuth,
        private angFire: AngularFirestore,
        private router: Router
    ) {
        this.user = this.fireAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.angFire
                        .doc<User>(`users/${user.uid}`)
                        .valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    createEmailLogin(email: string, password: string) {
        this.isloading = true;
        this.fireAuth.auth
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                this.updateUserData(res.user);
            })
            .catch(err => {
                this.isloading = false;
                this.errorMessage(err);
            });
    }

    emailLogin(email: string, password: string) {
        this.isloading = true;
        this.fireAuth.auth
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                this.isloading = false;
                this.router.navigate(["/"]);
            })
            .catch(err => {
                this.isloading = false;
                this.errorMessage(err);
            });
    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.fireAuth.auth
            .signInWithPopup(provider)
            .then(credential => {
                this.updateUserData(credential.user);
            })
            .catch(err => {
                console.log(err);
            });
    }

    private updateUserData(user) {
        const userRef: AngularFirestoreDocument<User> = this.angFire.doc(
            `users/${user.uid}`
        );

        const data: User = {
            uid: user.uid,
            email: user.email,
        };

        userRef.set(data, { merge: true });

        /*
			Checks if a user has a username already.  If not, changes login form
			Google Login always updates userdata, but may already have a username
		*/
        userRef
            .get()
            .pipe(
                take(1),
                map((item: firebase.firestore.DocumentSnapshot) => {
                    return item.data();
                })
            )
            .subscribe(doc => {
                if (doc.username === undefined) {
                    this.isloading = false;
                    this.needUsername = true;
                } else {
                    this.isloading = false;
                    this.router.navigate(["/"]);
                }
            });
    }

    addUsername(username: string) {
        this.needUsername = false;
        this.isloading = true;
        this.user.pipe(take(1)).subscribe(user => {
            this.angFire
                .collection("users")
                .doc(user.uid)
                .set({ username: username }, { merge: true })
                .catch(err => {
                    console.log(err);
                });
            this.angFire
                .collection("users")
                .doc("usernames")
                .set({ [username]: username })
                .catch(err => {
                    console.log(err);
                });
            this.isloading = false;
            this.router.navigate(["/"]);
        });
    }

    private errorMessage(err) {
        this.error = err.message;
    }

    signOut() {
        this.fireAuth.auth.signOut().then(() => {
            this.router.navigate(["/login"]);
        });
    }
}
