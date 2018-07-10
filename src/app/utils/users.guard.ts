import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class UsersGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.userService.usersLoaded) {
            this.router.navigate(['/feed']);
            return false;
        }
        return true;
    }
}
