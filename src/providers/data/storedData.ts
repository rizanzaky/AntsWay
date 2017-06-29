import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Plan } from "../../models/plan";
import { PlanItem } from "../../models/planItem";
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { ItemSelection } from "../../models/itemSelection";

@Injectable()
export class StoredData {
	private plans: Plan[];
	private planItems: PlanItem[];
	private itemSelections: ItemSelection[];

	constructor(
		private sqlite: SQLite,
		private platform: Platform
	) { }

	// Plans Section
	
	async indexPlans(columns: number): Promise<Plan[][]> { // done
		return new Promise<Plan[][]>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						SELECT *
						FROM Plan
					`, {})
					.then(plans => {
						resolve(this.convertColumned(columns, plans.rows));
					})
					.catch(e => alert('2 IndxPlan Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbIP Err : ' + JSON.stringify(e)));
			});
		});
	}

	private convertColumned(columns: number, rawPlans: any): Plan[][] { // done
		let isNew = true;
		let columnedPlans = [];
		this.plans = [];
		
		let noOfPlans: number = rawPlans.length;

		for(var i=0; i < noOfPlans+1; i = i+columns) {
			let rowPlans: Plan[] = [];

			for(var j=0; j < columns; j++) {
				if ((i + j) < noOfPlans) {
					let plan = rawPlans.item(i+j);
					rowPlans.push(plan);
					this.plans.push(plan);
				} else if (isNew) {
					rowPlans.push({planId: -1, colour: "tile-black", title: "New", name: "New"});
					isNew = false;
				} else {
					rowPlans.push(null);
				}
			}

			columnedPlans.push(rowPlans);
		}
		
		alert("ColPlans: " + JSON.stringify(columnedPlans));
		return(columnedPlans);
	}

  	async readPlan(planId: number): Promise<Plan> { // done
  	  let plan = await this.plans.find(f => f.planId == planId); // error handle

  	  return plan;

  	  // return new Promise<Plan>(resolve => {
  	  //   setTimeout(() => {
  	  //     resolve(plan)
  	  //   }, 2000)
  	  // });
  	}

	async createPlan(plan: Plan) { // done
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						INSERT INTO Plan(planId, colour, name, title)
						VALUES (?, ?, ?, ?)
					`, [plan.planId, plan.colour, plan.name, plan.title])
					.then(() => {
						this.plans.push(plan);
						alert('Inserted ' + JSON.stringify(plan) + ' into Plan');
						resolve();
					})
					.catch(e => alert('2 CPlan Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbC Err : ' + JSON.stringify(e)));
			});
		});
	}

  	async getNewPlanId(): Promise<number> { // done
  	  if (!this.plans || this.plans.length == 0)
  	    return 1;
	  
  	  this.plans.sort((a: Plan, b: Plan) => { return (a.planId - b.planId) });

  	  return (this.plans[this.plans.length - 1].planId + 1);
  	}

	async updatePlan(planToUpdate: Plan) {
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						UPDATE Plan
						SET title = ?, name = ?
						WHERE planId = ?
					`, [planToUpdate.title, planToUpdate.name, planToUpdate.planId])
					.then(() => {
						let plan = this.plans.find(f => f.planId == planToUpdate.planId);

						plan.title = planToUpdate.title;
						plan.name = planToUpdate.name;

						alert('Updated ' + JSON.stringify(plan) + ' Plan');
						resolve();
					})
					.catch(e => alert('2 CPlan Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbC Err : ' + JSON.stringify(e)));
			});
		});
	}

	private async removePlanItems(planId: number) {
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						DELETE FROM PlanItem
						WHERE planId = ?
					`, [planId])
					.then(() => {
						alert('Deleted PlanItems');
						resolve();
					})
					.catch(e => alert('2 CPlan Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbC Err : ' + JSON.stringify(e)));
			});
		});
	}

	private async removePlan(planId: number) {
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						DELETE FROM Plan
						WHERE planId = ?
					`, [planId])
					.then(() => {
						alert('Deleted Plan');

						let planIdx = this.plans.findIndex(f => f.planId == planId);
						this.plans.splice(planIdx, 1);

						resolve();
					})
					.catch(e => alert('2 CPlan Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbC Err : ' + JSON.stringify(e)));
			});
		});
	}

	async deletePlan(planId: number) { // done // check is async
		// return new Promise<void>(resolve => {
		// 	this.removePlanItems(planId).then(() => {
		// 		this.removePlan(planId).then(() => {
		// 			resolve();
		// 		});
		// 	});
		// });
		await this.removePlanItems(planId).then(() => {
			this.removePlan(planId).then(() => {
				return;
			});
		});
	}

	// Plan Items Section

	async indexPlanItems(planId: number): Promise<PlanItem[]> { // done
		this.planItems = [];

		return new Promise<PlanItem[]>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						SELECT *
						FROM PlanItem
						WHERE planId = ?
					`, [planId])
					.then(rawItems => {
						for(var i=0; i < rawItems.length+1; i++) {
							this.planItems.push(rawItems.item(i));
						}

						resolve(this.planItems);
					})
					.catch(e => alert('2 IndxPlanItm Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbIPI Err : ' + JSON.stringify(e)));
			});
		});
	}

	async createPlanItem(planItem: PlanItem) { // done
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						INSERT INTO PlanItem(planItemId, planId, name, isDone, status, activeDays, createdOn)
						VALUES (?, ?, ?, ?, ?, ?, ?)
					`, [planItem.planItemId, planItem.planId, planItem.name, planItem.isDone, planItem.status, JSON.stringify(planItem.activeDays), planItem.createdOn])
					.then(() => {
						this.planItems.push(planItem);
						alert('Inserted ' + JSON.stringify(PlanItem) + ' into PlanItem')
					})
					.catch(e => alert(e));
				}).catch(e => alert(e));
			});
		});
	}

	async getNewPlanItemId(): Promise<number> { // done 
		if (!this.planItems)
			return 1;

		// always plan items related to plan, no filtering needed
		this.planItems.sort((a: PlanItem, b: PlanItem) => { return (a.planItemId - b.planItemId) });

		return (this.planItems[this.planItems.length - 1].planItemId + 1);
	}

	async updatePlanItem(planItem: PlanItem): Promise<void> { // done
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						UPDATE PlanItem
						SET name = ?, status = ?, activeDays = ?
						WHERE planId = ? AND planItemId = ?
					`, [planItem.name, planItem.status, JSON.stringify(planItem.activeDays), planItem.planId, planItem.planItemId])
					.then(() => {
						let item = this.planItems.find(f => f.planId == planItem.planId && f.planItemId == planItem.planItemId);

						item.name = planItem.name;
						item.status = planItem.status;
						item.activeDays = planItem.activeDays;

						alert('Updated Plan Item');
						resolve();
					})
					.catch(e => alert('2 CPlan Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbC Err : ' + JSON.stringify(e)));
			});
		});
	}

	public async deletePlanItem(planId: number, planItemId: number): Promise<void> { // done
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						DELETE FROM PlanItem
						WHERE planId = ? AND planItemId = ?
					`, [planId, planItemId])
					.then(() => {
						alert('Deleted Plan');

						let indexItemToDel = this.planItems.findIndex(f => f.planId == planId && f.planItemId == planItemId);
						this.planItems.splice(indexItemToDel, 1);

						resolve();
					})
					.catch(e => alert('2 CPlan Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbC Err : ' + JSON.stringify(e)));
			});
		});
	}

	// Plan Item Selections Section

	async getItemSelections(planId: number): Promise<ItemSelection[]> { // done // need re-visit
		return new Promise<ItemSelection[]>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						SELECT *
						FROM ItemSelection
						WHERE planId = ?
					`, [planId])
					.then(rawItems => {
						this.itemSelections = [];

						for(var i=0; i < rawItems.length+1; i++) {
							this.itemSelections.push(rawItems.item(i));
						}

						resolve(this.itemSelections);
					})
					.catch(e => alert('2 IndxSelect Err : ' + JSON.stringify(e)));
				}).catch(e => alert('2 DbISErr : ' + JSON.stringify(e)));
			});
		});
	}

	async saveSelection(selection: ItemSelection) { // done // check if async
		return new Promise<void>(resolve => {
			this.platform.ready().then(()=>{
				this.sqlite.create({
					name: 'antsway.db',
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql(`
						INSERT INTO ItemSelection(planId, planItemId, date, isDone)
						VALUES (?, ?, ?, ?)
					`, [selection.planId, selection.planItemId, selection.date, selection.isDone])
					.then(() => { 
						this.itemSelections.push(selection);
						alert('Inserted ' + JSON.stringify(PlanItem) + ' into ItemSelection');
					})
					.catch(e => alert(e));
				}).catch(e => alert(e));
			});
		});
	}
}