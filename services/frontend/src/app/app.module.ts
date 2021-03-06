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

import { SiteLayoutComponent } from './shared/components/layouts/site-layout/site-layout.component';

import { LoaderComponent } from './shared/components/loader/loader.component';

import { HarmonicSignalPageComponent } from './harmonic-signal-page/harmonic-signal-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HarmonicSignalViewPageComponent } from './harmonic-signal-page/harmonic-signal-view-page/harmonic-signal-view-page.component';
import { SaveModalComponent } from './shared/components/save-modal/save-modal.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { FourierTransformPageComponent } from './fourier-transform-page/fourier-transform-page.component';
import { FourierTransformViewPageComponent } from './fourier-transform-page/fourier-transform-view-page/fourier-transform-view-page.component';
import { SimpleCorrelationPageComponent } from './simple-correlation-page/simple-correlation-page.component';

import { NouisliderModule } from 'ng2-nouislider';
import { SimpleCorrelationViewPageComponent } from './simple-correlation-page/simple-correlation-view-page/simple-correlation-view-page.component';
import { ImageCorrelationPageComponent } from './image-correlation-page/image-correlation-page.component';
import { ImageCorrelationViewPageComponent } from './image-correlation-page/image-correlation-view-page/image-correlation-view-page.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        SiteLayoutComponent,
        RegisterPageComponent,
        LoaderComponent,
        HarmonicSignalPageComponent,
        MainPageComponent,
        HarmonicSignalViewPageComponent,
        SaveModalComponent,
        HistoryPageComponent,
        FourierTransformPageComponent,
        FourierTransformViewPageComponent,
        SimpleCorrelationPageComponent,
        SimpleCorrelationViewPageComponent,
        ImageCorrelationPageComponent,
        ImageCorrelationViewPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        PlotlyModule,
        NouisliderModule,
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
