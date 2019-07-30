import { Component, OnInit, HostListener, ElementRef } from "@angular/core";
import { AuthService } from "../shared/auth.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
    navbarOpen = false;
    tournamentDropdown = false;
    deckDropdown = false;

    @HostListener("document:click", ["$event"]) clickOutside(event) {
        if (!this.eleRef.nativeElement.contains(event.target)) {
            this.tournamentDropdown = false;
            this.deckDropdown = false;
        }
    }

    constructor(public authService: AuthService, private eleRef: ElementRef) {}

    ngOnInit() {}

    navbarToggle() {
        this.navbarOpen = !this.navbarOpen;
    }
    tournamentToggle() {
        this.tournamentDropdown = !this.tournamentDropdown;
        this.deckDropdown = false;
    }
    deckToggle() {
        this.deckDropdown = !this.deckDropdown;
        this.tournamentDropdown = false;
    }
    clearDropdowns() {
        this.deckDropdown = false;
        this.tournamentDropdown = false;
    }
}
