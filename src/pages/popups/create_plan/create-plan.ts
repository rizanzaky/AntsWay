import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';

@Component({
  templateUrl: 'create-plan.html'
})
export class CreatePlanPopupPage {
    // public planName: string;
    // public planDescription: string;
    public planId: number;
    private plan: Plan;
    public isCreate: boolean;

    constructor(
        public viewCtrl: ViewController, 
        public navParams: NavParams, 
        private _dataService: DataProvider,
        public navCtrl: NavController
    ) {
        this.isCreate = navParams.data.isCreate;

        if (this.isCreate) {
            this.getNewPlanId(); // check for async
            this.plan = new Plan();
        }
        else {
            this.planId = navParams.data.plan.planId;
            this.plan = navParams.data.plan;
            // this.planName = this.plan.title;
            // this.planDescription = this.plan.name;
        }
    }

    getNewPlanId() {
        this._dataService.getNewPlanId().then(planId => {
            this.planId = planId;
        });
    }

    createPlan() {
        // validate form

        let newPlan: Plan = {
            planId: this.planId, colour: 'tile-red', title: this.plan.title, name: this.plan.name
        }

        this._dataService.createNewPlan(newPlan).then(() => {
            this.dismiss(newPlan);
        });
    }

    editPlan() {
        // // validate form
        
        this._dataService.updatePlan(this.plan).then(() => {
            this.dismiss(this.plan);
        });
    }

    dismiss(newPlan: Plan) {
        this.viewCtrl.dismiss(newPlan);
    }
}

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}