import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { VariableConfirmationService } from "./variable-confirmation.service";

@Component({
    selector: "app-variable-confirmation",
    templateUrl: "./variable-confirmation.component.html",
    styleUrls: ["./variable-confirmation.component.css"],
})
export class VariableConfirmationComponent implements OnInit {
    @Input() message: string;
    @Output() choice = new EventEmitter<string>();

    constructor(private vcService: VariableConfirmationService) {}

    ngOnInit() {
        this.message = this.vcService.message;
    }

    onCancel() {
        this.vcService.choice.emit("cancel");
    }

    onConfirm() {
        this.vcService.choice.emit("confirm");
    }
}
