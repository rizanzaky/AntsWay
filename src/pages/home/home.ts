import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { PlanPage } from '../plan/plan';
import { CreatePlanPopupPage } from '../popups/create_plan/create-plan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public columnedPlans: Plan[][];
  public noOfColumns: number = 4; // get dynamically
  private plan: Plan;

  constructor(
    public navCtrl: NavController, 
    private _dataService: DataProvider,
    public modalCtrl: ModalController
  ) {
    this.getPlansFromLocal();
  }

  public getPlansFromLocal() {
    this._dataService.getPlans(this.noOfColumns).then(resPlans => {
      this.columnedPlans = resPlans;
    });
  }

  private async getPlanDetails(planId: number): Promise<Plan> {
    return this._dataService.getPlanDetails(planId);
  }

  public goToPlan(planId: number) {
    if (planId != -1) {
      this.getPlanDetails(planId).then(plan => {
        this.navCtrl.push(PlanPage, {plan: plan});
      });
    } else
      this.createNewPlan();
  }

  private createNewPlan() {
      let modal = this.modalCtrl.create(CreatePlanPopupPage, {isCreate: true});

      modal.onDidDismiss(newPlan => {
        if (newPlan) {
          this.navCtrl.push(PlanPage, {plan: newPlan});
          this.getPlansFromLocal();
        }
      });

      modal.present();
  }
}

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}
