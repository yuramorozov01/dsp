import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IHarmonicSignal, IHarmonicSignalList } from '../../interfaces/harmonic-signal.interfaces';
import { ParserService } from '../utils/parser.service';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class HarmonicSignalService {
    constructor(private http: HttpClient,
                private parserService: ParserService) {
    }

    fetch(): Observable<IHarmonicSignalList[]> {
        return this.http.get<IHarmonicSignalList[]>('/api/harmonic_signal/');
    }

    getById(id: number): Observable<IHarmonicSignal> {
        return this.http.get<IHarmonicSignal>(`/api/v1/harmonic_signal/${id}/`);
    }

    create(formGroup: FormGroup): Observable<IHarmonicSignal> {
        const formData = this.parserService.getValuesFromFormGroup(formGroup);
        return this.http.post<IHarmonicSignal>('/api/v1/harmonic_signal/', formData);
    }
}
