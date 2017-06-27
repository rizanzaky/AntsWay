import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Plan } from "../../models/plan";
import { PlanItem } from "../../models/planItem";
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";


@Injectable()
export class StoredData {
	private plans: Plan[];
	private planItems: PlanItem[];

	constructor(
		private sqlite: SQLite,
		private platform: Platform
	) { }

	async indexPlans(columns: number): Promise<Plan[][]> {
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

	private convertColumned(columns: number, rawPlans: any): Plan[][] {
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

  	async readPlan(planId: number): Promise<Plan> {
  	  let plan = await this.plans.find(f => f.planId == planId); // error handle

  	  return plan;

  	  // return new Promise<Plan>(resolve => {
  	  //   setTimeout(() => {
  	  //     resolve(plan)
  	  //   }, 2000)
  	  // });
  	}

  	public async getNewPlanId(): Promise<number> {
  	  if (!this.plans || this.plans.length == 0)
  	    return 1;
	  
  	  this.plans.sort((a: Plan, b: Plan) => { return (a.planId - b.planId) });

  	  return (this.plans[this.plans.length - 1].planId + 1);
  	}

	async createPlan(plan: Plan) {
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

	// async readPlan(planId: number) {
	// 	this.sqlite.create({
	// 		name: 'antsway.db',
	// 		location: 'default'
	// 	}).then((db: SQLiteObject) => {
	// 		db.executeSql(`
	// 			SELECT *
	// 			FROM Plan
	// 			WHERE planId = ?
	// 		`, [planId])
	// 		.then(plan => alert('Got ' + JSON.stringify(plan) + ' from Plan'))
	// 		.catch(e => alert(e));
  	// 	}).catch(e => alert(e));
	// }

	createPlanItem(planItem: PlanItem) {
		this.sqlite.create({
			name: 'antsway.db',
			location: 'default'
		}).then((db: SQLiteObject) => {
			db.executeSql(`
				INSERT INTO Plan(planItemId, planId, name, isDone, status, activeDays, createdOn)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`, [planItem.planItemId, planItem.planId, planItem.name, planItem.isDone, planItem.status, JSON.stringify(planItem.activeDays), planItem.createdOn])
			.then(() => {
				this.planItems.push(planItem);
				alert('Inserted ' + JSON.stringify(PlanItem) + ' into PlanItem')
			})
			.catch(e => alert(e));
  		}).catch(e => alert(e));
	}

	createItemSelection(planItem: PlanItem) {
		this.sqlite.create({
			name: 'antsway.db',
			location: 'default'
		}).then((db: SQLiteObject) => {
			db.executeSql(`
				INSERT INTO Plan(planItemId, planId, name, isDone, status, activeDays, createdOn)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`, [planItem.planItemId, planItem.planId, planItem.name, planItem.isDone, planItem.status, JSON.stringify(planItem.activeDays), planItem.createdOn])
			.then(() => alert('Inserted ' + JSON.stringify(PlanItem) + ' into PlanItem'))
			.catch(e => alert(e));
  		}).catch(e => alert(e));
	}
}