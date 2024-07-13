import { format } from "date-fns";

export class VoucherReportEntity {
    id: number;
    voucherCode: string;
    qty: number;
    tax: number;
    total: number;
    createdAt: Date;
    time?: string;

    constructor(partial: Partial<VoucherReportEntity> = {}){
        Object.assign(this,partial);
        if (partial.createdAt) {
            this.time = format(new Date(partial.createdAt), 'hh:mm a');
          }
    }
}
