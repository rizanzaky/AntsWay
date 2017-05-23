import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html',
})
export class PlanPage {
  public planItems: PlanItem[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanPage');
  }

}

class PlanItem {
  
}
