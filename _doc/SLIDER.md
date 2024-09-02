
# Sliders API Documentation

## Endpoints

# Sliders API Documentation

## Endpoints

### Get All Sliders

**URL**: `api/v1/slider`  
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

**URL**: `api/v1/slider`  
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




## API Documentation - Update Slider

### Endpoint

**PATCH** `/sliders/:id`

### Description

Updates a specific slider identified by its ID. This endpoint allows you to modify the slider’s mobile image, desktop image, and sorting order. All fields are optional and can be `null`, ensuring that existing values are not overwritten unless new values are provided.

### Request Parameters

- **Path Parameters**:
  - `id` (integer, required): The unique identifier of the slider to be updated.

### Request Body

The request body should be in `multipart/form-data` format and can include any of the following optional fields:

- **mobileImage** (file, optional, nullable): The image file for the mobile version of the slider. If provided, it will replace the existing mobile image.
- **desktopImage** (file, optional, nullable): The image file for the desktop version of the slider. If provided, it will replace the existing desktop image.
- **sorting** (string, optional, nullable): A string representing the sorting order, which will be parsed as an integer. If not provided, the existing sorting order will remain unchanged.

#### Example Request Body

```plaintext
Content-Type: multipart/form-data

desktopImage: <file>
mobileImage: <file>
sorting: "3"


## Endpoints

### Delete a Slider by ID

**URL**: `api/v1/slider/:id`  
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
