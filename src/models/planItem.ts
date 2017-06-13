import { PlanItemStatus } from '../../src/common/enums/planItemStatus';

export class PlanItem {
  public planItemId: number;
  public planId: number;
  public name: string;
  public isDone: boolean;
  public status: PlanItemStatus;
  public activeDays: number[];
  public createdOn: Date;
}