import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function seedCustomer() {
    const customerDetails = [
        {
            name: 'Your Customer',
            phoneNumber: 93785383,
            address: 'Yangon',
            specialId: 2
        },
        {
            name: 'Your Customer 2',
            phoneNumber: 937853883,
            address: 'Yangon',
            specialId: 2,
            remark: 'More Discount for me'
        }
    ];

    await Promise.all(
        customerDetails.map(async(customer) => {
            await prisma.customer.create({
                data: {
                    name: customer.name,
                    phoneNumber: customer.phoneNumber,
                    address: customer.address,
                    specialId: customer.specialId,
                    remark: customer.remark || null
                }
            })
        })
    )
}