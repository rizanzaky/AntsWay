import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';

@Component({
  templateUrl: 'create-plan.html'
})
export class CreatePlanPopupPage {
    public planName: string;
    public planDescription: string;

    constructor(public viewCtrl: ViewController) {

    }

    createPlan() {
        // validate form

        let newPlan: Plan = {
            planId: 1, colour: 'tile-red', title: this.planName, name: this.planDescription
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}