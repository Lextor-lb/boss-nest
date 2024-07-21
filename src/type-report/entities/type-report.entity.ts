export class TypeReportEntity {
    id: number;
    name: string;
    qty: number;
    originalPrice: number;
    salePrice: number;
    profit: number;

    constructor(partial: Partial<TypeReportEntity> = {}) {
        Object.assign(this,partial);
    }
}
