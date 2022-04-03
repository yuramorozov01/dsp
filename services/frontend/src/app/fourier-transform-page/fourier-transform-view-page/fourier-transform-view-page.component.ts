import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';

import { FourierTransformService } from '../../shared/services/fourier-transform/fourier-transform.service';
import { IFourierTransform, IFourierTransformResult } from '../../shared/interfaces/fourier-transform.interfaces';

import { MaterializeService } from '../../shared/services/utils/materialize.service';
import { AuthService } from '../../shared/services/auth/auth.service';

import { WebSocketService } from '../../shared/services/websocket/websocket.service';
import { webSocketConfig } from '../../shared/services/websocket/websocket.config';
import { IWebSocketMessage, IWebSocketResult, IWebSocketError, statusValues } from '../../shared/interfaces/websocket.interfaces';
import { WS_EVENTS } from '../../shared/services/websocket/websocket.events';
import { WS_METHODS } from '../../shared/services/websocket/websocket.methods';

import * as PlotlyJS from 'plotly.js-dist-min';

type IWebSocketResultError = IWebSocketError;
type IWebSocketFourierTransformResult = IWebSocketResult<IFourierTransformResult>;

@Component({
    selector: 'app-fourier-transform-view-page',
    templateUrl: './fourier-transform-view-page.component.html',
    styleUrls: ['./fourier-transform-view-page.component.css'],
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
export class FourierTransformViewPageComponent implements OnInit {
    public loadStatus: statusValues = 'PENDING';
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

    constructor(private router: Router,
                private route: ActivatedRoute,
                private auth: AuthService,
                private fourierTransformService: FourierTransformService,
                private webSocketService: WebSocketService) {
    }

    public ngOnInit(): void {
        this.subscribeOnErrorMessages();
        this.subscribeOnResultMessages();
        this.subscribeOnConnectMessages();
    }

    private getFourierTransform() {
        this.route.params
			.pipe(
				switchMap(
					(params: Params) => {
						if (params['id']) {
							return this.fourierTransformService.getById(params['id']);
						}
						return of(null);
					}
				)
			)
			.subscribe(
				(fourierTransform: IFourierTransform) => {
					if (fourierTransform) {
						this.fourierTransform = fourierTransform;
                        this.getFourierTransformResultByWebsocket();
					}
				},
				error => MaterializeService.toast(error.error),
			);
    }

    private getFourierTransformResultByWebsocket() {
        this.webSocketService.send(WS_METHODS.WS_GET, {
            'task_id': this.fourierTransform.task_id,
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
            if (['PENDING', 'STARTED'].includes(message.status)) {
                this.getFourierTransformResultByWebsocket();
            }
        });
    }

    private subscribeOnConnectMessages() {
        this.webSocketService.on<IWebSocketFourierTransformResult>(WS_EVENTS.WS_CONNECT_EVENT_KEY)
            .subscribe((message: IWebSocketFourierTransformResult) => {
                this.getFourierTransform()
            });
        }

    private parseResult(message: IWebSocketFourierTransformResult) {
        this.loadStatus = message.status;

        if (this.loadStatus == 'SUCCESS') {
            // Parse main polyharmonic
            this.fourierTransformResult = message.result;
            this.plotData = [
                {
                    x: this.fourierTransformResult.time,
                    y: this.fourierTransformResult.result_values,
                    type: 'scatter',
                    mode: 'lines+points',
                    marker: {color: 'red'},
                },
            ];
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
    }

    public recalcResultPolyharmonic(index: number, event) {
        // Redraw main polyharmonic
        let toChangeValue = -1;
        if (!event.target.checked) {
            toChangeValue = 1;
        }
        for (let [i, value] of this.plotDataHarmonics[index][0].y.entries()) {
            this.plotData[0].y[i] -= toChangeValue * value;
        }
        PlotlyJS.newPlot('mainPolyharmonic', this.plotData, this.plotLayout);

        // Redraw frequency spectre
        let polyharmonicFrequencies = this.fourierTransform.frequencies.split(',').map(function (x) {
            return parseInt(x, 10);
        });
        let frequencyValue = polyharmonicFrequencies[index];
        console.log(this.fourierTransformResult.fft_values[frequencyValue]);
        this.plotDataFrequencySpectre[0].y[frequencyValue] -= toChangeValue * this.fourierTransformResult.fft_values[frequencyValue];
        PlotlyJS.newPlot('frequencySpectre', this.plotDataFrequencySpectre, this.plotLayoutFrequencySpectre);
    }

    public deleteFourierTransform() {
		const decision = window.confirm('Are you sure you want to delete this fourier transform?');
		if (decision) {
			this.fourierTransformService.delete(this.fourierTransform.id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Fourier transform has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.router.navigate(['/fourier_transform'])
				);
		}
	}
}
