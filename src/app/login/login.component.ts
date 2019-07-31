import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
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

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.loginForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(null, [Validators.required]),
        });
        this.signupForm = new FormGroup({
            username: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            verifyEmail: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(null, Validators.required),
            verifyPassword: new FormControl(null, Validators.required),
        });
        this.usernameForm = new FormGroup({
            username: new FormControl(null, [Validators.required]),
        });
    }

    validUsername(control: FormControl) {}

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
}
