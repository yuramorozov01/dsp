import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/services/auth/auth.guard';

import { SiteLayoutComponent } from './shared/components/layouts/site-layout/site-layout.component';

import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

import { MainPageComponent } from './main-page/main-page.component';

import { HistoryPageComponent } from './history-page/history-page.component';

import { HarmonicSignalPageComponent } from './harmonic-signal-page/harmonic-signal-page.component';
import { HarmonicSignalViewPageComponent } from './harmonic-signal-page/harmonic-signal-view-page/harmonic-signal-view-page.component';

const routes: Routes = [
    {
        path: '',
        component: SiteLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginPageComponent,
            },
            {
                path: 'register',
                component: RegisterPageComponent,
            },
            {
                path: '',
                component: MainPageComponent,
            },
            {
                path: 'history',
                component: HistoryPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'harmonic_signal',
                component: HarmonicSignalPageComponent,
            },
            {
                path: 'harmonic_signal/:id',
                component: HarmonicSignalViewPageComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule {
}
