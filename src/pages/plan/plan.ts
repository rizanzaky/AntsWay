import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html',
})
export class PlanPage {
  public planItems: PlanItem[] = [];
  public inactiveItems: PlanItem[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataProvider) {
    this.getPlanItemsFromLocal();
  }

  getPlanItemsFromLocal() {
    this.dataService.getPlanItems(1).then(retPlanItems => {
      retPlanItems.forEach(element => {
        if (element.planId === 3)
          this.planItems.push(element);
        else
          this.inactiveItems.push(element);
      });
    });
  }

}

class PlanItem {

}
