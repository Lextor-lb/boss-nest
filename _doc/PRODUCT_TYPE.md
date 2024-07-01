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

## Types

### Type Index (GET)

```
product-types
```

| Arguments        | Type    | Action  | Description                  |
| :--------------- | :------ | :------ | :--------------------------- |
| `orderBy`        | `param` | orderBy | **id, name, createdAt**      |
| `orderDirection` | `param` | orderBy | **eg:orderDirection = desc** |
| `search`         | `param` | search  | **name**                     |

### Type Show (GET)

```
product-types/:id
```

### Type Create (POST)

```
product-types
```

| Arguments | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `name`    | `string` | **Required** / **eg: "foot wear"** |

### Type Update (PATCH)

```
product-types/:id
```

| Arguments | Type     | Description  |
| :-------- | :------- | :----------- |
| `name`    | `string` | **Required** |

### Type Delete (DELETE)

```
product-types/:id
```

### Type Delete Many (DELETE)

```
product-types
```

| Arguments | Type    | Description                            |
| :-------- | :------ | :------------------------------------- |
| `ids`     | `array` | **Required** **/** **eg: [ 1, 2, 3 ]** |
