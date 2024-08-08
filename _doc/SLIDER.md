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

## Slider


### Slider Index (GET)

```
slider/all
```

### Slider Show (GET)

```
slider/:id
```

### Slider Create (POST)

```
slider
```

| Arguments         | Type     | Description                       |
| :---------------- | :------- | :-------------------------------- |
| `place1Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place1Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |
| `place2Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place2Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |
| `place3Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place3Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |
| `place4Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place4Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |

### Slider Update (PUT)

```
slider/:id
```

| Arguments         | Type     | Description                       |
| :---------------- | :------- | :-------------------------------- |
| `place1Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place1Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |
| `place2Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place2Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |
| `place3Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place3Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |
| `place4Desktop`   | `file`   | **Required** / **png, jpg, jpeg** |
| `place4Mobile`    | `file`   | **Required** / **png, jpg, jpeg** |