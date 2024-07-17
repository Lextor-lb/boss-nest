export class FittingReportEntity {
    id: number;
    name: string;
    qty: number;
    originalPrice: number;
    salePrice: number;
    profit: number;
    relatedSizings: Record<string, number>;

    constructor(partial: Partial<FittingReportEntity> = {}) {
        Object.assign(this, partial);
    }
}
