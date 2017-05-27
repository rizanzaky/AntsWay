import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';

@Component({
  templateUrl: 'create-item.html'
})
export class CreateItemPopupPage {
    public itemName: string;

    constructor(private viewCtrl: ViewController, private dataService: DataProvider) {

    }

    public createNewItem() {
        let newItem: PlanItem = {
            planItemId: 1, planId: 1, name: this.itemName, status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()
        }

        this.dataService.createNewItem(newItem).then(() => {
            this.dismiss();
        });
    }

    dismiss() {
        console.log("dismissing popup");
        this.viewCtrl.dismiss();
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