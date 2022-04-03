import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { HarmonicSignalService } from '../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignalList } from '../shared/interfaces/harmonic-signal.interfaces';

import { FourierTransformService } from '../shared/services/fourier-transform/fourier-transform.service';
import { IFourierTransformList } from '../shared/interfaces/fourier-transform.interfaces';

import { MaterializeService } from '../shared/services/utils/materialize.service';


@Component({
    selector: 'app-history-page',
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
    harmonicSignals$: Observable<IHarmonicSignalList[]>;
    fourierTransforms$: Observable<IFourierTransformList[]>;

    constructor(private harmonicSignalService: HarmonicSignalService,
                private fourierTransformService: FourierTransformService) {
    }

    ngOnInit(): void {
        this.fetchHarmonicSignals();
        this.fetchFourierTransforms();
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

    private fetchFourierTransforms() {
        this.fourierTransforms$ = this.fourierTransformService.fetch();
        this.fourierTransforms$.subscribe(
            (fourierTransforms: IFourierTransformList[]) => {
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

    public deleteFourierTransform(id: number) {
		const decision = window.confirm('Are you sure you want to delete this fourier transform?');
		if (decision) {
			this.fourierTransformService.delete(id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Fourier transform has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.fetchFourierTransforms()
				);
		}
	}

}
