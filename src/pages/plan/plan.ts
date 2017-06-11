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
  public itemSelections: ItemSelection[];
  private planId: number;
  private plan: Plan;
  // private isFilterPlanLocked: boolean;
  public completion: number;

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

    // this.isFilterPlanLocked = true;
    // this.getItemSelection(this.planId).then(() => {
    //   console.log("item returned")
    //   this.isFilterPlanLocked = false;
    // });

    this.getPlanItemsFromLocal(this.planId).then(() => { // make parallal
      this.getItemSelection(this.planId).then(() => {
        this.filterPlanItems(this.displayDate);
      });
    });

    // this.getPlanItemsFromLocal(this.planId).then(() => {
    //   while (this.isFilterPlanLocked) {
    //     this.filterPlanItems(this.displayDate);
    //     setTimeout(() => {
    //       console.log("while timer is hit");
    //     }, 500);
    //     console.log("while is hit");
    //   }
    // });
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
      switch (selection) {
        case 1:
          this.confirmForDelete(planItemId, isActive);
          break;
        case 2:
          this.editPlanItem(planItemId);
          break;
        default:
          break;
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
      this.filterPlanItems(this.displayDate);
    });

    modal.present();
  }

  public createNewItem() {
      let modal = this.modalCtrl.create(CreateItemPopupPage, {planId: this.planId, isCreate: true});

      modal.onDidDismiss(newPlanItem => {
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

  filterPlanItems(displayDate: Date) {
    let dayNo = displayDate.getDay();
    this.activePlanItems = [];
    this.inactivePlanItems = [];
    let todaySelections = this.itemSelections.filter(f => f.date.setHours(0,0,0,0) == displayDate.setHours(0,0,0,0)); // check is async

    this.planItems.forEach(planItem => {
      if (planItem.status == PlanItemStatus.Active && (planItem.activeDays.length == 0 || planItem.activeDays.find(f => f == dayNo) >= 0)) {
        let selection = todaySelections.find(f => f.planItemId == planItem.planItemId); // check is async
        if (selection)
          planItem.isDone = selection.isDone;
        else
          planItem.isDone = false;

        this.activePlanItems.push(planItem);
      } else
        this.inactivePlanItems.push(planItem);
    });

    this.calculatePercentage();
  }

  private calculatePercentage() {
    if (this.activePlanItems.length > 0) {
      let doneItems = this.activePlanItems.filter(f => f.isDone);
      this.completion = Math.round((doneItems ? doneItems.length : 0) / this.activePlanItems.length * 100);
    } else {
      this.completion = -1;
    }
  }

  public saveSelectionStatus(planItemId: number, userSelection: boolean) {
    let currentSelection = this.itemSelections.find(f => f.planItemId == planItemId && f.date.setHours(0,0,0,0) == this.displayDate.setHours(0,0,0,0)); // check is async
    
    if (currentSelection) { // check
      currentSelection.isDone = userSelection;
    }
    if (!currentSelection && userSelection) {
      let selection = {planId: this.planId, planItemId: planItemId, date: new Date(this.displayDate), isDone: userSelection};

      this._dataService.saveSelection(selection).then(() => {
        this.itemSelections.push(selection);
      });
    }
    this.calculatePercentage();
  }

  async getItemSelection(planId: number): Promise<void> {
    this.itemSelections = [];

    await this._dataService.getItemSelection(planId).then(retItemSelections => {
      this.itemSelections = retItemSelections;
      return;
    });

    // return new Promise<void>(resolve => {
    //   this._dataService.getItemSelection(planId).then(retItemSelections => {
    //     this.itemSelections = retItemSelections;
    //     resolve();
    //   });
    // });
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
    this.filterPlanItems(this.displayDate);
  }

  getRightDay() {
    this.displayDate.setDate(this.displayDate.getDate() + 1);
    this.filterPlanItems(this.displayDate);
  }

  showDate(): string {
    return (this.displayDate.getDate() < 10 ? "0" + this.displayDate.getDate() : this.displayDate.getDate()) + " / " + this.months[this.displayDate.getMonth()] + " / " + this.displayDate.getFullYear();
  }

}

class ItemSelection {
  public planId: number;
  public planItemId: number;
  public date: Date;
  public isDone: boolean;
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
  public isDone: boolean;
  public status: PlanItemStatus;
  public activeDays: number[];
  public createdOn: Date;
}

enum PlanItemStatus {
  Active = 1,
  Inactive = 2
}