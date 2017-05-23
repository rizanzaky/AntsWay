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
    {planId: 1, icon: 'md-close', name: 'Be a Man'},
    {planId: 2, icon: 'md-time', name: 'Financial'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 3, icon: 'md-close', name: 'Angular 2'},
    {planId: 4, icon: 'md-time', name: 'MCP Exams'}
  ];

  constructor() {
  }

  getPlans(columns): Promise<Plans[][]> {
    return new Promise<Plans[][]>(resolve => {
      resolve( this.getColumned(columns) );

      console.log("plans: ", this.plans);
      // resolve(this.plans);
    });
  }

  getColumned(columns): Plans[][] {
    // console.log("Columns: ", columns)
    let columnedPlans = [];

    let noOfPlans: number = this.plans.length;
    let noOfIters: number = 1;
    let modulus: number = noOfPlans / columns;
    let modulo: number = noOfPlans % columns;

    for(var i=0; i < noOfPlans; i = i+columns) {
      // let colLength: number = (noOfPlans - noOfIters * columns) > columns ? columns : (noOfPlans - noOfIters * columns);
      let colLength: number = (noOfIters <= modulus) ? columns : modulo;
      noOfIters++;
      let rowPlans: Plans[] = [];

      for(var j=0; j < colLength; j++) {
        rowPlans.push(this.plans[i+j]);
      }

      columnedPlans.push(rowPlans);
    }
    
    console.log("columnedPlans: ", columnedPlans);

    return(columnedPlans);
    // return([]);
  }
}

class Plans {
  public planId: number;
  public icon: string;
  public name: string;
}