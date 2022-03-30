import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { HarmonicSignalService } from '../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignalList } from '../shared/interfaces/harmonic-signal.interfaces';
import { MaterializeService } from '../shared/services/utils/materialize.service';

@Component({
    selector: 'app-harmonic-signal-page',
    templateUrl: './harmonic-signal-page.component.html',
    styleUrls: ['./harmonic-signal-page.component.css']
})
export class HarmonicSignalPageComponent implements OnInit {

    harmonicSignals$: Observable<IHarmonicSignalList[]>;

    constructor(private harmonicSignalService: HarmonicSignalService) {
    }

    ngOnInit(): void {
        this.harmonicSignals$ = this.harmonicSignalService.fetch();
        this.harmonicSignals$.subscribe(
            (harmonicSignals: IHarmonicSignalList[]) => {
            },
            error => {
                MaterializeService.toast(error.error);
            }
        );
    }
}
