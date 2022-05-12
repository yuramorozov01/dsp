import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { environment } from '../../environments/environment';
import { MaterializeService } from '../shared/services/utils/materialize.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, AfterViewInit {
    @ViewChild('parallaxNavbar') parallaxNavbarRef: ElementRef;
    @ViewChild('parallaxFooter') parallaxFooterRef: ElementRef;

    public title: string = environment.titleFull;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        MaterializeService.initializeParallax(this.parallaxNavbarRef);
        MaterializeService.initializeParallax(this.parallaxFooterRef);
    }
}
