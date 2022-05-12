import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IMessage } from '../../interfaces/utils.interfaces';
import { IImageCorrelation, IImageCorrelationList } from '../../interfaces/image-correlation.interfaces';
import { ParserService } from '../utils/parser.service';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ImageCorrelationService {
    constructor(private http: HttpClient,
                private parserService: ParserService) {
    }

    fetch(): Observable<IImageCorrelationList[]> {
        return this.http.get<IImageCorrelationList[]>('/api/image_correlation/');
    }

    getById(id: number): Observable<IImageCorrelation> {
        return this.http.get<IImageCorrelation>(`/api/image_correlation/${id}/`);
    }

    create(formGroup: FormGroup, image_1_file: File, image_2_file: File): Observable<IImageCorrelation> {
        const formData = this.parserService.getValuesFromFormGroup(formGroup);
        formData.set('image_1', image_1_file, image_1_file.name);
        formData.set('image_2', image_2_file, image_2_file.name);
        return this.http.post<IImageCorrelation>('/api/image_correlation/', formData);
    }

    update(id: number, formGroup: FormGroup): Observable<IImageCorrelation> {
        const formData = this.parserService.getValuesFromFormGroup(formGroup);
        return this.http.put<IImageCorrelation>(`/api/image_correlation/${id}/`, formData);
    }

    delete(id: number): Observable<IMessage> {
        return this.http.delete<IMessage>(`/api/image_correlation/${id}/`);
    }
}
