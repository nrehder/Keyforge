import { Injectable, EventEmitter } from "@angular/core";

@Injectable({ providedIn: "root" })
export class VariableConfirmationService {
    message: string;
    choice = new EventEmitter<string>();
}
