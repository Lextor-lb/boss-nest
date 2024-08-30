( API Reference )

## Ecommerce Address

### Ecommerce Address Create (POST)

```
address/:id
```

| Arguments       | Type     | Description  |
| :-------------- | :------- | :----------- |
| `city`          | `string` | **Required** |
| `township`      | `string` | **Required** |
| `street`        | `string` | **Required** |
| `company`       | `string` | **Nullable** |
| `addressDetail` | `string` | **Required** |

### Ecommerce Address FindAll (GET)

```
address
```

### Ecommerce Address Show (GET)

```
address/:id
```

### Ecommerce User Update (PATCH)

```
address/:id
```

| Arguments       | Type     | Description  |
| :-------------- | :------- | :----------- |
| `city`          | `string` | **Nullable** |
| `township`      | `string` | **Nullable** |
| `street`        | `string` | **Nullable** |
| `company`       | `string` | **Nullable** |
| `addressDetail` | `string` | **Nullable** |

### Ecommerce User Delete (DELETE)

```
address/:id
```
