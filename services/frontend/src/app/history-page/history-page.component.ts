import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { HarmonicSignalService } from '../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignalList } from '../shared/interfaces/harmonic-signal.interfaces';

import { FourierTransformService } from '../shared/services/fourier-transform/fourier-transform.service';
import { IFourierTransformList } from '../shared/interfaces/fourier-transform.interfaces';

import { SimpleCorrelationService } from '../shared/services/simple-correlation/simple-correlation.service';
import { ISimpleCorrelationList } from '../shared/interfaces/simple-correlation.interfaces';

import { ImageCorrelationService } from '../shared/services/image-correlation/image-correlation.service';
import { IImageCorrelationList } from '../shared/interfaces/image-correlation.interfaces';

import { MaterializeService } from '../shared/services/utils/materialize.service';


@Component({
    selector: 'app-history-page',
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
    harmonicSignals$: Observable<IHarmonicSignalList[]>;
    fourierTransforms$: Observable<IFourierTransformList[]>;
    simpleCorrelations$: Observable<ISimpleCorrelationList[]>;
    imageCorrelations$: Observable<IImageCorrelationList[]>;

    constructor(private harmonicSignalService: HarmonicSignalService,
                private fourierTransformService: FourierTransformService,
                private simpleCorrelationService: SimpleCorrelationService,
                private imageCorrelationService: ImageCorrelationService) {
    }

    ngOnInit(): void {
        this.fetchHarmonicSignals();
        this.fetchFourierTransforms();
        this.fetchSimpleCorrelations();
        this.fetchImageCorrelations();
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

    private fetchSimpleCorrelations() {
        this.simpleCorrelations$ = this.simpleCorrelationService.fetch();
        this.simpleCorrelations$.subscribe(
            (simpleCorrelations: ISimpleCorrelationList[]) => {
			},
			error => {
				MaterializeService.toast(error.error);
			}
        )
    }

    private fetchImageCorrelations() {
        this.imageCorrelations$ = this.imageCorrelationService.fetch();
        this.imageCorrelations$.subscribe(
            (imageCorrelations: IImageCorrelationList[]) => {
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

    public deleteSimpleCorrelation(id: number) {
		const decision = window.confirm('Are you sure you want to delete this simple correlation?');
		if (decision) {
			this.simpleCorrelationService.delete(id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Simple correlation has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.fetchSimpleCorrelations()
				);
		}
	}

    public deleteImageCorrelation(id: number) {
		const decision = window.confirm('Are you sure you want to delete this image correlation?');
		if (decision) {
			this.imageCorrelationService.delete(id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Image correlation has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.fetchImageCorrelations()
				);
		}
	}

}
