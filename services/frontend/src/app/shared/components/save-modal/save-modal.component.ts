import { Component, OnInit, AfterViewInit, ViewChild, ElementRef,  } from '@angular/core';

import { MaterializeService } from '../../services/utils/materialize.service';

@Component({
    selector: 'app-save-modal',
    templateUrl: './save-modal.component.html',
    styleUrls: ['./save-modal.component.css']
})
export class SaveModalComponent implements OnInit, AfterViewInit {
    @ViewChild('modal') modalRef: ElementRef;
    private modalElement;
    public link: string;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.modalElement = MaterializeService.initializeModal(this.modalRef);
    }

    public open(link: string) {
        this.link = link;
        this.modalElement.open();
    }
}
