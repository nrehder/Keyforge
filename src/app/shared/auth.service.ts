import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";

import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from "@angular/fire/firestore";

import { Observable, of } from "rxjs";
import { switchMap, take, map, tap } from "rxjs/operators";

export interface User {
    uid: string;
    email: string;
    username?: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
    username: string;
    error: string = "";
    user: Observable<User>;
    needUsername: boolean = false;
    isloading: boolean = false;

    constructor(
        private fireAuth: AngularFireAuth,
        private angFire: AngularFirestore,
        private router: Router,
        private ngZone: NgZone
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
            }),
            tap(user => {
                if (user) {
                    if (user.username !== undefined) {
                        this.username = user.username;
                        this.needUsername = false;
                    } else {
                        this.needUsername = true;
                    }
                } else {
                    this.username = "";
                }
            })
        );
    }

    createEmailLogin(email: string, password: string) {
        this.isloading = true;
        this.fireAuth.auth
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                this.fireAuth.auth.currentUser.sendEmailVerification();
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
            .then(() => {
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

    checkUsername(username: string) {
        username = username.toLowerCase();
        return this.angFire
            .collection("usernames", ref => {
                return ref.where("username", "==", username);
            })
            .get()
            .pipe(
                take(1),
                map((data: firebase.firestore.QuerySnapshot) => {
                    return data.docs.map(
                        (
                            dataItem: firebase.firestore.QueryDocumentSnapshot
                        ) => {
                            return dataItem.data();
                        }
                    );
                }),
                map(array => {
                    if (array.length > 0) {
                        return { usernameTaken: true };
                    } else {
                        return null;
                    }
                })
            );
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

        //Angular doesn't like google Oauth and then route away
        this.ngZone.run(() => {
            this.router.navigate(["/"]);
        });
    }

    addUsername(username: string) {
        this.needUsername = false;
        this.isloading = true;
        let lowerUsername = username.toLowerCase();
        this.user.pipe(take(1)).subscribe(user => {
            this.angFire
                .collection("users")
                .doc(user.uid)
                .set({ username: username }, { merge: true })
                .catch(err => {
                    console.log(err);
                });
            this.angFire
                .collection("usernames")
                .doc(lowerUsername)
                .set({ username: lowerUsername })
                .catch(err => {
                    console.log(err);
                });
            this.isloading = false;
            this.router.navigate(["/"]);
        });
    }

    errorMessage(err) {
        switch (err.code) {
            case "auth/wrong-password":
            case "auth/invalid-email":
            case "auth/user-not-found":
                this.error = "Incorrect email or password!";
            default:
                this.error = err.message;
        }
    }

    signOut() {
        this.fireAuth.auth.signOut().then(() => {
            this.router.navigate(["/login"]);
        });
    }

    resetPassword(email: string) {
        this.fireAuth.auth
            .fetchSignInMethodsForEmail(email)
            .then((providers: string[]) => {
                let foundEmailLogin = false;
                for (let i = 0; i < providers.length; i++) {
                    if (providers[i] === "password") {
                        foundEmailLogin = true;
                    }
                }
                if (foundEmailLogin) {
                    this.onResetPassword(email);
                } else {
                    this.errorMessage({
                        message:
                            "No user with this email exists!  Try logging in with google.",
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    getUser() {
        return this.fireAuth.user;
    }
    getAuthState() {
        return this.fireAuth.authState;
    }
    getAuth() {
        return this.fireAuth.auth;
    }

    onResetPassword(email: string) {
        this.fireAuth.auth
            .sendPasswordResetEmail(email, { url: "http://localhost:4200" })
            .then(res => {
                this.errorMessage({
                    message:
                        "A password reset link has been sent to your email address!",
                });
            })
            .catch(err => {
                this.errorMessage(err);
            });
    }
}
