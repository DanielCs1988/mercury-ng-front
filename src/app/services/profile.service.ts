import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_PROFILE, FETCH_PROFILE, UPDATE_PROFILE} from '../queries/profile';
import {Profile} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private apollo: Apollo) { }

    createProfile(id: string, profile: Profile) {
        this.apollo.mutate({
            mutation: CREATE_PROFILE,
            variables: { data: { ...profile } },

            optimisticResponse: {
                __typename: 'Mutation',
                createProfile: {
                    __typename: 'Profile',
                    ...profile
                }
            },

            update: (proxy, { data: { createProfile } }) => {
                const data: any = proxy.readQuery({ query: FETCH_PROFILE, variables: { id } });
                data.user = { ...data.user, profile: createProfile };
                proxy.writeQuery({ query: FETCH_PROFILE, variables: { id }, data });
            }
        });
    }

    updateProfile(userId: string, profile: Profile) {
        const { id, ...data } = profile; // Aah, the beauty of it. Puts the id in a const and the rest in a separate object.
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
