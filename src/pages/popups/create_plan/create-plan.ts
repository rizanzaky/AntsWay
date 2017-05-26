import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';
import { PlanPage } from '../../plan/plan';

@Component({
  templateUrl: 'create-plan.html'
})
export class CreatePlanPopupPage {
    public planName: string;
    public planDescription: string;

    constructor(
        public viewCtrl: ViewController, 
        private dataService: DataProvider,
        public navCtrl: NavController
    ) {

    }

    createPlan() {
        // validate form

        let newPlan: Plan = {
            planId: 1, colour: 'tile-red', title: this.planName, name: this.planDescription
        }

        this.dataService.createNewPlan(newPlan).then(() => {
            this.navCtrl.push(PlanPage, {planId: newPlan.planId});
            this.dismiss();
        });
    }

    dismiss() {
        console.log("dismissing popup");
        this.viewCtrl.dismiss();
    }
}

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}