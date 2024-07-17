export class SizingReportEntity {
    id: number;
    name: string;
    qty: number;
    originalPrice: number;
    salePrice: number;
    profit: number;

    constructor(partial: Partial<SizingReportEntity> = {}) {
        Object.assign(this, partial);
    }
}
