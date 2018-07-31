import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_PROFILE, FETCH_PROFILE, UPDATE_PROFILE} from '../queries/profile';
import {Profile} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private apollo: Apollo) { }

    createProfile(userId: string, profile: Profile) {
        const { id, ...data } = profile;
        this.apollo.mutate({
            mutation: CREATE_PROFILE,
            variables: { data },

            optimisticResponse: {
                __typename: 'Mutation',
                createProfile: {
                    __typename: 'Profile',
                    ...profile
                }
            },

            update: (proxy, { data: { createProfile } }) => {
                const userProfile: any = proxy.readQuery({ query: FETCH_PROFILE, variables: { id: userId } });
                userProfile.user = { ...userProfile.user, profile: createProfile };
                proxy.writeQuery({ query: FETCH_PROFILE, variables: { id: userId }, data: userProfile });
            }
        });
    }

    updateProfile(profile: Profile) {
        const { id, ...data } = profile; // Aah, the beauty of it. Puts the id in a const and the rest in a separate object.
        console.log(id, data);
        this.apollo.mutate({
            mutation: UPDATE_PROFILE,
            variables: { id, data },

            optimisticResponse: {
                __typename: 'Mutation',
                updateProfile: {
                    __typename: 'Profile',
                    ...profile
                }
            }
        });
    }
}
