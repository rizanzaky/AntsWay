import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";

@Component({
  template: `
    <button ion-button outline (click)="selection(1)"><ion-icon name="ios-trash-outline"></ion-icon></button>
    <button ion-button outline (click)="selection(2)"><ion-icon name="ios-create-outline"></ion-icon></button>
  `
})
export class ItemLongActionPage {
  constructor(public viewCtrl: ViewController) {}

  selection(selection: number) {
    this.viewCtrl.dismiss(selection);
  }
}