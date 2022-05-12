import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IMessage } from '../../interfaces/utils.interfaces';
import { ISimpleCorrelation, ISimpleCorrelationList } from '../../interfaces/simple-correlation.interfaces';
import { ParserService } from '../utils/parser.service';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class SimpleCorrelationService {
    constructor(private http: HttpClient,
                private parserService: ParserService) {
    }

    fetch(): Observable<ISimpleCorrelationList[]> {
        return this.http.get<ISimpleCorrelationList[]>('/api/simple_correlation/');
    }

    getById(id: number): Observable<ISimpleCorrelation> {
        return this.http.get<ISimpleCorrelation>(`/api/simple_correlation/${id}/`);
    }

    create(formGroup: FormGroup): Observable<ISimpleCorrelation> {
        const formData = this.parserService.getValuesFromFormGroup(formGroup);
        return this.http.post<ISimpleCorrelation>('/api/simple_correlation/', formData);
    }

    update(id: number, formGroup: FormGroup): Observable<ISimpleCorrelation> {
        const formData = this.parserService.getValuesFromFormGroup(formGroup);
        return this.http.put<ISimpleCorrelation>(`/api/simple_correlation/${id}/`, formData);
    }

    delete(id: number): Observable<IMessage> {
        return this.http.delete<IMessage>(`/api/simple_correlation/${id}/`);
    }
}
