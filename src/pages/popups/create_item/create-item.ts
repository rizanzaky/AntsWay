import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';

@Component({
  templateUrl: 'create-item.html'
})
export class CreateItemPopupPage {
    public itemName: string;
    private activeDays: number[] = [];

    constructor(
        private viewCtrl: ViewController, 
        private dataService: DataProvider,
        private navCtrl: NavController,
        private navParams: NavParams
    ) {

    }

    public isItemFound(dayNo: number): boolean {
        let value = this.activeDays.find(f => f == dayNo);
        alert("Yaayyy " + value)

        return value ? true : false;
    }

    public addRemoveDay(dayNo: number) {
        alert("Yaayyy")
        this.activeDays.push(dayNo);
        alert(JSON.stringify(this.activeDays))
    }

    public createNewItem() {
        // validate form

        let newItem: PlanItem = {
            planItemId: 1, planId: 1, name: this.itemName, status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()
        }

        this.dataService.createNewItem(newItem).then(() => {
            this.dismiss(newItem);
        });
    }

    dismiss(data: PlanItem) {
        console.log("dismissing popup");
        this.viewCtrl.dismiss(data);
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