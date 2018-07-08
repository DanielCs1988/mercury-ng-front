import {Injectable, OnDestroy} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CURRENT_USER_QUERY, USERS_QUERY} from '../queries/users';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {

    private querySubscription: Subscription;
    users = new BehaviorSubject<User[]>([]);
    currentUser = new BehaviorSubject<User>(null);

    constructor(private apollo: Apollo) {
        this.querySubscription = this.apollo
            .watchQuery<any>({ query: USERS_QUERY })
                .valueChanges
                .subscribe(({data}) => {
                    this.users.next(data.users);
                });
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
    }

    async getUserProfile() {
        const {data} = await this.apollo.query<any>({ query: CURRENT_USER_QUERY }).toPromise();
        this.currentUser.next(data.currentUser);
    }

    removeUserProfile() {
        this.currentUser.next(null);
    }
}
