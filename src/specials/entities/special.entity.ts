import { Exclude } from "class-transformer";
import { ProductFittingEntity } from "src/product-fittings";
import { formatDate } from "src/shared/utils";
import { UserEntity } from "src/users/entities/user.entity";

export class SpecialEntity implements Speical {
    id: number;
    promotionRate: number;
    isArchived: Date | null;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    createdByUserId: number | null;

    @Exclude()
    updatedByUserId: number | null;

    createdByUser?: UserEntity;
    updatedByUser?: UserEntity;

    constructor({
        createdByUser,
        updatedByUser,
        ...data
    }: Partial<SpecialEntity>) {
        Object.assign(this, data);

        if(createdByUser) {
            this.createdByUser = new UserEntity(createdByUser);
        }

        if(updatedByUser) {
            this.updatedByUser = new UserEntity(updatedByUser);
        }
    }
}