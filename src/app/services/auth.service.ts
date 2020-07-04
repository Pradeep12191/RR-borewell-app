import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Injectable()
export class AuthService {
    private _username: string = null;
    private _userrole: string = null;
    private _userid: string = null;
    private _password: string = null;
    private _token: string = null;

    constructor(
        private cookie: CookieService,
        private router: Router
    ) {

    }

    get token() {
        const tokenExists = this.cookie.check('token');
        if (tokenExists) {
            return this.cookie.get('token')
        }
        return this._token;
    }

    get userid() {
        const useridExists = this.cookie.check('userid');
        if (useridExists) {
            return this.cookie.get('userid')
        }
        return this._userid;
    }

    get username() {
        const usernameExists = this.cookie.check('username');
        if (usernameExists) {
            return this.cookie.get('username')
        }
        return this._username;
    }

    get userrole() {
        // return 'owneras';
        const userroleExists = this.cookie.check('userrole');
        if (userroleExists) {
            return this.cookie.get('userrole');
        }
        return this._userrole;
    }

    get password() {
        const passwordExists = this.cookie.check('password');
        if (passwordExists) {
            return this.cookie.get('password')
        }
        return this._password;
    }

    // tslint:disable-next-line: adjacent-overload-signatures
    set token(token) {
        if (token) {
            this.cookie.set('token', token, moment().add(50, 'day').toDate());
            this._token = token;
        } else {
            this.cookie.delete('token');
            this._token = null;
        }
    }

    // tslint:disable-next-line: adjacent-overload-signatures
    set userid(id) {
        if (id) {
            this.cookie.set('userid', id, moment().add(50, 'day').toDate());
            this._userid = id;
        } else {
            this.cookie.delete('userid');
            this._userid = null;
        }
    }

    // tslint:disable-next-line: adjacent-overload-signatures
    set username(name) {
        if (name) {
            this.cookie.set('username', name, moment().add(50, 'day').toDate());
            this._username = name;
        } else {
            this.cookie.delete('username');
            this._username = null;
        }
    }

    // tslint:disable-next-line: adjacent-overload-signatures
    set userrole(role) {
        if (role) {
            this.cookie.set('userrole', role, moment().add(50, 'day').toDate());
            this._userrole = role;
        } else {
            this.cookie.delete('userrole');
            this._userrole = null;
        }
    }

    // tslint:disable-next-line: adjacent-overload-signatures
    set password(password) {
        if (password) {
            this.cookie.set('password', password, moment().add(50, 'day').toDate());
            this._password = password;
        } else {
            this.cookie.delete('password');
            this._password = null;
        }
    }

    logOut() {
        this.userid = null;
        this.password = null;
        this.username = null;
        this.token = null;
        this.userrole = null;
        this.router.navigate(['login']);
    }

    isLoggedIn() {
        return this.token;
    }

    createToken(userName, password) {
        const decodeStr = userName + ':' + password;
        const encodeStr = btoa(decodeStr);
        return encodeStr;
    }
}