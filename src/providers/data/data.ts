import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {
  // private plans: Plans[][] = [
  //   [
  //     {planId: 1, icon: 'md-close', name: 'Be a Man'},
  //     {planId: 2, icon: 'md-time', name: 'Financial'},
  //     {planId: 3, icon: 'md-close', name: 'Angular 2'}
  //   ],
  //   [
  //     {planId: 4, icon: 'md-time', name: 'MCP Exams'}
  //   ]
  // ];

  private plans: Plans[] = [
    {planId: 1, colour: 'tile-red', title: "Basic", name: 'Be a Man'},
    {planId: 2, colour: 'tile-green', title: "Basic", name: 'Financial'},
    {planId: 3, colour: 'tile-orange', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-blue', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-purple', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-brown', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-gray', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-cyan', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-magenta', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-gold', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-yellow', title: "Basic", name: 'Angular 2'},
    {planId: 3, colour: 'tile-red', title: "Basic", name: 'Angular 2'},
    {planId: 4, colour: 'tile-red', title: "Basic", name: 'MCP Exams'}
  ];

  constructor() {
  }

  getPlans(columns): Promise<Plans[][]> {
    return new Promise<Plans[][]>(resolve => {
      resolve( this.getColumned(columns) );
    });
  }

  getColumned(columns): Plans[][] {
    let columnedPlans = [];
    
    this.plans.push({planId: -1, colour: "tile-black", title: "New", name: "New"});
    let noOfPlans: number = this.plans.length;

    for(var i=0; i < noOfPlans; i = i+columns) {
      let rowPlans: Plans[] = [];

      for(var j=0; j < columns; j++) {
        if ((i + j) < noOfPlans)
          rowPlans.push(this.plans[i+j]);
        else
          rowPlans.push(null);
      }

      columnedPlans.push(rowPlans);
    }
    
    return(columnedPlans);
  }
}

class Plans {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}