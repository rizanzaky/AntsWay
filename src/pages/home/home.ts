import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public columnedPlans: Plans[][];

  constructor(public navCtrl: NavController, private dataService: DataProvider) {
    this.getPlansFromLocal();
  }

  public getPlansFromLocal() {
    this.dataService.getPlans(4).then(resPlans => {
      this.columnedPlans = resPlans;
    });
  }
}

class Plans {
  public planId: number;
  public icon: string;
  public name: string;
}
