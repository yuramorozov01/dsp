import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { HarmonicSignalService } from '../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignal, IHarmonicSignalResult } from '../shared/interfaces/harmonic-signal.interfaces';

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
type IWebSocketHarmonicSignalResult = IWebSocketResult<IHarmonicSignalResult>;

@Component({
    selector: 'app-harmonic-signal-page',
    templateUrl: './harmonic-signal-page.component.html',
    styleUrls: ['./harmonic-signal-page.component.css'],
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
export class HarmonicSignalPageComponent implements OnInit {
    @ViewChild('saveModal') saveModal: SaveModalComponent;

    form: FormGroup;

	public harmonicSignal: IHarmonicSignal;
    public harmonicSignalResult: IHarmonicSignalResult;
    public plotData = [];
    public plotLayout = {};
    public plotConfig = {};

    private harmonicSignalError$: Observable<IWebSocketResultError>;
    private harmonicSignalResult$: Observable<IWebSocketHarmonicSignalResult>;

    constructor(private auth: AuthService,
                private router: Router,
                private harmonicSignalService: HarmonicSignalService,
                private webSocketService: WebSocketService,
                @Inject(DOCUMENT) private document: Document) {
    }

    public ngOnInit(): void {
        this.subscribeOnErrorMessages();
        this.subscribeOnResultMessages();
        this.subscribeOnConnectMessages();

        this.form = new FormGroup({
            amplitude: new FormControl(10, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]),
            frequency: new FormControl(43, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]),
            initial_phase: new FormControl(3.14 * 3, [Validators.required,]),
		});
        this.form.valueChanges.subscribe(value => {
            this.sendFormValue();
        });
    }

    private subscribeOnErrorMessages() {
        this.harmonicSignalError$ = this.webSocketService.on<IWebSocketResultError>(WS_EVENTS.WS_ERROR_EVENT_KEY);
        this.harmonicSignalError$.subscribe((message: IWebSocketResultError) => {
            MaterializeService.toast(message.errors);
        });
    }

    private subscribeOnResultMessages() {
        this.harmonicSignalResult$ = this.webSocketService.on<IWebSocketHarmonicSignalResult>(WS_EVENTS.WS_TASK_READY_EVENT_KEY);
        this.harmonicSignalResult$.subscribe((message: IWebSocketHarmonicSignalResult) => {
            this.parseResult(message);
        });
    }

    private subscribeOnConnectMessages() {
        this.webSocketService.on<IWebSocketHarmonicSignalResult>(WS_EVENTS.WS_CONNECT_EVENT_KEY)
            .subscribe((message: IWebSocketHarmonicSignalResult) => {
                this.sendFormValue();
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
        this.plotLayout = {
            title: 'Harmonic signal',
        };
        this.plotConfig = {
            responsive: true,
        };
    }

    private sendFormValue() {
        if (!this.form.invalid) {
            this.webSocketService.send(WS_METHODS.WS_CREATE, this.form.value);
        }
    }

    public onSubmit() {
        this.sendFormValue();
    }

    public saveHarmonicSignal() {
        if (this.auth.isAuthenticated()) {
            this.harmonicSignalService.create(this.form)
                .subscribe(
                    (harmonicSignal: IHarmonicSignal) => {
                        this.saveModal.open(`${this.document.location}/${harmonicSignal.id}/`);
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
