import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public plans: Plans[];

  constructor(public navCtrl: NavController, private dataService: DataProvider) {
    this.getPlansFromLocal();
  }

  public getPlansFromLocal() {
    this.dataService.getPlans().then(resPlans => {
      this.plans = resPlans;
    });
  }
}

class Plans {
  public planId: number;
  public icon: string;
  public name: string;
}
