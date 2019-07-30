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
    isLoading: boolean = false;

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.loginForm = new FormGroup({
            username: new FormControl(null, Validators.required),
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
    }

    validUsername(control: FormControl) {}

    onChangeMode() {
        this.signUp = !this.signUp;
    }

    onSubmitLogin() {
        console.log("submit");
    }

    onSubmitSignup() {
        console.log("SUBMIT");
    }
}
