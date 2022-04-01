import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';

import { HarmonicSignalService } from '../../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignal, IHarmonicSignalResult } from '../../shared/interfaces/harmonic-signal.interfaces';

import { MaterializeService } from '../../shared/services/utils/materialize.service';
import { WebSocketService } from '../../shared/services/websocket/websocket.service';
import { webSocketConfig } from '../../shared/services/websocket/websocket.config';
import { IWebSocketMessage, IWebSocketResult, IWebSocketError } from '../../shared/interfaces/websocket.interfaces';
import { WS_EVENTS } from '../../shared/services/websocket/websocket.events';
import { WS_METHODS } from '../../shared/services/websocket/websocket.methods';

type IWebSocketResultError = IWebSocketError;
type IWebSocketHarmonicSignalResult = IWebSocketResult<IHarmonicSignalResult>;

@Component({
    selector: 'app-harmonic-signal-view-page',
    templateUrl: './harmonic-signal-view-page.component.html',
    styleUrls: ['./harmonic-signal-view-page.component.css'],
    providers: [
        WebSocketService,
        {
            provide: webSocketConfig,
            useValue: {
                url: environment.ws_base + '/harmonic_signal_result/',
            },
        },
    ],
})
export class HarmonicSignalViewPageComponent implements OnInit {
	public harmonicSignal: IHarmonicSignal;
    public harmonicSignalResult: IHarmonicSignalResult;
    public plotData = [];
    public plotLayout = {};

    private harmonicSignalError$: Observable<IWebSocketResultError>;
    private harmonicSignalResult$: Observable<IWebSocketHarmonicSignalResult>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private harmonicSignalService: HarmonicSignalService,
                private webSocketService: WebSocketService) {
    }

    public ngOnInit(): void {
        this.subscribeOnErrorMessages();
        this.subscribeOnResultMessages();

		this.route.params
			.pipe(
				switchMap(
					(params: Params) => {
						if (params['id']) {
							return this.harmonicSignalService.getById(params['id']);
						}
						return of(null);
					}
				)
			)
			.subscribe(
				(harmonicSignal: IHarmonicSignal) => {
					if (harmonicSignal) {
						this.harmonicSignal = harmonicSignal;
                        this.webSocketService.send(WS_METHODS.WS_GET, {
                            'task_id': this.harmonicSignal.task_id,
                        });
					}
				},
				error => MaterializeService.toast(error.error),
			);

    }

    private subscribeOnErrorMessages() {
        this.harmonicSignalError$ = this.webSocketService.on<IWebSocketResultError>(WS_EVENTS.WS_ERROR_EVENT_KEY);
        this.harmonicSignalError$.subscribe((message: IWebSocketResultError) => {
            MaterializeService.toast({'Error': message.error_msg});
        });
    }

    private subscribeOnResultMessages() {
        this.harmonicSignalResult$ = this.webSocketService.on<IWebSocketHarmonicSignalResult>(WS_EVENTS.WS_TASK_READY_EVENT_KEY);
        this.harmonicSignalResult$.subscribe((message: IWebSocketHarmonicSignalResult) => {
            this.parseResult(message);
        });
    }

    private parseResult(message: IWebSocketHarmonicSignalResult) {
        this.harmonicSignalResult = message.result;
        this.plotData = [
            {
                x: [...Array(this.harmonicSignalResult.harmonic_values.length).keys()],
                y: this.harmonicSignalResult.harmonic_values,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'red'},
            },
        ];
        this.plotLayout =
        {
            width: 1200,
            height: 600,
            title: 'Harmonic signal',
        }
    }

    public deleteHarmonicSignal() {
		const decision = window.confirm('Are you sure you want to delete this harmonic signal?');
		if (decision) {
			this.harmonicSignalService.delete(this.harmonicSignal.id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Harmonic signal has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.router.navigate(['/harmonic_signal'])
				);
		}
	}
}
