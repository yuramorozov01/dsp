import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
    selector: 'app-site-layout',
    templateUrl: './site-layout.component.html',
    styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

    title = environment.title

    links = [
        {
            url: '/',
            name: 'Main',
        },
        {
            url: '/harmonic_signal',
            name: 'Harmonic signal',
        },
        {
            url: '/fourier_transform',
            name: 'Fourier transform',
        },
        {
            url: '/history',
            name: 'History',
        },
    ];

    constructor(public authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    logout(event: Event) {
        event.preventDefault();
        this.authService.logout();
        this.router.navigate(['/']);
    }

}
