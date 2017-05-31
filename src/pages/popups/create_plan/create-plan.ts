import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';
import { PlanPage } from '../../plan/plan';

@Component({
  templateUrl: 'create-plan.html'
})
export class CreatePlanPopupPage {
    public planName: string;
    public planDescription: string;
    public planId: number;

    constructor(
        public viewCtrl: ViewController, 
        public navParams: NavParams, 
        private _dataService: DataProvider,
        public navCtrl: NavController
    ) {
        this.getNewPlanId();
    }

    getNewPlanId() {
        this._dataService.getNewPlanId().then(planId => {
            this.planId = planId;
        });
    }

    createPlan() {
        // validate form

        let newPlan: Plan = {
            planId: this.planId, colour: 'tile-red', title: this.planName, name: this.planDescription
        }

        this._dataService.createNewPlan(newPlan).then(() => {
            this.dismiss(newPlan.planId);
        });
    }

    dismiss(newPlanId: number) {
        this.viewCtrl.dismiss(newPlanId);
    }
}

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}