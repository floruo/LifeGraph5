# DresClientApi.StatusApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getApiV2StatusTime**](StatusApi.md#getApiV2StatusTime) | **GET** /api/v2/status/time | Returns the current time on the server.



## getApiV2StatusTime

> CurrentTime getApiV2StatusTime()

Returns the current time on the server.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.StatusApi();
apiInstance.getApiV2StatusTime((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**CurrentTime**](CurrentTime.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

