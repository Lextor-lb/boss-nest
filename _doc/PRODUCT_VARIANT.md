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

## Variants

### Variant Create (POST)

```
product-variants
```

| Arguments         | Type      | Description           |
| :---------------- | :-------- | :-------------------- |
| `shopCode`        | `string`  | **Required**          |
| `productCode`     | `string`  | **Required**          |
| `colorCode`       | `string`  | **Required**          |
| `productSizingId` | `integer` | **Required**          |
| `barcode`         | `string`  | **Required / Unique** |
| `image`           | `file`    | **Required**          |
| `productId`       | `integer` | **Required**          |

### Variant Update (PUT)

```
product-variants/:id
```

| Arguments         | Type      | Description           |
| :---------------- | :-------- | :-------------------- |
| `shopCode`        | `string`  | **Nullable**          |
| `productCode`     | `string`  | **Nullable**          |
| `colorCode`       | `string`  | **Nullable**          |
| `productSizingId` | `integer` | **Nullable**          |
| `barcode`         | `string`  | **Nullable / Unique** |
| `image`           | `file`    | **Nullable**          |

### Variant Delete (DELETE)

```
product-variants/id
```

### Variant Delete Many (DELETE)

```
product-variants
```

| Arguments | Type    | Description                            |
| :-------- | :------ | :------------------------------------- |
| `ids`     | `array` | **Required** **/** **eg: [ 1, 2, 3 ]** |
