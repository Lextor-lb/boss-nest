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

## Fitting_Report

### Report (GET)

```
fitting-report
```
| Arguments        | Type    | Action  | Description                    |
| :--------------- | :------ | :------ | :----------------------------- |
| `orderBy`        | `param` | orderBy | **createdAt**                  |
| `orderDirection` | `param` | orderBy | **orderDirection = asc/ desc** |
| `search`         | `param` | search  | **search=today/weekly/monthly/yearly** |
| `search`         | `param` | custom search | **search=custom&start=20-02-2024&end=25-02-2024**  |