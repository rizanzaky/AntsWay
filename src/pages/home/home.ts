import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { PlanPage } from '../plan/plan';
import { CreatePlanPopupPage } from '../popups/create_plan/create-plan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public columnedPlans: Plan[][];
  public noOfColumns: number = 4;

  constructor(
    public navCtrl: NavController, 
    private dataService: DataProvider,
    public modalCtrl: ModalController
  ) {
    console.log("hit home constructor");
  }

  ngOnInit(): void {
    console.log("home ngOnInit");
  }

  ionViewWillEnter() {
    this.getPlansFromLocal();
    console.log("home view entered");
  }

  public getPlansFromLocal() {
    this.dataService.getPlans(this.noOfColumns).then(resPlans => {
      this.columnedPlans = resPlans;
    });
  }

  public goToPlan(planId: number) {
    if (planId != -1)
      this.navCtrl.push(PlanPage, {planId: planId});
    else
      this.createNewPlan();
  }

  private createNewPlan() {
      let modal = this.modalCtrl.create(CreatePlanPopupPage);
      modal.present();
  }
}

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}
