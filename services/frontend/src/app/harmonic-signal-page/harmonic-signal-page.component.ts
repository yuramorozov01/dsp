import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Observable } from 'rxjs';

import { HarmonicSignalService } from '../shared/services/harmonic-signal/harmonic-signal.service';
import { IHarmonicSignal } from '../shared/interfaces/harmonic-signal.interfaces';
import { MaterializeService } from '../shared/services/utils/materialize.service';

@Component({
    selector: 'app-harmonic-signal-page',
    templateUrl: './harmonic-signal-page.component.html',
    styleUrls: ['./harmonic-signal-page.component.css']
})
export class HarmonicSignalPageComponent implements OnInit {

    form: FormGroup;
    isNew: boolean = true;
	harmonicSignal: IHarmonicSignal;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private harmonicSignalService: HarmonicSignalService) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            amplitude: new FormControl(null, [Validators.required, Validators.min(0)]),
            frequency: new FormControl(null, [Validators.required, Validators.min(0)]),
            initial_phase: new FormControl(null, [Validators.required]),
		});

		this.form.disable();

		this.route.params
			.pipe(
				switchMap(
					(params: Params) => {
						if (params['id']) {
							this.isNew = false;
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
						this.form.patchValue(harmonicSignal);
						MaterializeService.updateTextInputs();
					}
					this.form.enable();
				},
				error => MaterializeService.toast(error.error),
			);
    }

    onSubmit() {
        let obs$;
		this.form.disable();

		if (this.isNew) {
			obs$ = this.harmonicSignalService.create(this.form);
		} else {
			obs$ = this.harmonicSignalService.update(this.harmonicSignal.id, this.form);
		}
		obs$.subscribe(
			(harmonicSignal: IHarmonicSignal) => {
				this.harmonicSignal = harmonicSignal;
                this.form.patchValue(harmonicSignal);
				MaterializeService.updateTextInputs();
				this.form.enable();
			},
			error => {
				MaterializeService.toast(error.error);
				this.form.enable();
			}
		);
    }

    deleteHarmonicSignal() {
		// const decision = window.confirm('Are you sure you want to delete this harmonic signal?');
		// if (decision) {
		// 	this.depositTypeService.delete(this.depositType.id)
		// 		.subscribe(
		// 			response => MaterializeService.toast({'Success': 'Deposit type has been deleted successfully'}),
		// 			error => MaterializeService.toast(error.error),
		// 			() => this.router.navigate(['/deposit_type'])
		// 		);
		// }
	}
}
