export class BrandReportEntity {
    id: number;
    name: string;
    qty: number;
    originalPrice: number;
    salePrice: number;
    profit: number;

    constructor(partial: Partial<BrandReportEntity> = {}){
        Object.assign(this, partial);
    }
}
