export class CategoryReportEntity {
    id: number;
    name: string;
    qty: number;
    originalPrice: number;
    salePrice: number;
    profit: number;

    constructor(partial: Partial<CategoryReportEntity> = {}) {
        Object.assign(this, partial);
    }
}