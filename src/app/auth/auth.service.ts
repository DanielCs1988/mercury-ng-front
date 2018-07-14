import * as auth0 from 'auth0-js';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Auth0DecodedHash} from 'auth0-js';
import {UserService} from '../services/user.service';

(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private auth0 = new auth0.WebAuth({
        clientID: 'hf9N-twx_HdoCwvbTjfXuEEh0AW2lHPi',
        domain: 'danielcs88.eu.auth0.com',
        responseType: 'token id_token',
        audience: 'Mercury-App',
        redirectUri: 'http://localhost:4200/callback',
        scope: 'openid profile'
    });

    constructor(private router: Router, private userService: UserService) { }

    login(): void {
        this.auth0.authorize();
    }

    handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setSession(authResult);
                this.userService.getUserProfile();
                this.router.navigate(['/feed']);
            } else if (err) {
                console.error(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            } else {
                if (this.isAuthenticated()) {
                    this.userService.getUserProfile();
                }
            }
        })
    }

    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        this.userService.removeUserProfile();
        this.router.navigate(['/lobby']);
    }

    private setSession(authResult: Auth0DecodedHash) {
        const expiresAt = JSON.stringify(new Date().getTime() + authResult.expiresIn * 1000);
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt);
    }

    isAuthenticated(): boolean {
        const expiresAt = JSON.parse(localStorage.getItem("expires_at") || '{}');
        return expiresAt !== {} && new Date().getTime() < expiresAt;
    }
}
