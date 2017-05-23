import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {
  private plans: Plans[] = [
    {planId: 1, icon: 'md-close', name: 'Be a Man'},
    {planId: 1, icon: 'md-time', name: 'Financial'},
    {planId: 1, icon: 'md-close', name: 'Angular 2'},
    {planId: 1, icon: 'md-time', name: 'MCP Exams'}
  ]

  constructor() {
  }

  getPlans(): Promise<Plans[]> {
    return new Promise<Plans[]>(resolve => {
      resolve(this.plans);
    });
  }
}

class Plans {
  public planId: number;
  public icon: string;
  public name: string;
}