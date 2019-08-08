import { Component, OnInit } from "@angular/core";
import { take } from "rxjs/operators";
import {
    FormGroup,
    FormControl,
    AbstractControl,
    Validators,
} from "@angular/forms";
import * as firebase from "firebase/app";

import { DatabaseService } from "../shared/database.service";
import { AuthService } from "../shared/auth.service";

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
    test: string;
    numCurrent: number;
    numFinished: number;
    password = false;
    changingPassword = false;
    changePasswordForm: FormGroup;

    constructor(public authService: AuthService, private db: DatabaseService) {}

    ngOnInit() {
        this.password = false;

        this.changePasswordForm = new FormGroup(
            {
                oldPassword: new FormControl(null, [
                    Validators.required,
                    this.validPassword,
                ]),
                newPassword: new FormControl(null, [
                    Validators.required,
                    this.validPassword,
                ]),
                verifyNewPassword: new FormControl(null, [
                    Validators.required,
                    this.validPassword,
                ]),
            },
            [this.passwordMatch]
        );

        //ensures user has been loaded before trying to use the load tournaments
        this.authService.user.pipe(take(1)).subscribe(user => {
            this.authService
                .getAuthState()
                .pipe(take(1))
                .subscribe(data => {
                    for (let i = 0; i < data.providerData.length; i++) {
                        if (data.providerData[i].providerId === "password") {
                            this.password = true;
                        }
                    }
                });
            this.db
                .loadCurrentTournaments()
                .pipe(take(1))
                .subscribe((data: firebase.firestore.DocumentData[]) => {
                    this.numCurrent = data.length;
                });
            this.db
                .loadFinishedTournaments()
                .pipe(take(1))
                .subscribe((data: firebase.firestore.DocumentData[]) => {
                    this.numFinished = data.length;
                });
        });
    }

    onChangePassword() {
        let oldPassword = this.changePasswordForm.get("oldPassword").value;
        let newPassword = this.changePasswordForm.get("newPassword").value;
        let verifyNewPassword = this.changePasswordForm.get("verifyNewPassword")
            .value;

        if (newPassword === verifyNewPassword) {
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.authService.getAuth().currentUser.email,
                oldPassword
            );
            this.authService
                .getAuth()
                .currentUser.reauthenticateWithCredential(credential)
                .then(() => {
                    this.authService
                        .getUser()
                        .pipe(take(1))
                        .subscribe(user => {
                            user.updatePassword(newPassword)
                                .then(() => {
                                    this.authService.errorMessage({
                                        message: "Password has been updated!",
                                    });
                                    this.changingPassword = false;
                                })
                                .catch(err => {
                                    this.authService.errorMessage(err);
                                });
                        });
                })
                .catch(err => {
                    console.log(err);
                    this.authService.errorMessage(err);
                });
        } else {
            console.log("no match");
            this.authService.errorMessage({
                message: "New Password and Verify New Password should match!",
            });
        }
    }

    togglePassword() {
        this.changingPassword = !this.changingPassword;
    }

    private passwordMatch(control: AbstractControl): { [s: string]: boolean } {
        const password = control.get("newPassword").value;
        const verifyPassword = control.get("verifyNewPassword").value;

        if (password !== verifyPassword) {
            control.get("verifyNewPassword").setErrors({
                ...control.get("verifyNewPassword").errors,
                NoPasswordMatch: true,
            });
        }

        return null;
    }

    private validPassword(control: FormControl): { [s: string]: boolean } {
        if (!control.value) {
            return null;
        }
        let hasNum: RegExp = /[0-9]/;
        let hasCap: RegExp = /[A-Z]/;
        let hasLow: RegExp = /[a-z]/;

        const errors = {};

        if (!hasNum.test(control.value)) {
            errors["hasNoNum"] = true;
        }
        if (!hasCap.test(control.value)) {
            errors["hasNoCap"] = true;
        }
        if (!hasLow.test(control.value)) {
            errors["hasNoLow"] = true;
        }
        if (control.value.length < 8) {
            errors["tooShort"] = true;
        }
        return errors;
    }

    onHandleError() {
        this.authService.error = "";
    }
}
