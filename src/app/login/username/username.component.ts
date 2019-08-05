import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";

import { AuthService } from "../../shared/auth.service";

@Component({
    selector: "app-username",
    templateUrl: "./username.component.html",
    styleUrls: ["./username.component.css"],
})
export class UsernameComponent implements OnInit {
    usernameForm: FormGroup;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.usernameForm = new FormGroup({
            username: new FormControl(
                null,
                [Validators.required, this.usernameStyleValidator],
                this.usernameAvailable.bind(this)
            ),
        });
    }
    onSubmitUsername() {
        this.authService.addUsername(this.usernameForm.get("username").value);
    }

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
}
