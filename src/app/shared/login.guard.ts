import { Injectable } from "@angular/core";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { take, map, tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.authService.user.pipe(
            take(1),
            map(user => !!user),
            map(loggedIn => {
                if (loggedIn) {
                    console.log("Cannot go to /login when logged in!");
                    this.router.navigate(["/"]);
                    return false;
                }
                return true;
            })
        );
    }
}
