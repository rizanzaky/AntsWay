export class DummyData {
  public plans: Plan[] = [
    {planId: 1, colour: 'tile-red', title: "Basic", name: 'Be a Man'},
    {planId: 2, colour: 'tile-green', title: "Basic", name: 'Financial'},
    {planId: 3, colour: 'tile-orange', title: "Basic", name: 'Angular 2'},
    {planId: 4, colour: 'tile-blue', title: "Basic", name: 'Angular 2'},
    {planId: 5, colour: 'tile-purple', title: "Basic", name: 'Angular 2'},
    {planId: 6, colour: 'tile-brown', title: "Basic", name: 'Angular 2'},
    {planId: 18, colour: 'tile-gray', title: "Basic", name: 'Angular 2'},
    {planId: 8, colour: 'tile-cyan', title: "Basic", name: 'Angular 2'},
    {planId: 9, colour: 'tile-magenta', title: "Basic", name: 'Angular 2'},
    {planId: 10, colour: 'tile-gold', title: "Basic", name: 'Angular 2'},
    {planId: 11, colour: 'tile-yellow', title: "Basic", name: 'Angular 2'},
    {planId: 12, colour: 'tile-red', title: "Basic", name: 'Angular 2'},
    // {planId: 13, colour: 'tile-red', title: "Basic", name: 'MCP Exams'}
  ];

  public planItems: PlanItem[] = [
    {planItemId: 1, planId: 3, name: "Monday, Sunday, Friday, Wednesday", status: PlanItemStatus.Active, activeDays: [1,0,5,3], createdOn: new Date()},
    {planItemId: 2, planId: 3, name: "Monday, Friday", status: PlanItemStatus.Active, activeDays: [1,5], createdOn: new Date()},
    {planItemId: 3, planId: 3, name: "Inactive: Wednesday, Saturday, Tuesday", status: PlanItemStatus.Inactive, activeDays: [3,6,2], createdOn: new Date()},
    {planItemId: 4, planId: 3, name: "Inactive item", status: PlanItemStatus.Inactive, activeDays: [], createdOn: new Date()},
    {planItemId: 5, planId: 2, name: "PlanId is TWO", status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()},
    {planItemId: 6, planId: 3, name: "All days", status: PlanItemStatus.Active, activeDays: [], createdOn: new Date()}
  ];
  
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