import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { VariableConfirmationComponent } from "./variable-confirmation/variable-confirmation.component";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        VariableConfirmationComponent,
    ],
    imports: [CommonModule],
    exports: [
        CommonModule,
        AlertComponent,
        LoadingSpinnerComponent,
        VariableConfirmationComponent,
        ReactiveFormsModule,
    ],
})
export class SharedModule {}
