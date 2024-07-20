( API Reference )

### Feature Lists

1. [Voucher](VOUCHER.md)
1. [Product](PRODUCT.md)
2. [Variant](PRODUCT_VARIANT.md)
3. [Brand](PRODUCT_BRAND.md)
4. [Type](PRODUCT_TYPE.md)
5. [Category](PRODUCT_CATEGORY.md)
6. [Fitting](PRODUCT_FITTING.md)
8. [Sizing](PRODUCT_SIZING.md)
9. [Special](SPECIAL.md)
9. [Customer](CUSTOMER.md)
10.[Report](REPORT.md)
10.[Stock_Report](STOCK_REPORT.md)
1. [Voucher_Report](VOUCHER_REPORT.md)
1. [Brand_Report](BRAND_REPORT.md)
1. [Type_Report](TYPE_REPORT.md)
1. [Category_Report](CATEGORY_REPORT.md)
1. [Fitting_Report](FITTING_REPORT.md)
1. [Sizing_Report](SIZING_REPORT.md)

## Fittings

### Prefetch

```
product-sizings/all
```

### Fitting Index (GET)

```
product-fittings
```

| Arguments  | Type | Action    | Description                      |
| :------    | :----| :-------- | :------------------------------- |
| `orderBy` | `param` | orderBy| **id, name, createdAt**   |
| `orderDirection` | `param` |orderBy| **eg:orderDirection = desc**   |
| `search`    | `param` | search|**name**   |

### Fitting Show (GET)

```
product-fittings/:id
```

### Fitting Create (POST)

**Description -**
We use name array to create multiple data.

```
product-fittings
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Required** / **eg: "slim"** |
| `productSizingIds`    | `array` | **Required** / **eg: [ 1, 2, 3 ]** |

### Fitting Update (PATCH)

```
product-fittings/:id
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Nullable** / **eg: "slim"** |
| `productSizingIds`    | `array` | **Nullable** / **eg: [ 1, 2, 3 ]** |

### Fitting Delete (DELETE)

```
product-fittings/:id
```

### Fitting Delete Many (DELETE)

```
product-fittings
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `ids` | `array` | **Required** **/** **eg: [ 1, 2, 3 ]**  |


