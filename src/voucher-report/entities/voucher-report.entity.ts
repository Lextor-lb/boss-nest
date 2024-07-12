export class VoucherReportEntity {
    id: number;
    voucherCode: string;
    qty: number;
    tax: number;
    total: number;
    createdAt: Date;

    constructor(partial: Partial<VoucherReportEntity> = {}){
        Object.assign(this,partial);
    }
}
