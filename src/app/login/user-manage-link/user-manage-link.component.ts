import { Component, OnInit } from "@angular/core";
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";

@Component({
    selector: "app-user-manage-link",
    templateUrl: "./user-manage-link.component.html",
    styleUrls: ["./user-manage-link.component.css"],
})
export class UserManageLinkComponent implements OnInit {
    mode: string;
    actionCode: string;
    actionCodeChecked: boolean = false;
    resetForm: FormGroup;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.resetForm = new FormGroup(
            {
                password: new FormControl(null, [
                    Validators.required,
                    this.validPassword,
                ]),
                verifyPassword: new FormControl(null, [
                    Validators.required,
                    this.validPassword,
                ]),
            },
            [this.passwordMatch]
        );

        this.route.queryParams.subscribe(params => {
            if (!params) {
                this.router.navigate(["/"]);
            }

            this.mode = params["mode"];
            this.actionCode = params["oobCode"];
            switch (this.mode) {
                case "resetPassword":
                    this.authService
                        .getAuth()
                        .verifyPasswordResetCode(this.actionCode)
                        .then((email: string) => {
                            this.actionCodeChecked = true;
                        })
                        .catch(err => {
                            this.authService.errorMessage(err);
                            this.router.navigate(["/login"]);
                        });
                    break;
                case "verifyEmail":
                    this.authService.errorMessage({
                        message: "Email has been verified!",
                    });
                    this.router.navigate(["/login"]);
                    break;
                default:
                    this.authService.errorMessage({
                        message: "Query parameters are missing!",
                    });
                    this.router.navigate(["/login"]);
            }
        });
    }

    onSubmitReset() {
        this.authService
            .getAuth()
            .confirmPasswordReset(
                this.actionCode,
                this.resetForm.get("password").value
            )
            .then(res => {
                this.authService.errorMessage({
                    message: "New password has been saved!",
                });
                this.router.navigate(["/login"]);
            })
            .catch(err => {
                this.authService.errorMessage(err);
            });
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
}
