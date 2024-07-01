
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
10. [Report](REPORT.md)
10. [Stock_Report](STOCK_REPORT.md)


## Categories

### Prefetch
```

product-fittings/all
```

```
product-types/all
```
### Category Index (GET)

```
product-categories
```


| Arguments  | Type | Action    | Description                      |
| :------    | :----| :-------- | :------------------------------- |
| `orderBy` | `param` | orderBy| **id,name, createdAt**   |
| `orderDirection` | `param` |orderBy| **eg:orderDirection = desc**   |
| `search`    | `param` | search|**name**   |



### Category Show (GET)

```
product-categories/:id
```

### Category Create (POST)



```
product-categories
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Required** / **eg: "Hoodie"** |
| `productTypeIds`    | `array` | **Required** / **eg: [ 1, 2, 3 ]** |
| `productFittingId`    | `integer` | **Required**  |

### Category Update (PATCH)

```
product-categories/:id
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Nullable** / **eg: "Hoodie"** |
| `productTypeIds`    | `array` | **Nullable** / **eg: 1** |
| `productFittingId`    | `integer` | **Nullable** / **eg: [ 1, 2, 3 ]** |

### Category Delete (DELETE)

```
product-categories/:id
```
### Category Delete Many (DELETE)

```
product-categories
```
| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `ids` | `array` | **Required** **/** **eg: [ 1, 2, 3 ]**  |

