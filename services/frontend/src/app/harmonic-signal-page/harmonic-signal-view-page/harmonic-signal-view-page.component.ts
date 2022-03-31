import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';

import { HarmonicSignalService } from '../../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignal } from '../../shared/interfaces/harmonic-signal.interfaces';
import { MaterializeService } from '../../shared/services/utils/materialize.service';
import { WebSocketService } from '../../shared/services/websocket/websocket.service';
import { webSocketConfig } from '../../shared/services/websocket/websocket.config';

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
	harmonicSignal: IHarmonicSignal;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private harmonicSignalService: HarmonicSignalService,
                private webSocketService: WebSocketService,) {
    }

    ngOnInit(): void {
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
					}
				},
				error => MaterializeService.toast(error.error),
			);
    }

    deleteHarmonicSignal() {
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
