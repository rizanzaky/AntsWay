import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DummyData } from './dummyData'

@Injectable()
export class DataProvider {
  private stagedPlanItems: PlanItem[];
  private plans: Plan[];
  private planItems: PlanItem[];

  constructor(private dummyData: DummyData) {
  }

  async getPlanDetails(planId: number): Promise<Plan> {  
    let plan = this.plans.find(f => f.planId == planId); // error handle

    return plan;

    // return new Promise<Plan>(resolve => {
    //   setTimeout(() => {
    //     resolve(plan)
    //   }, 2000)
    // });
  }

  createNewPlan(newPlan: Plan): Promise<void> {
    return new Promise<void>(resolve => {
      this.plans.push(newPlan);

      resolve();
    });
  }

  public async updatePlan(planToUpdate: any) {
    let plan = await this.plans.find(f => f.planId == planToUpdate.planId);

    plan.title = planToUpdate.title;
    plan.name = planToUpdate.name;
  }

  stagePlanItems(planId: number): Promise<PlanItem[]> {
    this.stagedPlanItems = [];
    this.stagedPlanItems = this.planItems.filter(f => {
      f.planId == planId;
    });

    return new Promise<PlanItem[]>(resolve => {
      resolve(this.stagedPlanItems);
    });
  }

  getPlanItems(planId: number): Promise<PlanItem[]> {
    this.planItems = this.dummyData.planItems;

    return new Promise<PlanItem[]>(resolve => {
      let items = this.planItems.filter(f => f.planId == planId);

      resolve(items);
    });
  }

  getPlans(columns: number): Promise<Plan[][]> {
    return new Promise<Plan[][]>(resolve => {
      resolve( this.convertColumned(columns) );
    });
  }

  private convertColumned(columns: number): Plan[][] {
    let isNew = true;
    let columnedPlans = [];
    this.plans = this.dummyData.plans;
    
    console.log("dummyData: ", this.dummyData);
    let noOfPlans: number = this.plans.length;

    for(var i=0; i < noOfPlans+1; i = i+columns) {
      let rowPlans: Plan[] = [];

      for(var j=0; j < columns; j++) {
        if ((i + j) < noOfPlans)
          rowPlans.push(this.plans[i+j]);
        else if (isNew) {
          rowPlans.push({planId: -1, colour: "tile-black", title: "New", name: "New"});
          isNew = false;
        } else {
          rowPlans.push(null);
        }
      }

      columnedPlans.push(rowPlans);
    }
    console.log("columnedPlans: ", columnedPlans);
    
    return(columnedPlans);
  }

  public createNewItem(newItem: PlanItem): Promise<void> {
    return new Promise<void>(resolve => {
      this.planItems.push(newItem);

      resolve();
    });
  }

  public async getNewPlanId(): Promise<number> {
    if (!this.plans)
      return 1;
    
    this.plans.sort((a: Plan, b: Plan) => { return (a.planId - b.planId) });

    return (this.plans[this.plans.length - 1].planId + 1);
  }

  public async getNewItemId(): Promise<number> {
    if (!this.planItems)
      return 1;
    
    this.planItems.sort((a: PlanItem, b: PlanItem) => { return (a.planItemId - b.planItemId) });

    return (this.planItems[this.planItems.length - 1].planItemId + 1);
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
  public name: string;
  public status: PlanItemStatus;
  public activeDays: number[];
  public createdOn: Date;
}

enum PlanItemStatus {
  Active = 1,
  Inactive = 2
}