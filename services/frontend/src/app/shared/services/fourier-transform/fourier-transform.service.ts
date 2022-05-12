import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IMessage } from '../../interfaces/utils.interfaces';
import { IFourierTransform, IFourierTransformList } from '../../interfaces/fourier-transform.interfaces';
import { ParserService } from '../utils/parser.service';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class FourierTransformService {
    constructor(private http: HttpClient,
                private parserService: ParserService) {
    }

    fetch(): Observable<IFourierTransformList[]> {
        return this.http.get<IFourierTransformList[]>('/api/fourier_transform/');
    }

    getById(id: number): Observable<IFourierTransform> {
        return this.http.get<IFourierTransform>(`/api/fourier_transform/${id}/`);
    }

    create(formGroup: FormGroup): Observable<IFourierTransform> {
        const formData = this.parserService.getValuesFromFormGroup(formGroup);
        return this.http.post<IFourierTransform>('/api/fourier_transform/', formData);
    }

    update(id: number, formGroup: FormGroup): Observable<IFourierTransform> {
        const formData = this.parserService.getValuesFromFormGroup(formGroup);
        return this.http.put<IFourierTransform>(`/api/fourier_transform/${id}/`, formData);
    }

    delete(id: number): Observable<IMessage> {
        return this.http.delete<IMessage>(`/api/fourier_transform/${id}/`);
    }
}
