import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-add-deck",
    templateUrl: "./add-deck.component.html",
    styleUrls: ["./add-deck.component.css"],
})
export class AddDeckComponent implements OnInit {
    @Output() close = new EventEmitter<void>();
    @Output() submit = new EventEmitter<void>();
    urlForm: FormGroup;

    ngOnInit() {
        this.urlForm = new FormGroup({
            url: new FormControl(null, [
                Validators.required,
                this.validateDeckURL,
            ]),
        });
    }

    onClose() {
        this.close.emit();
    }

    onSubmit() {
        this.submit.emit(this.urlForm.get("url").value);
    }

    private validateDeckURL(control: FormControl): { [s: string]: boolean } {
        if (control.value !== null) {
            if (
                control.value.length != 78 ||
                control.value.search("keyforgegame.com") === -1 ||
                control.value.search("deck-details") === -1
            ) {
                return { "Invalid URL": true };
            }
        }
        return null;
    }
}
