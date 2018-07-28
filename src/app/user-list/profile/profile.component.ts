import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {Subscription} from 'rxjs';
import {Post, UserDetails, User} from '../../models';
import {FETCH_PROFILE} from '../../queries/profile';
import {faBirthdayCake, faEnvelope, faMapMarker, faMobileAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    private profileSub: Subscription;
    profile: UserDetails;

    phoneIcon = faMobileAlt;
    emailIcon = faEnvelope;
    addressIcon = faMapMarker;
    birthdayIcon = faBirthdayCake;

    constructor(
        private route: ActivatedRoute, private router: Router, private apollo: Apollo) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params: Params) => {
            const id = params['id'];
            if (!id) {
                return this.router.navigate(['/lobby']);
            }
            this.fetchProfile(id);
        });
    }

    private fetchProfile(id: string) {
        this.profileSub = this.apollo.watchQuery<any>({
            query: FETCH_PROFILE,
            variables: { id }
        }).valueChanges.subscribe(({ data }) => {
            const user = data.user;
            const posts: Post[] = [...user.posts];
            const friends = [
                ...user.acceptedFriends.filter(friend => friend.accepted).map(friendship => friendship.initiator),
                ...user.addedFriends.filter(friend => friend.accepted).map(friendship => friendship.target)
            ];
            this.profile = {
                id: user.id, googleId: user.googleId, familyName: user.familyName, givenName: user.givenName,
                pictureUrl: user.pictureUrl, createdAt: user.createdAt, profile: user.profile,
                posts: posts.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
                friends: friends.sort((a: User, b: User) => a.givenName.localeCompare(b.givenName))
            };
        });
    }

    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
        this.profileSub.unsubscribe();
    }
}
