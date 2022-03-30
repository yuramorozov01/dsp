import { ElementRef } from '@angular/core';

declare var M;

export class MaterializeService {
    static toast(msg: any) {
        Object.keys(msg).forEach((key) => {
            M.toast({html: key + ': ' + msg[key]});
        });
    }

    static initializeParallax(ref: ElementRef) {
        M.Parallax.init(ref.nativeElement);
    }

    static updateTextInputs() {
        M.updateTextFields();
    }
}
