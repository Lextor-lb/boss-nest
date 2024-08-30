## Ecommerce Products

## Prefetch

```
product-types/alls
```

```
product-brands/all
```

### Ecommerce Product Index (GET)

```
ecommerce-Products/riddle/:type
```

| Arguments        | Type    | Action  | Description                       |
| :--------------- | :------ | :------ | :-------------------------------- |
| `page`           | `query` | orderBy | **?page = 1**                     |
| `limit`          | `query` | orderBy | **?limit = 10**                   |
| `orderBy`        | `query` | orderBy | **?id, name, createdAt**          |
| `orderDirection` | `query` | orderBy | **?orderDirection = asc/ desc**   |
| `search`         | `query` | search  | **?name**                         |
| `sortGender`     | `query` | sort    | **?sortGender = men,women,unisex** |
| `sortBrand`      | `query` | sort    | **?sortBrand = 1, 2, 3, ...**     |
| `sortType`       | `query` | sort    | **?sortType = 1, 2, 3, ...**      |
| `min`            | `query` | sort    | **?min = 100**                    |
| `max`            | `query` | sort    | **?max = 5000**                   |
| `type`           | `param` | filter  | **men, women, unisex, categoryId** |

### Ecommerce Category Show (GET)

```
ecommerce-products/:id
```
