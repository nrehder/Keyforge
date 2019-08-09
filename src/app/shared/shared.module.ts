import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
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
    imports: [CommonModule, RouterModule],
    exports: [
        CommonModule,
        AlertComponent,
        LoadingSpinnerComponent,
        VariableConfirmationComponent,
        RouterModule,
        ReactiveFormsModule,
    ],
})
export class SharedModule {}
