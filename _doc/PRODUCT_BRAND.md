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

## Brands

### Brand Index (GET)

```
product-brands
```

| Arguments        | Type    | Action  | Description                  |
| :--------------- | :------ | :------ | :--------------------------- |
| `orderBy`        | `param` | orderBy | **id, name, createdAt**      |
| `orderDirection` | `param` | orderBy | **eg:orderDirection = desc** |
| `search`         | `param` | search  | **name**                     |

### Brand Show (GET)

```
product-brands/:id
```

### Brand Create (POST)

```
product-brands
```

| Arguments | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`    | `string` | **Required**                      |
| `image`   | `file`   | **Required** / **png, jpg, jpeg** |

### Brand Update (PATCH)

```
product-brands/:id
```

| Arguments | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`    | `string` | **Nullable**                      |
| `image`   | `file`   | **Nullable** / **png, jpg, jpeg** |

### Brand Delete (DELETE)

```
product-brands/id
```

### Brand Delete Many (DELETE)

```
product-brands
```

| Arguments | Type    | Description                            |
| :-------- | :------ | :------------------------------------- |
| `ids`     | `array` | **Required** **/** **eg: [ 1, 2, 3 ]** |
