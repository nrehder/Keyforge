import { Component, OnInit } from "@angular/core";
import { VariableConfirmationService } from "./shared/variable-confirmation/variable-confirmation.service";
import { AuthService } from "./shared/auth.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    constructor(
        public vcService: VariableConfirmationService,
        public authService: AuthService
    ) {}

    ngOnInit() {}
}
