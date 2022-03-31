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
            url: '/main',
            name: 'Main',
        },
        {
            url: '/harmonic_signal',
            name: 'Harmonic signal',
        },
    ];

    constructor(private auth: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    logout(event: Event) {
        event.preventDefault();
        this.auth.logout();
        this.router.navigate(['/']);
    }

}
