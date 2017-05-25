import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {
  // private plans: Plan[][] = [
  //   [
  //     {planId: 1, icon: 'md-close', name: 'Be a Man'},
  //     {planId: 2, icon: 'md-time', name: 'Financial'},
  //     {planId: 3, icon: 'md-close', name: 'Angular 2'}
  //   ],
  //   [
  //     {planId: 4, icon: 'md-time', name: 'MCP Exams'}
  //   ]
  // ];

  private plans: Plan[] = [
    {planId: 1, colour: 'tile-red', title: "Basic", name: 'Be a Man'},
    {planId: 2, colour: 'tile-green', title: "Basic", name: 'Financial'},
    {planId: 3, colour: 'tile-orange', title: "Basic", name: 'Angular 2'},
    {planId: 4, colour: 'tile-blue', title: "Basic", name: 'Angular 2'},
    {planId: 5, colour: 'tile-purple', title: "Basic", name: 'Angular 2'},
    {planId: 6, colour: 'tile-brown', title: "Basic", name: 'Angular 2'},
    {planId: 7, colour: 'tile-gray', title: "Basic", name: 'Angular 2'},
    {planId: 8, colour: 'tile-cyan', title: "Basic", name: 'Angular 2'},
    {planId: 9, colour: 'tile-magenta', title: "Basic", name: 'Angular 2'},
    {planId: 10, colour: 'tile-gold', title: "Basic", name: 'Angular 2'},
    {planId: 11, colour: 'tile-yellow', title: "Basic", name: 'Angular 2'},
    {planId: 12, colour: 'tile-red', title: "Basic", name: 'Angular 2'},
    {planId: 13, colour: 'tile-red', title: "Basic", name: 'MCP Exams'}
  ];

  private planItems: PlanItem[] = [
    {planItemId: 1, planId: 3, status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()},
    {planItemId: 2, planId: 3, status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()},
    {planItemId: 3, planId: 3, status: PlanItemStatus.Inactive, activeDays: [], createdOn: new Date()},
    {planItemId: 4, planId: 3, status: PlanItemStatus.Inactive, activeDays: [], createdOn: new Date()},
    {planItemId: 5, planId: 2, status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()},
    {planItemId: 6, planId: 3, status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()}
  ];

  constructor() {
  }

  getPlanItems(planId: number): Promise<PlanItem[]> {
    return new Promise<PlanItem[]>(resolve => {
      resolve(this.planItems);
    });
  }

  getPlans(columns: number): Promise<Plan[][]> {
    return new Promise<Plan[][]>(resolve => {
      resolve( this.convertColumned(columns) );
    });
  }

  private convertColumned(columns: number): Plan[][] {
    let columnedPlans = [];
    
    this.plans.push({planId: -1, colour: "tile-black", title: "New", name: "New"});
    let noOfPlans: number = this.plans.length;

    for(var i=0; i < noOfPlans; i = i+columns) {
      let rowPlans: Plan[] = [];

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

class Plan {
  public planId: number;
  public colour: string;
  public name: string;
  public title: string;
}

class PlanItem {
  public planItemId: number;
  public planId: number;
  public status: PlanItemStatus;
  public activeDays: number[];
  public createdOn: Date;
}

enum PlanItemStatus {
  Active = 1,
  Inactive = 2
}