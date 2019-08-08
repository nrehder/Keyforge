import { Component, OnInit } from "@angular/core";
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
} from "@angular/forms";

import { AuthService } from "../shared/auth.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    signUp = false;
    loginForm: FormGroup;
    signupForm: FormGroup;
    usernameForm: FormGroup;
    isLoading: boolean = false;
    forgotPass: boolean = false;
    forgotPassForm: FormGroup;

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.loginForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(null, [
                Validators.required,
                this.validPassword,
            ]),
        });
        this.signupForm = new FormGroup(
            {
                email: new FormControl(null, [
                    Validators.required,
                    Validators.email,
                ]),
                verifyEmail: new FormControl(null, [
                    Validators.required,
                    Validators.email,
                ]),
                password: new FormControl(null, [
                    Validators.required,
                    this.validPassword,
                ]),
                verifyPassword: new FormControl(null, [
                    Validators.required,
                    this.validPassword,
                ]),
            },
            [this.emailMatch, this.passwordMatch]
        );
        this.forgotPassForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
        });
    }

    onChangeMode() {
        this.signUp = !this.signUp;
        this.forgotPass = false;
    }

    onSubmitLogin() {
        this.authService.emailLogin(
            this.loginForm.get("email").value,
            this.loginForm.get("password").value
        );
    }

    onSubmitSignup() {
        this.authService.createEmailLogin(
            this.signupForm.get("email").value,
            this.signupForm.get("password").value
        );
    }

    onHandleError() {
        this.authService.error = "";
    }

    //Validators
    private emailMatch(control: AbstractControl): { [s: string]: boolean } {
        const email = control.get("email").value;
        const verifyEmail = control.get("verifyEmail").value;

        if (email !== verifyEmail) {
            control.get("verifyEmail").setErrors({
                ...control.get("verifyEmail").errors,
                NoEmailMatch: true,
            });
        }

        return null;
    }

    private passwordMatch(control: AbstractControl): { [s: string]: boolean } {
        const password = control.get("password").value;
        const verifyPassword = control.get("verifyPassword").value;

        if (password !== verifyPassword) {
            control.get("verifyPassword").setErrors({
                ...control.get("verifyPassword").errors,
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

    forgotPassword() {
        this.forgotPass = !this.forgotPass;
    }

    onSubmitPasswordReset() {
        this.authService.resetPassword(this.forgotPassForm.get("email").value);
    }
}
