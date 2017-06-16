import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DummyData } from './dummyData';
import { Plan } from '../../models/plan';
import { PlanItem } from '../../models/planItem';
import { ItemSelection } from '../../models/itemSelection';

@Injectable()
export class DataProvider {
  private stagedPlanItems: PlanItem[];
  private plans: Plan[] = []; // remove
  private planItems: PlanItem[];
  private itemSelections: ItemSelection[];

  constructor(private dummyData: DummyData) {
  }

  // public async getPlanItemDetails(planId: number, planItemId: number) {
  //   let planItem = await this.planItems.find(f => f.planId == planId && f.planItemId == planItemId); // error handle

  //   return planItem;
  // }

  public async updatePlanItem(planItem: PlanItem): Promise<void> {
    let item = await this.planItems.find(f => f.planId == planItem.planId && f.planItemId == planItem.planItemId);

    item.name = planItem.name;
    item.status = planItem.status;
    item.activeDays = planItem.activeDays;
  }

  public async deletePlanItem(planId: number, planItemId: number): Promise<void> {
    let indexItemToDel = await this.planItems.findIndex(f => f.planId == planId && f.planItemId == planItemId);
    this.planItems.splice(indexItemToDel, 1);
  }

  public deletePlan(planId: number) { // check is async
    let planIdxToDel = [];
    for (var index = this.dummyData.planItems.length - 1; index >= 0; index--) {
      if (this.dummyData.planItems[index].planId == planId)
        planIdxToDel.push(index);
    }
    planIdxToDel.forEach(indexItemToDel => {
      this.dummyData.planItems.splice(indexItemToDel, 1);
    });

    let planIdx = this.dummyData.plans.findIndex(f => f.planId == planId);
    this.dummyData.plans.splice(planIdx, 1);
  }

  async getPlanDetails(planId: number): Promise<Plan> {  
    let plan = await this.plans.find(f => f.planId == planId); // error handle

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

  public async updatePlan(planToUpdate: Plan) {
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

  public async saveSelection(selection: ItemSelection) { // check if async
    await this.dummyData.itemSelections.push(selection);

    return;
  }

  public async getItemSelection(planId: number): Promise<ItemSelection[]> { // need re-visit
    this.itemSelections = this.dummyData.itemSelections;
    // let dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5);
    // let dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 5);

    // let selections = await this.itemSelections.filter(f => f.planId == planId && f.date >= dateFrom && f.date <= date);
    let selections = await this.itemSelections.filter(f => f.planId == planId);
    return selections;

    // return new Promise<ItemSelection[]>(resolve => {
    //   setTimeout(() => {
    //     resolve(selections)
    //   }, 2000)
    // });
  }

  public async getPlanItems(planId: number): Promise<PlanItem[]> {
    this.planItems = this.dummyData.planItems;

    let items = await this.planItems.filter(f => f.planId == planId); // error handle
    return items;

    // return new Promise<PlanItem[]>(resolve => {
    //   setTimeout(() => {
    //     resolve(items)
    //   }, 2000)
    // });
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
    
    return(columnedPlans);
  }

  public createNewItem(newItem: PlanItem): Promise<void> {
    return new Promise<void>(resolve => {
      this.planItems.push(newItem);

      resolve();
    });
  }

  public async getNewPlanId(): Promise<number> {
    if (!this.plans || this.plans.length == 0)
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