( API Reference )

## ORDERS

### order Index (GET)

```
orders
```
### order Index For Ecommerce (GET)

```
orders/ecommerce
```

### order Show (GET)

```
orders/:id
```

### order Create (POST)

```
orders
```

```
{
    "orderCode": "3f",
    "subTotal": 1000,
    "total": 1500,
	"discount": 0		//nullable
    "orderRecords":[
        {
            "productVariantId": 1,
            "salePrice": 500
        },
          {
            "productVariantId": 2,
            "salePrice": 500
        }
    ]
}
```

### order Update (PATCH)

```
orders/:id
```
```
enum OrderStatus {
  ORDERED
  CANCEL
  CONFIRM
  DELIVERY
  COMPLETE
}
```
```
if 
{
	"orderStatus": "CANCEL"
}
```
```
if 
{
    "voucherCode:   "fjhfgw",
	"orderStatus": "CONFIRM"
}
voucher will be created
```