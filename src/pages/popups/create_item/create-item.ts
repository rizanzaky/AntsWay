import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';
import { PlanItem } from '../../../models/planItem';
import { PlanItemStatus } from '../../../common/enums/planItemStatus';

@Component({
  templateUrl: 'create-item.html'
})
export class CreateItemPopupPage {
    // public itemName: string;
    // private activeDays: number[] = [];
    public planItemId: number;
    public isCreate: boolean;
    public planItem: PlanItem;
    public daysSelected: boolean[] = [false,false,false,false,false,false,false];

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
            this.planItem.activeDays.forEach(day => {
                this.daysSelected[day] = true;
            });
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

    public addRemoveDay(dayNo: number) {
        let value = this.planItem.activeDays.find(f => f == dayNo);

        if (value >= 0) {
            let index = this.planItem.activeDays.indexOf(dayNo);
            this.planItem.activeDays.splice(index, 1);
            this.daysSelected[dayNo] = false;
        } else {
            if (this.planItem.activeDays.length == 6) {
                this.planItem.activeDays = [];
                this.daysSelected = [false,false,false,false,false,false,false];
                return;
            }

            this.planItem.activeDays.push(dayNo);
            this.daysSelected[dayNo] = true;
        }
    }

    public toggleItemStatus() {
        this.planItem.status = (this.planItem.status == PlanItemStatus.Active) ? PlanItemStatus.Inactive : PlanItemStatus.Active;
    }

    dismiss(newPlanItem: PlanItem) {
        this.viewCtrl.dismiss(newPlanItem);
    }
}