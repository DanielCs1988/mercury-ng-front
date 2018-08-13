import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FriendService} from '../services/friend.service';
import {UserService} from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class FriendshipGuard implements CanActivate {

    constructor(private friendService: FriendService, private userService: UserService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const friendlist = this.friendService.friendlist.getValue();
        const currentUser = this.userService.currentUser.getValue();
        const target = route.params['id'];
        if (!(target === currentUser.id || friendlist.get(target))) {
            this.router.navigate(['/feed']);
            return false;
        }
        return true;
    }
}
