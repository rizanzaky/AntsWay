import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';

@Component({
  templateUrl: 'create-item.html'
})
export class CreateItemPopupPage {
    public itemName: string;
    private activeDays: number[] = [];
    private planId: number;
    public planItemId: number;

    constructor(
        private _dataService: DataProvider,
        private viewCtrl: ViewController, 
        private dataService: DataProvider,
        private navCtrl: NavController,
        private navParams: NavParams
    ) {
        this.planId = navParams.data.planId;
        this.getNewItemId();
    }

    getNewItemId() {
        this._dataService.getNewItemId().then(planItemId => {
            this.planItemId = planItemId;
            console.log("New plan item id: ", planItemId);
        });
    }

    public addRemoveDay(dayNo: number): boolean {
        let value = this.activeDays.find(f => f == dayNo);

        if (!value) {
            this.activeDays.push(dayNo);
            return false;
        } else {
            let index = this.activeDays.indexOf(dayNo);
            this.activeDays.splice(index, 1);
            return true;
        }
    }

    public createNewItem() {
        // validate form

        let newItem: PlanItem = {
            planItemId: this.planItemId, planId: this.planId, name: this.itemName, status: PlanItemStatus.Active, activeDays: this.activeDays, createdOn: new Date()
        }

        this.dataService.createNewItem(newItem).then(() => {
            this.dismiss(newItem);
        });
    }

    dismiss(newPlanItem: PlanItem) {
        this.viewCtrl.dismiss(newPlanItem);
    }
}

class PlanItem {
  public planItemId: number;
  public planId: number;
  public name: string;
  public status: PlanItemStatus;
  public activeDays: number[];
  public createdOn: Date;
}

enum PlanItemStatus {
  Active = 1,
  Inactive = 2
}