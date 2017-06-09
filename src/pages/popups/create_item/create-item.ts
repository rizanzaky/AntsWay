import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';

@Component({
  templateUrl: 'create-item.html'
})
export class CreateItemPopupPage {
    // public itemName: string;
    // private activeDays: number[] = [];
    public planItemId: number;
    public isCreate: boolean;
    public planItem: PlanItem;

    constructor(
        private _dataService: DataProvider,
        private viewCtrl: ViewController, 
        private dataService: DataProvider,
        private navCtrl: NavController,
        private navParams: NavParams
    ) {
        // this.planId = navParams.data.planId;
        // this.getNewItemId();

        this.isCreate = navParams.data.isCreate;

        if (this.isCreate) {
            this.getNewItemId(); // check for async

            this.planItem = new PlanItem();
            this.planItem.planId = navParams.data.planId;
            this.planItem.activeDays = [];
            this.planItem.status = PlanItemStatus.Active;
        }
        else {
            this.planItemId = navParams.data.planItem.planItemId;
            this.planItem = navParams.data.planItem;
            console.log("Got Edit: ", this.planItem);
        }
    }

    getNewItemId() {
        this._dataService.getNewItemId().then(planItemId => {
            this.planItemId = planItemId;
            console.log("New plan item id: ", planItemId);
        });
    }

    public editPlanItem() {
        // validate form
        console.log("Post Edit: ", this.planItem);
        
        this._dataService.updatePlanItem(this.planItem).then(() => {
            this.dismiss(this.planItem);
        });
    }

    public createNewItem() {
        // validate form

        this.planItem.planItemId = this.planItemId;

        this.dataService.createNewItem(this.planItem).then(() => {
            this.dismiss(this.planItem);
        });
    }

    public addRemoveDay(dayNo: number): boolean {
        let value = this.planItem.activeDays.find(f => f == dayNo);

        if (!value) {
            this.planItem.activeDays.push(dayNo);
            return false;
        } else {
            let index = this.planItem.activeDays.indexOf(dayNo);
            this.planItem.activeDays.splice(index, 1);
            return true;
        }
    }

    public toggleItemStatus() {
        this.planItem.status = (this.planItem.status == PlanItemStatus.Active) ? PlanItemStatus.Inactive : PlanItemStatus.Active;
    }

    dismiss(newPlanItem: PlanItem) {
        this.viewCtrl.dismiss(newPlanItem);
    }
}

class PlanItem {
  public planItemId: number;
  public planId: number;
  public name: string;
  public isDone: boolean;
  public status: PlanItemStatus;
  public activeDays: number[];
  public createdOn: Date;
}

enum PlanItemStatus {
  Active = 1,
  Inactive = 2
}