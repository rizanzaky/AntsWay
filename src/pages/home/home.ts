import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { PlanPage } from '../plan/plan';
import { CreatePlanPopupPage } from '../popups/create_plan/create-plan';
import { Plan } from '../../models/plan';
import { StoredData } from "../../providers/data/storedData";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public columnedPlans: Plan[][];
  public noOfColumns: number = 4; // get dynamically
  public isDeleteMode: boolean = false;

  constructor(
    public navCtrl: NavController, 
    private _dataService: DataProvider,
    private _dataService2: StoredData,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.getPlansFromLocal();
  }

  public getPlansFromLocal() {
    // this._dataService.getPlans(this.noOfColumns).then(resPlans => {
    //   this.columnedPlans = resPlans;
    // });

    this._dataService2.indexPlans(this.noOfColumns).then(resPlans => {
      this.columnedPlans = resPlans;
    });
  }

  private async getPlanDetails(planId: number): Promise<Plan> {
    return this._dataService.getPlanDetails(planId);
  }

  public goToPlan(planId: number) {
    if (this.isDeleteMode)
      return;

    if (planId != -1) {
      this.getPlanDetails(planId).then(plan => {
        this.navCtrl.push(PlanPage, {plan: plan});
      });
    } else
      this.createNewPlan();
  }

  public enterDeleteMode() {
    this.isDeleteMode = true;
  }

  public leaveDeleteMode() {
    this.isDeleteMode = false;
  }

  public confirmForDelete(planId: number) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Are you sure to remove this Plan?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deletePlan(planId);
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

  private deletePlan(planId: number) {
    this._dataService.deletePlan(planId);

    this.getPlansFromLocal();
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