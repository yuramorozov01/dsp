import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { FourierTransformService } from '../shared/services/fourier-transform/fourier-transform.service';
import { IFourierTransform, IFourierTransformResult } from '../shared/interfaces/fourier-transform.interfaces';

import { MaterializeService } from '../shared/services/utils/materialize.service';
import { AuthService } from '../shared/services/auth/auth.service';

import { SaveModalComponent } from '../shared/components/save-modal/save-modal.component';

import { WebSocketService } from '../shared/services/websocket/websocket.service';
import { webSocketConfig } from '../shared/services/websocket/websocket.config';
import { IWebSocketMessage, IWebSocketResult, IWebSocketError } from '../shared/interfaces/websocket.interfaces';
import { WS_EVENTS } from '../shared/services/websocket/websocket.events';
import { WS_METHODS } from '../shared/services/websocket/websocket.methods';
import { DOCUMENT } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';

type IWebSocketResultError = IWebSocketError;
type IWebSocketFourierTransformResult = IWebSocketResult<IFourierTransformResult>;

@Component({
    selector: 'app-fourier-transform-page',
    templateUrl: './fourier-transform-page.component.html',
    styleUrls: ['./fourier-transform-page.component.css'],
    providers: [
        WebSocketService,
        {
            provide: webSocketConfig,
            useValue: {
                url: environment.ws_base + '/fourier_transform_result/',
            },
        },
    ],
})
export class FourierTransformPageComponent implements OnInit {
     @ViewChild('saveModal') saveModal: SaveModalComponent;
     @ViewChild('mainPolyharmonnic') mainPolyharmonic: ElementRef;

    form: FormGroup;

	public fourierTransform: IFourierTransform;
    public fourierTransformResult: IFourierTransformResult;
    public plotData = [];
    public plotLayout = {};
    public plotConfig = {};

    public plotDataHarmonics = [];
    public plotLayoutHarmonics = [];

    public plotDataFrequencySpectre = [];
    public plotLayoutFrequencySpectre = {};

    private fourierTransformError$: Observable<IWebSocketResultError>;
    private fourierTransformResult$: Observable<IWebSocketFourierTransformResult>;

    constructor(private auth: AuthService,
                private router: Router,
                private fourierTransformService: FourierTransformService,
                private webSocketService: WebSocketService,
                @Inject(DOCUMENT) private document: Document) {
    }

    public ngOnInit(): void {
        this.subscribeOnErrorMessages();
        this.subscribeOnResultMessages();
        this.subscribeOnConnectMessages();

        this.form = new FormGroup({
            amplitudes: new FormControl('33,8', [Validators.required, Validators.pattern(/^\d+(?:,\d+)*$/)]),
            frequencies: new FormControl('5,89', [Validators.required, Validators.pattern(/^\d+(?:,\d+)*$/)]),
		});
        this.form.valueChanges.subscribe(value => {
            this.sendFormValue();
        });
    }

    private subscribeOnErrorMessages() {
        this.fourierTransformError$ = this.webSocketService.on<IWebSocketResultError>(WS_EVENTS.WS_ERROR_EVENT_KEY);
        this.fourierTransformError$.subscribe((message: IWebSocketResultError) => {
            MaterializeService.toast(message.errors);
        });
    }

    private subscribeOnResultMessages() {
        this.fourierTransformResult$ = this.webSocketService.on<IWebSocketFourierTransformResult>(WS_EVENTS.WS_TASK_READY_EVENT_KEY);
        this.fourierTransformResult$.subscribe((message: IWebSocketFourierTransformResult) => {
            this.parseResult(message);
        });
    }

    private subscribeOnConnectMessages() {
        this.webSocketService.on<IWebSocketFourierTransformResult>(WS_EVENTS.WS_CONNECT_EVENT_KEY)
            .subscribe((message: IWebSocketFourierTransformResult) => {
                this.sendFormValue();
            });
        }

    private parseResult(message: IWebSocketFourierTransformResult) {
        // Parse main polyharmonic
        this.fourierTransformResult = message.result;
        this.plotData = [{
            x: this.fourierTransformResult.time,
            y: this.fourierTransformResult.result_values,
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'red'},
        }];
        this.plotLayout = {
            title: 'Polyharmonic signal',
            width: 1350,
        };
        this.plotConfig = {
            responsive: true,
        };

        // Parse harmonics of main polyharmonic
        this.plotDataHarmonics = [];
        this.plotLayoutHarmonics = [];
        for (let [index, harmonicValues] of this.fourierTransformResult.harmonics_values.entries()) {
            this.plotDataHarmonics.push([{
                x: [...Array(harmonicValues.length).keys()],
                y: harmonicValues,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'red'},
            }]);
            this.plotLayoutHarmonics.push({
                title: `Harmonic signal ${index}`,
                width: 500,
                height: 250,
            });
        }

        // Parse frequency spectre
        this.plotDataFrequencySpectre = [{
            x: [...Array(this.fourierTransformResult.fft_values.length).keys()],
            y: Object.assign([], this.fourierTransformResult.fft_values),
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'red'},
        }];
        this.plotLayoutFrequencySpectre = {
            title: 'Frequency spectre',
            width: 1350,
        };
    }

    public recalcResultPolyharmonic(index: number, event) {
        // Redraw main polyharmonic
        let toChangeValue = -1;
        if (!event.target.checked) {
            toChangeValue = 1;
        }
        let data = this.plotData[0].y.slice();
        for (let [i, value] of this.plotDataHarmonics[index][0].y.entries()) {
            data[i] -= toChangeValue * value;
        }
        this.plotData[0].y = data;

        // Redraw frequency spectre
        let polyharmonicFrequencies = this.form.get('frequencies').value.split(',').map(function (x) {
            return parseInt(x, 10);
        });
        let frequencyValue = polyharmonicFrequencies[index];
        data = this.plotDataFrequencySpectre[0].y.slice();
        data[frequencyValue] -= toChangeValue * this.fourierTransformResult.fft_values[frequencyValue];
        this.plotDataFrequencySpectre[0].y = data;
    }

    private sendFormValue() {
        if (!this.form.invalid) {
            this.webSocketService.send(WS_METHODS.WS_CREATE, this.form.value);
            this.fourierTransform = null;
        }
    }

    public onSubmit() {
        this.sendFormValue();
    }

    public saveFourierTransform() {
        if (this.auth.isAuthenticated()) {
            this.fourierTransformService.create(this.form)
                .subscribe(
                    (fourierTransform: IFourierTransform) => {
                        this.saveModal.open(`${this.document.location}/${fourierTransform.id}/`);
                    },
                        error => {
                        MaterializeService.toast(error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
	}
}
