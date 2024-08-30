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

## Coupon


### Ecommerce Coupon Index (GET)

```
coupon
```

### Ecommerce Coupon Show (GET)

```
coupon/:id
```

### Ecommerce Coupon Create (POST)

```
coupon
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Required** / **eg: "Monsoon Discount"** |
| `couponId`    | `string` | **Required** / **eg:"1234sf"** |
| `discount`    | `number` | **Required** / **eg:10** |
| `expiredDate`    | `date` | **Required** / **12-04-2024** |

### Ecommerce Coupon Update (PUT)

```
coupon/:id
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Required** / **eg: "Monsoon Discount"** |
| `couponId`    | `string` | **Required** / **eg:"1234sf"** |
| `discount`    | `number` | **Required** / **eg:10** |
| `expiredDate`    | `date` | **Required** / **12-04-2024** |

### Ecommerce Coupon Delete (DELETE)

```
coupon/:id
```

### Ecommerce Coupon Delete Many (DELETE)

```
coupon
```

| Arguments | Type    | Description                            |
| :-------- | :------ | :------------------------------------- |
| `ids`     | `array` | **Required** **/** **eg: [ 1, 2, 3 ]** |