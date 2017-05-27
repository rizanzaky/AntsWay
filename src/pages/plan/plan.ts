import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { CreateItemPopupPage } from '../popups/create_item/create-item';

@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html',
})
export class PlanPage {
  private planItems: PlanItem[];
  public activePlanItems: PlanItem[];
  public inactiveItems: PlanItem[];

  public displayDate: Date = new Date();
  private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private dataService: DataProvider,
    public modalCtrl: ModalController
  ) {
    this.getPlanItemsFromLocal(navParams.data.planId).then(() => {
      this.filterPlanItems(this.displayDate.getDay());
    });
    console.log("constructor Plan is hit");
  }

  // readyPlanItems() {
  //   this.dataService.stagePlanItems(1);
  // }

  public createNewItem() {
    let modal = this.modalCtrl.create(CreateItemPopupPage);
      modal.present();
  }

  filterPlanItems(dayNo: number) {
    this.activePlanItems = [];
    this.inactiveItems = [];

    this.planItems.forEach(planItem => {
      if (planItem.status == PlanItemStatus.Active && (planItem.activeDays.length == 0 || planItem.activeDays.find(f => f == dayNo)))
        this.activePlanItems.push(planItem);
      else
        this.inactiveItems.push(planItem);
    });
  }

  getPlanItemsFromLocal(planId: number): Promise<void> {
    this.planItems = [];

    return new Promise<void>(resolve => {
      this.dataService.getPlanItems(planId).then(retPlanItems => {
        this.planItems = retPlanItems;
        resolve();
      });
    });
  }

  getLeftDay() {
    this.displayDate.setDate(this.displayDate.getDate() - 1);
    this.filterPlanItems(this.displayDate.getDay());
  }

  getRightDay() {
    this.displayDate.setDate(this.displayDate.getDate() + 1);
    this.filterPlanItems(this.displayDate.getDay());
  }

  showDate(): string {
    return (this.displayDate.getDate() < 10 ? "0" + this.displayDate.getDate() : this.displayDate.getDate()) + " / " + this.months[this.displayDate.getMonth()] + " / " + this.displayDate.getFullYear();
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