<h1 align="center">Sneakerhead-API</h1>
<p align="center">
  <img src="https://github.com/ewerton11/sneakerhead-api/blob/main/docs/sneakerhead-API.png" alt="Sneakerhead API">
</p>

<h2>Project description</h2>

> This API is aimed at sneakerhead culture enthusiasts and aims to help them save money on their favorite sneaker purchases. It uses web scraping techniques to collect data from multiple online stores, allowing users to compare prices and identify the best deals. Additionally, the API maintains a price history for each shoe model, allowing users to see price fluctuations over time and identify opportunities to buy at the right time.

## How to use

> To run the API, you need to have Docker and Docker Compose installed on your machine.

> To build the API images, run the following command in the project's root directory:

`$ docker-compose up --build`

> This command will build the necessary images to run the API.

## Examples of Requests

### Router 1: `/sneakers`

Endpoint: `/sneakers`

Method: `GET`

### Query parameters

| Parameters | Type | Description | Example |
|-----------|------|-----------|---------|
| `searchQuery` | `string` | Keywords to search sneakers | `searchQuery=airmax` |
| `brandSort` | `string` | Tennis brand to filter the results. accepts `adidas` or `nike` | `brandSort=nike` |
| `discountSort` | `string` | Sort results by discount. Accept `DescDiscount` to sort by highest discount first | `discountSort=DescDiscount` |
| `priceSort` | `string` | Sort results by price. Supports `AscPrice` to sort by lowest price first and `DescPrice` to sort by highest price first | `priceSort=AscPrice` |
| `limit` | `int` | Maximum number of results to return. Accepts values between `0` and `all` | `limit=10` |

### Sample request

> GET `https://your-api.com/sneakers?searchQuery=airmax&brandSort=nike&discountSort=DescDiscount&priceSort=AscPrice&limit=2`

### Sample answer

```json
{
"id": 187,
"name": "Tênis Nike Air Max SYSTM Masculino",
"brand": "nike",
"store": "nike",
"price": 38999,
"previous_price": 69999,
"discount": 44,
"image": "https://imgnike-a.akamaihd.net/1920x1920/0228317T.jpg",
"details": "https://www.nike.com.br/tenis-nike-air-max-systm-022831.html?cor=7T#186",
"created_at": "2023-04-04T01:41:03.000Z",
"updated_at": "2023-04-04T01:41:03.000Z"
},
{
"id": 494,
"name": "Tênis Nike Air Max Excee Masculino",
"brand": "nike",
"store": "nike",
"price": 48999,
"previous_price": 74999,
"discount": 35,
"image": "https://imgnike-a.akamaihd.net/1920x1920/024101ID.jpg",
"details": "https://www.nike.com.br/tenis-nike-air-max-excee-masculino-024101.html?cor=ID#201",
"created_at": "2023-04-04T16:23:24.000Z",
"updated_at": "2023-04-04T16:23:24.000Z"
}
```

### Rota 2: `/sneakers/infoSneaker/`

Endpoint: `/sneakers/infoSneaker/`

Method: `GET`

### Query parameters
| Parameters | Type | Description | Example |
|-----------|------|-----------|---------|
| `id` | `int` | The ID of the selected sneaker to display information for | `id=19` |

### Sample request

> GET `https://your-api.com/sneakers?id=19`

### Sample answer

```json
{
"id": 19,
"name": "Tênis Air Force 1 '07 LV8 Masculino",
"brand": "nike",
"store": "nike",
"price": 89999,
"previous_price": null,
"discount": null,
"price_history": 89999,
"image": "https://imgnike-a.akamaihd.net/1920x1920/02458451.jpg",
"details": "https://www.nike.com.br/tenis-air-force-1-07-lv8-masculino-024584.html?cor=51#18",
"created_at": "2023-04-04T01:40:35.000Z",
"updated_at": "2023-04-04T01:40:35.000Z"
}
```


### Rota 3: `/sneakers/sneakersEqual`

Endpoint: `/sneakers/sneakersEqual`

Method: `GET`

### Query parameters
| Parameters | Type | Description | Example |
|-----------|------|-----------|---------|
| `name` | `string` | Select all sneakers with the same name | `name=Tênis Air Force 1 '07 LV8 Masculino` |

### Sample request

> GET `https://your-api.com/sneakers/sneakersEqual?name=Tênis Air Force 1 '07 LV8 Masculino`

### Sample answer

```json
{
"id": 73,
"image": "https://imgnike-a.akamaihd.net/1920x1920/024192IM.jpg"
},
{
"id": 97,
"image": "https://imgnike-a.akamaihd.net/1920x1920/00931851.jpg"
},
{
"id": 101,
"image": "https://imgnike-a.akamaihd.net/1920x1920/009318ID.jpg"
},
{
"id": 121,
"image": "https://imgnike-a.akamaihd.net/1920x1920/02419251.jpg"
},
{
"id": 138,
"image": "https://imgnike-a.akamaihd.net/1920x1920/024192ID.jpg"
},
{
"id": 172,
"image": "https://imgnike-a.akamaihd.net/1920x1920/0241077T.jpg"
},
{
"id": 517,
"image": "https://imgnike-a.akamaihd.net/1920x1920/024192NX.jpg"
}
```

## License

This project is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0), which means you can use, copy, modify, and distribute the code in this project, even for commercial purposes, as long as you comply with the following conditions:

- You must include a copy of the license in all distributions of the software.
- You must provide attribution to the original author of the software.
- If you modify the software, you must inform others about the changes you've made.
- If you monetize the software, you must inform the original author and share a portion of the profits.

For more information about the Apache 2.0 License, please see the [LICENSE](LICENSE) file included in this repository.
