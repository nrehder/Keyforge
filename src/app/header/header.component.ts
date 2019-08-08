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

    @HostListener("document:click", ["$event"]) clickOutside(event) {
        if (!this.eleRef.nativeElement.contains(event.target)) {
            this.tournamentDropdown = false;
        }
    }

    constructor(public authService: AuthService, private eleRef: ElementRef) {}

    ngOnInit() {}

    navbarToggle() {
        this.navbarOpen = !this.navbarOpen;
    }
    tournamentToggle() {
        this.tournamentDropdown = !this.tournamentDropdown;
    }
    clearDropdowns() {
        this.tournamentDropdown = false;
    }
}
