import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { ImageCorrelationService } from '../shared/services/image-correlation/image-correlation.service';
import { IImageCorrelation } from '../shared/interfaces/image-correlation.interfaces';

import { MaterializeService } from '../shared/services/utils/materialize.service';
import { AuthService } from '../shared/services/auth/auth.service';

import { SaveModalComponent } from '../shared/components/save-modal/save-modal.component';

import { DOCUMENT } from '@angular/common';


@Component({
    selector: 'app-image-correlation-page',
    templateUrl: './image-correlation-page.component.html',
    styleUrls: ['./image-correlation-page.component.css'],
})
export class ImageCorrelationPageComponent implements OnInit {
    @ViewChild('saveModal') saveModal: SaveModalComponent;
    @ViewChild('inputImage1') inputImage1Ref: ElementRef;
    @ViewChild('inputImage2') inputImage2Ref: ElementRef;

    form: FormGroup;
    image1File: File;
    image2File: File;

    image1Src: string;
    image2Src: string;

    public imageCorrelation: IImageCorrelation;

    constructor(private auth: AuthService,
                private router: Router,
                private imageCorrelationService: ImageCorrelationService,
                @Inject(DOCUMENT) private document: Document) {
    }

    public ngOnInit(): void {
        this.form = new FormGroup({
            image_1: new FormControl('', [Validators.required]),
            image_2: new FormControl('', [Validators.required]),
        });
    }

    public onSubmit() {
        this.saveImageCorrelation();
    }

    public triggerImage1Click() {
        this.inputImage1Ref.nativeElement.click();
    }

    public triggerImage2Click() {
        this.inputImage2Ref.nativeElement.click();
    }

    public onImage1Upload(event: any) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            [this.image1File] = event.target.files;
            reader.readAsDataURL(this.image1File);
            reader.onload = () => {
                this.image1Src = reader.result as string;

            };
        }
    }

    public onImage2Upload(event: any) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            [this.image2File] = event.target.files;
            reader.readAsDataURL(this.image2File);
            reader.onload = () => {
                this.image2Src = reader.result as string;

            };
        }
    }

    public saveImageCorrelation() {
        if (this.auth.isAuthenticated()) {
            this.imageCorrelationService.create(this.form, this.image1File, this.image2File)
                .subscribe(
                    (imageCorrelation: IImageCorrelation) => {
                        this.saveModal.open(`${this.document.location}/${imageCorrelation.id}/`);
                    },
                    error => {
                        MaterializeService.toast(error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

}
