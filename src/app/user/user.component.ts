import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
    signUp = false;
    loginForm: FormGroup;
    signupForm: FormGroup;

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

    onSubmitLogin() {}
}
