interface Sizing {
    name: string;
    count: number;
  }
  
export class FittingReportEntity {
    id: number;
    name: string;
    totalQty: number;
    originalPrice: number;
    salePrice: number;
    profit: number;
    relatedSizings: Sizing[];

    constructor(partial: Partial<FittingReportEntity> = {}) {
        Object.assign(this, partial);
    }
}
