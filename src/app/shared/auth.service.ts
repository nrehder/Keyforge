import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";

import * as firebase from "firebase/app";
import { AngularFireAuth } from "angularfire2/auth";
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from "angularfire2/firestore";

import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

interface User {
    uid: string;
    email: string;
    photoUrl?: string;
    displayName?: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
    user: Observable<User>;

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
            })
        );
    }

    emailLogin() {}

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.AuthLogin(provider);
    }

    private AuthLogin(provider) {
        return this.fireAuth.auth.signInWithPopup(provider).then(credential => {
            this.updateUserData(credential.user);
        });
    }

    private updateUserData(user) {
        const userRef: AngularFirestoreDocument<User> = this.angFire.doc(
            `users/${user.uid}`
        );

        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL || "",
        };

        userRef.set(data, { merge: true });
        this.ngZone.run(() => this.router.navigate(["/"])).then();
    }

    signOut() {
        this.fireAuth.auth.signOut().then(() => {
            this.router.navigate(["/login"]);
        });
    }
}
