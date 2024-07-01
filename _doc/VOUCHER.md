( API Reference )

### Feature Lists

1. [Voucher](VOUCHER.md)
1. [Product](PRODUCT.md)
1. [Variant](PRODUCT_VARIANT.md)
1. [Brand](PRODUCT_BRAND.md)
1. [Type](PRODUCT_TYPE.md)
1. [Category](PRODUCT_CATEGORY.md)
1. [Fitting](PRODUCT_FITTING.md)
1. [Sizing](PRODUCT_SIZING.md)
1. [Special](SPECIAL.md)
1. [Customer](CUSTOMER.md)
1. [Report](REPORT.md)
1. [Stock_Report](STOCK_REPORT.md)

## Vouchers

### Barcode (GET)

```
vouchers/barcode/:barcode
```

### Voucher Create (POST)

```
vouchers
```

**Description -**
Example json ---

```
{
    "voucher_code": "hhygyfs",               // unique
    "customerId": 1,                         // nullable
    "type": "ONLINE",                        // ONLINE, OFFLINE
    "payment_method" : "CARD" ,              // CARD, WALLET, CASH
    "discount": 10,                          // nullable
    "tax": 5,                                // nullable
    "sub_total": 2000 ,
    "total": 3000 ,
    "remark": "short note!"                  //nullable
    "voucherRecords": [
            {
                "productVariantId" : 1,
                "salePrice": 2000
                "discount" : 10              // nullable
            },
             {
                "productVariantId" : 2,
                "salePrice": 2000
                "discount" : 10              // nullable
            }
    ]
}
```

### Voucher Show (GET)

```
vouchers/:id
```
