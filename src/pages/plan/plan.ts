import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { CreateItemPopupPage } from '../popups/create_item/create-item';
import { CreatePlanPopupPage } from "../popups/create_plan/create-plan";
import { ItemLongActionPage } from "../popups/item_long_action/item-long-action";

@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html',
})
export class PlanPage {
  private planItems: PlanItem[];
  public activePlanItems: PlanItem[];
  public inactivePlanItems: PlanItem[];
  private planId: number;
  private plan: Plan;

  public displayDate: Date = new Date();
  private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private _dataService: DataProvider,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.planId = navParams.data.plan.planId;
    this.plan = navParams.data.plan;

    this.getPlanItemsFromLocal(this.planId).then(() => {
      this.filterPlanItems(this.displayDate.getDay());
    });
  }

  // private async getPlanItemDetails(planId: number, planItemId: number): Promise<PlanItem> {
  //   return this._dataService.getPlanItemDetails(planId, planItemId);
  // }

  editThisPlan() {
    let modal = this.modalCtrl.create(CreatePlanPopupPage, {plan: this.plan});

    modal.present();
  }

  longPressAction(longPress, planItemId, isActive) {
    let popover = this.popoverCtrl.create(ItemLongActionPage);

    popover.onDidDismiss(selection => {
      if (selection == 1) { // delete
        this.confirmForDelete(planItemId, isActive);
      } else { // edit
        this.editPlanItem(planItemId);
      }
    });

    popover.present({ ev: longPress });
  }

  private confirmForDelete(planItemId: number, isActive: boolean) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Are you sure to remove this item?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteItem(planItemId, isActive);
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  public deleteItem(planItemId: number, isActive: boolean) {
      this._dataService.deletePlanItem(this.planId, planItemId); // error handle

      let planItemsIndex = this.planItems.findIndex(f => f.planItemId == planItemId);
      this.planItems.splice(planItemsIndex, 1);

      if (isActive) {
        let activeItemIndex = this.activePlanItems.findIndex(f => f.planItemId == planItemId);
        this.activePlanItems.splice(activeItemIndex, 1);
      } else {
        let inactiveItemIndex = this.inactivePlanItems.findIndex(f => f.planItemId == planItemId);
        this.inactivePlanItems.splice(inactiveItemIndex, 1);
      }
  }

  public editPlanItem(planItemId: number) {
    let planItem = this.planItems.find(f => f.planItemId == planItemId);

    let modal = this.modalCtrl.create(CreateItemPopupPage, {planItem: planItem});

    modal.onDidDismiss(planItem => {
      this.filterPlanItems(this.displayDate.getDay());
    });

    modal.present();
  }

  public createNewItem() {
      let modal = this.modalCtrl.create(CreateItemPopupPage, {planId: this.planId, isCreate: true});

      modal.onDidDismiss(newPlanItem => {
        console.log("New PlanItem: ", newPlanItem)
        if (newPlanItem) {
          this.planItems.push(newPlanItem);

          let dayNo = this.displayDate.getDay();
          if (newPlanItem.status == PlanItemStatus.Active && (newPlanItem.activeDays.length == 0 || newPlanItem.activeDays.find(f => f == dayNo)))
            this.activePlanItems.push(newPlanItem);
          else
            this.inactivePlanItems.push(newPlanItem);
        }
          
      });

      modal.present();
  }

  filterPlanItems(dayNo: number) {
    console.log("dayNo: ", dayNo)
    this.activePlanItems = [];
    this.inactivePlanItems = [];

    this.planItems.forEach(planItem => {
      console.log("planItemActD: ", planItem.activeDays)
      if (planItem.status == PlanItemStatus.Active && (planItem.activeDays.length == 0 || planItem.activeDays.find(f => f == dayNo)))
        this.activePlanItems.push(planItem);
      else
        this.inactivePlanItems.push(planItem);
    });
  }

  getPlanItemsFromLocal(planId: number): Promise<void> {
    this.planItems = [];

    return new Promise<void>(resolve => {
      this._dataService.getPlanItems(planId).then(retPlanItems => {
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

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
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