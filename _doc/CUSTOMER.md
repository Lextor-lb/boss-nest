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
1. [Voucher_Report](VOUCHER_REPORT.md)
1. [Brand_Report](BRAND_REPORT.md)
1. [Type_Report](TYPE_REPORT.md)
1. [Category_Report](CATEGORY_REPORT.md)
1. [Fitting_Report](FITTING_REPORT.md)
1. [Sizing_Report](SIZING_REPORT.md)
1. [Slider](SLIDER.md)
1. [Coupon](COUPON.md)
1. [Customer](CUSTOMER.md)

## Customer


### Customer Index (GET)

```
customers
```

### Customer Index All (GET)

```
customers/all
```
| Arguments        | Type    | Action  | Description                  |
| :--------------- | :------ | :------ | :--------------------------- |
| `orderBy`        | `param` | orderBy | **id, name, createdAt**      |
| `orderDirection` | `param` | orderBy | **eg:orderDirection = desc** |
| `search`         | `param` | search  | **name**                     |

### Customer Show (GET)

```
customers/:id
```

### Customer Create (POST)

```
customers
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Required** / **eg: "Monsoon Discount"** |
| `phoneNumber`    | `string` | **Required** / **eg:"094824743"** |
| `ageRange`    | `number` | **Required** / **eg:YOUNG/MIDDLE/OLD** |
| `address`    | `string` | **Required** / **Bahan** |
| `gender`    | `enum`    | **Nullable** / **Only ( MEN, WOMEN, UNISEX )** |
| `remark`    | `string` | **Required** / **A thit yout yin pyaw par oo** |
| `specialId`    | `number` | **Required** / **2** |

### Customer Update (PUT)

```
customers/:id
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Required** / **eg: "Monsoon Discount"** |
| `phoneNumber`    | `string` | **Required** / **eg:"094824743"** |
| `ageRange`    | `number` | **Required** / **eg:YOUNG/MIDDLE/OLD** |
| `address`    | `string` | **Required** / **Bahan** |
| `specialId`    | `number` | **Required** / **2** |

### Customer Delete (DELETE)

```
customers/:id
```

### Customer Delete Many (DELETE)

```
customers
```

| Arguments | Type    | Description                            |
| :-------- | :------ | :------------------------------------- |
| `ids`     | `array` | **Required** **/** **eg: [ 1, 2, 3 ]** |