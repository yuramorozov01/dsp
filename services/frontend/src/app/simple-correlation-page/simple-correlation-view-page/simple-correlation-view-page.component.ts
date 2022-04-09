import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';

import { SimpleCorrelationService } from '../../shared/services/simple-correlation/simple-correlation.service';
import { ISimpleCorrelation, ISimpleCorrelationResult } from '../../shared/interfaces/simple-correlation.interfaces';

import { MaterializeService } from '../../shared/services/utils/materialize.service';
import { AuthService } from '../../shared/services/auth/auth.service';

import { WebSocketService } from '../../shared/services/websocket/websocket.service';
import { webSocketConfig } from '../../shared/services/websocket/websocket.config';
import { IWebSocketMessage, IWebSocketResult, IWebSocketError, statusValues } from '../../shared/interfaces/websocket.interfaces';
import { WS_EVENTS } from '../../shared/services/websocket/websocket.events';
import { WS_METHODS } from '../../shared/services/websocket/websocket.methods';

type IWebSocketResultError = IWebSocketError;
type IWebSocketSimpleCorrelationResult = IWebSocketResult<ISimpleCorrelationResult>;

@Component({
    selector: 'app-simple-correlation-view-page',
    templateUrl: './simple-correlation-view-page.component.html',
    styleUrls: ['./simple-correlation-view-page.component.css'],
    providers: [
        WebSocketService,
        {
            provide: webSocketConfig,
            useValue: {
                url: environment.ws_base + '/simple_correlation_result/',
            },
        },
    ],
})
export class SimpleCorrelationViewPageComponent implements OnInit {
    public loadStatus: statusValues = 'PENDING';
	public simpleCorrelation: ISimpleCorrelation;
    public simpleCorrelationResult: ISimpleCorrelationResult;
    public plotDataSignal1 = [];
    public plotLayoutSignal1 = {};
    public plotConfig = {};

    public plotDataSignal2 = [];
    public plotLayoutSignal2 = {};

    public plotDataSignalResult = [];
    public plotLayoutSignalResult = {};

    private simpleCorrelationError$: Observable<IWebSocketResultError>;
    private simpleCorrelationResult$: Observable<IWebSocketSimpleCorrelationResult>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private auth: AuthService,
                private simpleCorrelationService: SimpleCorrelationService,
                private webSocketService: WebSocketService) {
    }

    public ngOnInit(): void {
        this.subscribeOnErrorMessages();
        this.subscribeOnResultMessages();
        this.subscribeOnConnectMessages();
    }

    private getSimpleCorrelation() {
        this.route.params
			.pipe(
				switchMap(
					(params: Params) => {
						if (params['id']) {
							return this.simpleCorrelationService.getById(params['id']);
						}
						return of(null);
					}
				)
			)
			.subscribe(
				(simpleCorrelation: ISimpleCorrelation) => {
					if (simpleCorrelation) {
						this.simpleCorrelation = simpleCorrelation;
                        this.getSimpleCorrelationResultByWebsocket();
					}
				},
				error => MaterializeService.toast(error.error),
			);
    }

    private getSimpleCorrelationResultByWebsocket() {
        this.webSocketService.send(WS_METHODS.WS_GET, {
            'task_id': this.simpleCorrelation.task_id,
        });
    }

    private subscribeOnErrorMessages() {
        this.simpleCorrelationError$ = this.webSocketService.on<IWebSocketResultError>(WS_EVENTS.WS_ERROR_EVENT_KEY);
        this.simpleCorrelationError$.subscribe((message: IWebSocketResultError) => {
            MaterializeService.toast(message.errors);
        });
    }

    private subscribeOnResultMessages() {
        this.simpleCorrelationResult$ = this.webSocketService.on<IWebSocketSimpleCorrelationResult>(WS_EVENTS.WS_TASK_READY_EVENT_KEY);
        this.simpleCorrelationResult$.subscribe((message: IWebSocketSimpleCorrelationResult) => {
            this.parseResult(message);
            if (['PENDING', 'STARTED'].includes(message.status)) {
                this.getSimpleCorrelationResultByWebsocket();
            }
        });
    }

    private subscribeOnConnectMessages() {
        this.webSocketService.on<IWebSocketSimpleCorrelationResult>(WS_EVENTS.WS_CONNECT_EVENT_KEY)
            .subscribe((message: IWebSocketSimpleCorrelationResult) => {
                this.getSimpleCorrelation()
            });
        }

    private parseResult(message: IWebSocketSimpleCorrelationResult) {
        this.loadStatus = message.status;

        if (this.loadStatus == 'SUCCESS') {
            // Parse main polyharmonic
            this.simpleCorrelationResult = message.result;
            this.plotDataSignal1 = [{
                x: this.simpleCorrelationResult.signal_1.time,
                y: this.simpleCorrelationResult.signal_1.result_values,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'red'},
            }];
            this.plotLayoutSignal1 = {
                title: 'Polyharmonic signal 1',
                width: 650,
            };
            this.plotConfig = {
                responsive: true,
            };

            // Parse signal 2
            this.plotDataSignal2 = [{
                x: this.simpleCorrelationResult.signal_2.time,
                y: this.simpleCorrelationResult.signal_2.result_values,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'red'},
            }];
            this.plotLayoutSignal2 = {
                title: 'Polyharmonic signal 2',
                width: 650,
            };

            // Parse signal result
            this.plotDataSignalResult = [{
                x:[...Array(this.simpleCorrelationResult.correlation.length).keys()],
                y: this.simpleCorrelationResult.correlation,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'red'},
            }];
            this.plotLayoutSignalResult = {
                title: 'Correlation result',
                width: 1350,
            };
        }
    }

    public recalcCorrelationResult(event) {
        let bottom = event[0];
        let top = event[1];
        let data: number[] = this.simpleCorrelationResult.correlation.slice();
        for (let i = 0; i <= bottom; i++) {
            data[i] = 0;
        }
        for (let i = top; i < data.length; i++) {
            data[i] = 0;
        }
        this.plotDataSignalResult[0].y = data;
    }

    public deleteSimpleCorrelation() {
		const decision = window.confirm('Are you sure you want to delete this simple correlation?');
		if (decision) {
			this.simpleCorrelationService.delete(this.simpleCorrelation.id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Simple correlation has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.router.navigate(['/simple_correlation'])
				);
		}
	}
}
