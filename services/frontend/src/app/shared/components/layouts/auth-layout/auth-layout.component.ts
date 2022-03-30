import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit {
    title = environment.title

    links = [
        {
            url: '/login',
            name: 'Login',
        },
        {
            url: '/register',
            name: 'Register',
        },
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}
