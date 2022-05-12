import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { SimpleCorrelationService } from '../shared/services/simple-correlation/simple-correlation.service';
import { ISimpleCorrelation, ISimpleCorrelationResult } from '../shared/interfaces/simple-correlation.interfaces';

import { MaterializeService } from '../shared/services/utils/materialize.service';
import { AuthService } from '../shared/services/auth/auth.service';

import { SaveModalComponent } from '../shared/components/save-modal/save-modal.component';

import { WebSocketService } from '../shared/services/websocket/websocket.service';
import { webSocketConfig } from '../shared/services/websocket/websocket.config';
import { IWebSocketMessage, IWebSocketResult, IWebSocketError } from '../shared/interfaces/websocket.interfaces';
import { WS_EVENTS } from '../shared/services/websocket/websocket.events';
import { WS_METHODS } from '../shared/services/websocket/websocket.methods';
import { DOCUMENT } from '@angular/common';

type IWebSocketResultError = IWebSocketError;
type IWebSocketSimpleCorrelationResult = IWebSocketResult<ISimpleCorrelationResult>;

@Component({
    selector: 'app-simple-correlation-page',
    templateUrl: './simple-correlation-page.component.html',
    styleUrls: ['./simple-correlation-page.component.css'],
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
export class SimpleCorrelationPageComponent implements OnInit {
    @ViewChild('saveModal') saveModal: SaveModalComponent;

    form: FormGroup;

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

    constructor(private auth: AuthService,
                private router: Router,
                private simpleCorrelationService: SimpleCorrelationService,
                private webSocketService: WebSocketService,
                @Inject(DOCUMENT) private document: Document) {
    }

    public ngOnInit(): void {
        this.subscribeOnErrorMessages();
        this.subscribeOnResultMessages();
        this.subscribeOnConnectMessages();

        this.form = new FormGroup({
            amplitudes_signal_1: new FormControl('33,8', [Validators.required, Validators.pattern(/^\d+(?:,\d+)*$/)]),
            frequencies_signal_1: new FormControl('5,89', [Validators.required, Validators.pattern(/^\d+(?:,\d+)*$/)]),
            amount_of_points_signal_1: new FormControl(1024, [Validators.required, Validators.min(1)]),
		    amplitudes_signal_2: new FormControl('4,84', [Validators.required, Validators.pattern(/^\d+(?:,\d+)*$/)]),
            frequencies_signal_2: new FormControl('2,9', [Validators.required, Validators.pattern(/^\d+(?:,\d+)*$/)]),
            amount_of_points_signal_2: new FormControl(1024, [Validators.required, Validators.min(1)]),
        });
        this.form.valueChanges.subscribe(value => {
            this.sendFormValue();
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
        });
    }

    private subscribeOnConnectMessages() {
        this.webSocketService.on<IWebSocketSimpleCorrelationResult>(WS_EVENTS.WS_CONNECT_EVENT_KEY)
            .subscribe((message: IWebSocketSimpleCorrelationResult) => {
                this.sendFormValue();
            });
        }

    private parseResult(message: IWebSocketSimpleCorrelationResult) {
        // Parse signal 1
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

    private sendFormValue() {
        if (!this.form.invalid) {
            this.webSocketService.send(WS_METHODS.WS_CREATE, this.form.value);
            this.simpleCorrelation = null;
        }
    }

    public onSubmit() {
        this.sendFormValue();
    }

    public saveSimpleCorrelation() {
        if (this.auth.isAuthenticated()) {
            this.simpleCorrelationService.create(this.form)
                .subscribe(
                    (simpleCorrelation: ISimpleCorrelation) => {
                        this.saveModal.open(`${this.document.location}/${simpleCorrelation.id}/`);
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
