import { Exclude, Transform } from "class-transformer";

export class CouponEntity {
    id: number;
    name: string;
    couponId: string;
    discount: number;

    @Exclude({ toPlainOnly: true }) // Exclude from JSON output
    expiredDate: Date;

    @Transform(({ obj }) => formatDate(obj.expiredDate), { toPlainOnly: true })
    formattedExpiredDate: string;

    isArchived: Date | null;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    createdByUserId: number | null;

    @Exclude()
    updatedByUserId: number | null;

    constructor(partial: Partial<CouponEntity>) {
        Object.assign(this, partial);
        // Assign the formatted date string to formattedExpiredDate
        this.formattedExpiredDate = formatDate(this.expiredDate);
    }
}

// Helper function to format the date
function formatDate(date: Date): string {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
