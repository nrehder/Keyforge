import { Component, OnInit } from "@angular/core";
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
} from "@angular/forms";

import { AuthService } from "../shared/auth.service";
import { Observable } from "rxjs";

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
        this.usernameForm = new FormGroup({
            username: new FormControl(
                null,
                [Validators.required, this.usernameStyleValidator],
                this.usernameAvailable.bind(this)
            ),
        });
    }

    onChangeMode() {
        this.signUp = !this.signUp;
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

    onSubmitUsername() {
        this.authService.addUsername(this.usernameForm.get("username").value);
    }

    onHandleError() {
        this.authService.error = "";
    }

    //Validators
    private usernameStyleValidator(
        control: FormControl
    ): { [s: string]: boolean } {
        if (control.value) {
            let stringArray = (<string>control.value).split(" ");
            if (stringArray.length > 1) {
                return { oneWord: true };
            }
        }

        return null;
    }

    private usernameAvailable(
        control: FormControl
    ): Promise<any> | Observable<any> {
        return this.authService.checkUsername(control.value);
    }

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
}
