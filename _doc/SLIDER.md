
# Sliders API Documentation

## Endpoints

# Sliders API Documentation

## Endpoints

### Get All Sliders

**URL**: `/slider`  
**Method**: `GET`  
**Description**: Fetches all sliders.

#### Responses

- **200 OK**: Successfully fetched all sliders.
  - `status`: `true`
  - `message`: `"Fetched Successfully!"`
  - `data`: Array of slider objects

#### Example Response

```json
{
  "status": true,
  "message": "Fetched Successfully!",
  "data": [
    {
      "id": 1,
      "desktopImage": "https://amt.santar.store/uploads/path_to_desktop_image.jpg",
      "mobileImage": "https://amt.santar.store/uploads/path_to_mobile_image.jpg",
      "sorting": "1"
    },
    {
      "id": 2,
      "desktopImage": "https://amt.santar.store/uploads/path_to_another_desktop_image.jpg",
      "mobileImage": "https://amt.santar.store/uploads/path_to_another_mobile_image.jpg",
      "sorting": "2"
    }
  ]
}

```


### Create a New Slider

**URL**: `/slider`  
**Method**: `POST`  
**Description**: Creates a new slider with uploaded images and sorting order.

#### Request Body form data

- `desktopImage`: File (required) - The desktop image for the slider.
- `mobileImage`: File (required) - The mobile image for the slider.
- `sorting`: string (required) - The sorting order for the slider.

#### Example Request

```bash
curl -X POST "https://amt.santar.store/api/v1/slider" \
-H "Content-Type: multipart/form-data" \
-F "desktopImage=@path_to_desktop_image.jpg" \
-F "mobileImage=@path_to_mobile_image.jpg" \
-F "sorting=1"

```



## Endpoints

### Delete a Slider by ID

**URL**: `/slider/:id`  
**Method**: `DELETE`  
**Description**: Deletes a slider by its ID.

#### Path Parameters

- `id`: `string` (required) - The ID of the slider to delete.

#### Responses

- **200 OK**: Successfully deleted the slider.
  - `status`: `true`
  - `message`: `"Slider deleted successfully"`

- **404 Not Found**: If the slider with the specified ID is not found.
  - `status`: `false`
  - `message`: `"Slider not found"`

#### Example Response

**Success Response:**

```json
{
  "status": true,
  "message": "Slider deleted successfully"
}
