import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { PlanPage } from '../plan/plan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public columnedPlans: Plan[][];
  public noOfColumns: number = 4;

  constructor(public navCtrl: NavController, private dataService: DataProvider) {
    this.getPlansFromLocal();
  }

  public getPlansFromLocal() {
    this.dataService.getPlans(this.noOfColumns).then(resPlans => {
      this.columnedPlans = resPlans;
    });
  }

  public goToPlan() {
    this.navCtrl.push(PlanPage);
  }
}

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}
