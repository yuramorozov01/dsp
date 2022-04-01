import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

import { TokenInterceptor } from './shared/services/auth/token.interceptor';

import { AppComponent } from './app.component';

import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/components/layouts/site-layout/site-layout.component';

import { LoaderComponent } from './shared/components/loader/loader.component';

import { HarmonicSignalPageComponent } from './harmonic-signal-page/harmonic-signal-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HarmonicSignalViewPageComponent } from './harmonic-signal-page/harmonic-signal-view-page/harmonic-signal-view-page.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        AuthLayoutComponent,
        SiteLayoutComponent,
        RegisterPageComponent,
        LoaderComponent,
        HarmonicSignalPageComponent,
        MainPageComponent,
        HarmonicSignalViewPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        PlotlyModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: TokenInterceptor,
        },
        DatePipe,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
