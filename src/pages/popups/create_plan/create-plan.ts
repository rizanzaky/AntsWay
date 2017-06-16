import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';
import { Plan } from '../../../models/plan';
import { StoredData } from "../../../providers/data/storedData";

@Component({
  templateUrl: 'create-plan.html'
})
export class CreatePlanPopupPage {
    public planId: number;
    private plan: Plan;
    public isCreate: boolean;

    constructor(
        public viewCtrl: ViewController, 
        public navParams: NavParams, 
        private _dataService: DataProvider,
        private _dataServiceSQL: StoredData,
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
        }
    }

    getNewPlanId() {
        this._dataService.getNewPlanId().then(planId => {
            this.planId = planId;
        });
    }

    createPlan() {
        // validate form

        this.plan.planId = this.planId;
        this.plan.colour = 'title-red';

        this._dataService.createNewPlan(this.plan).then(() => {
            alert("Done")
            this._dataServiceSQL.createPlan(this.plan).then(() => {
                this.dismiss(this.plan);
            }).catch(err => {
                alert("Err2: " + JSON.stringify(err));
            });
        }).catch(err => {
            alert("Err: " + JSON.stringify(err));
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