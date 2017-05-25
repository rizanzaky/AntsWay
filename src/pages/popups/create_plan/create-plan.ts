import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'create-plan.html'
})
export class CreatePlanPopupPage {
    constructor(public viewCtrl: ViewController) {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}