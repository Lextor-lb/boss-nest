## Ecommerce Categories

### Ecommerce Category Index (GET)

```
ecommerce-categories
```

### Ecommerce Category Show (GET)

```
ecommerce-categories/:id
```

### Ecommerce Category Create (POST)

```
ecommerce-categories
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Required** / **eg: "SHIRT"** |
| `productCategoryId`    | `integer` | **Required**  |
| `image`    | `file` | **Required**  |

### Ecommerce Category Update (PUT)

```
ecommerce-categories/:id
```

| Arguments  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `name`    | `string` | **Nullable** / **eg: "SHIRT"** |
| `productCategoryId`    | `integer` | **Nullable**  |
| `image`    | `file` | **Nullable**  |

### Ecommerce Category Delete (DELETE)

```
ecommerce-categories/:id
```

### Ecommerce Category Delete Many (DELETE)

```
ecommerce-categories
```

| Arguments | Type    | Description                            |
| :-------- | :------ | :------------------------------------- |
| `ids`     | `array` | **Required** **/** **eg: [ 1, 2, 3 ]** |
