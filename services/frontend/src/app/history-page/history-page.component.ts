import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { HarmonicSignalService } from '../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignalList } from '../shared/interfaces/harmonic-signal.interfaces';
import { MaterializeService } from '../shared/services/utils/materialize.service';


@Component({
    selector: 'app-history-page',
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
    harmonicSignals$: Observable<IHarmonicSignalList[]>;

    constructor(private harmonicSignalService: HarmonicSignalService) {
    }

    ngOnInit(): void {
        this.fetchHarmonicSignals()
    }

    private fetchHarmonicSignals() {
        this.harmonicSignals$ = this.harmonicSignalService.fetch();
        this.harmonicSignals$.subscribe(
            (harmonicSignals: IHarmonicSignalList[]) => {
			},
			error => {
				MaterializeService.toast(error.error);
			}
        )
    }

    public deleteHarmonicSignal(id: number) {
		const decision = window.confirm('Are you sure you want to delete this harmonic signal?');
		if (decision) {
			this.harmonicSignalService.delete(id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Harmonic signal has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.fetchHarmonicSignals()
				);
		}
	}

}
