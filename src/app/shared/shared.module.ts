import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { VariableConfirmationComponent } from "./variable-confirmation/variable-confirmation.component";
import { NoTournamentComponent } from "./no-tournament/no-tournament.component";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        VariableConfirmationComponent,
        NoTournamentComponent,
    ],
    imports: [CommonModule],
    exports: [
        CommonModule,
        AlertComponent,
        LoadingSpinnerComponent,
        VariableConfirmationComponent,
        ReactiveFormsModule,
        NoTournamentComponent,
    ],
})
export class SharedModule {}
