import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-variable-confirmation",
    templateUrl: "./variable-confirmation.component.html",
    styleUrls: ["./variable-confirmation.component.css"],
})
export class VariableConfirmationComponent {
    @Input() message: string;
    @Output() choice = new EventEmitter<string>();

    onCancel() {
        this.choice.emit("cancel");
    }

    onConfirm() {
        this.choice.emit("confirm");
    }
}
