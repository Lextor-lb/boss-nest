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

## Products

### Prefetch

```
product-sizings/all
```

```
product-fittings/all
```

```
product-categories/all
```

```
product-types/all
```

```
product-brands/all
```

### Product Index (GET)

```
products
```

| Arguments        | Type    | Action  | Description                    |
| :--------------- | :------ | :------ | :----------------------------- |
| `orderBy`        | `param` | orderBy | **id, name, salePrice, createdAt**        |
| `orderDirection` | `param` | orderBy | **orderDirection = asc/ desc** |
| `search`         | `param` | search  | **name**                       |

### Product Show (GET)

```
products/:id
```

### Product Create (POST)

```
products
```

**Description -**
Example json ---

```
{
  "name": "Seater",
  "description": "des",
  "isEcommerce": 0,
  "isPos": 0,
  "gender": "MAN",                              //MAN, WOMAN, UNISEX
  "images": file1,file2,
  "productBrandId": 2,
  "productTypeId": 2,
  "productCategoryId": 2,
  "productFittingId": 2,
  "stockPrice": 100,
  "salePrice": 200,
  "discountPrice": 0,
  "productVariants": [
    {
      "shopCode": "shopCode1",
      "productCode": "productCode1",
      "colorCode": "colorCode1",
      "barcode": "barcode1",                    //Unique
      "productSizingId": 1,
      "image": file.png
    },
     {
      "shopCode": "shopCode2",
      "productCode": "productCode2",
      "colorCode": "colorCode2",
      "barcode": "barcode2",                    //Unique
      "productSizingId": 2,
      "image": file.png
    }
  ]
}
```

### Product Update (PUT)

```
products/:id
```

| Arguments           | Type      | Description                                    |
| :------------------ | :-------- | :--------------------------------------------- |
| `isEcommerce`       | `boolean` | **Nullable** / **eg: 1,0**                     |
| `isPos`             | `boolean` | **Nullable** / **eg: 1,0**                     |
| `name`              | `string`  | **Nullable**                                   |
| `description`       | `string`  | **Nullable**                                   |
| `gender`            | `enum`    | **Nullable** / **Only ( MAN, WOMAN, UNISEX )** |
| `productBrandId`    | `integer` | **Nullable**                                   |
| `productTypeId`     | `integer` | **Nullable**                                   |
| `productCategoryId` | `integer` | **Nullable**                                   |
| `productFittingId`  | `integer` | **Nullable**                                   |
| `salePrice`         | `integer` | **Nullable**                                   |
| `stockPrice`        | `integer` | **Nullable**                                   |
| `discountPrice`        | `integer` | **Nullable**                                   |
| `images`        | `file` | **Nullable**                                   |

### Product Image Delete (DELETE)

```
products/media/:id
```

### Product Delete (DELETE)

```
products/:id
```

### Product Delete Many (DELETE)

```
products
```

| Arguments | Type    | Description                            |
| :-------- | :------ | :------------------------------------- |
| `ids`     | `array` | **Required** **/** **eg: [ 1, 2, 3 ]** |
