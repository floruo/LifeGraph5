# DresClientApi.UserApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteApiV2UserByUserId**](UserApi.md#deleteApiV2UserByUserId) | **DELETE** /api/v2/user/{userId} | Deletes the specified user. Requires ADMIN privileges
[**getApiV2Logout**](UserApi.md#getApiV2Logout) | **GET** /api/v2/logout | Clears all user roles of the current session.
[**getApiV2User**](UserApi.md#getApiV2User) | **GET** /api/v2/user | Get information about the current user.
[**getApiV2UserByUserId**](UserApi.md#getApiV2UserByUserId) | **GET** /api/v2/user/{userId} | Gets details of the user with the given id.
[**getApiV2UserSession**](UserApi.md#getApiV2UserSession) | **GET** /api/v2/user/session | Get current sessionId
[**patchApiV2UserByUserId**](UserApi.md#patchApiV2UserByUserId) | **PATCH** /api/v2/user/{userId} | Updates the specified user, if it exists. Anyone is allowed to update their data, however only ADMINs are allowed to update anyone.
[**postApiV2Login**](UserApi.md#postApiV2Login) | **POST** /api/v2/login | Sets roles for session based on user account and returns a session cookie.
[**postApiV2User**](UserApi.md#postApiV2User) | **POST** /api/v2/user | Creates a new user, if the username is not already taken. Requires ADMIN privileges



## deleteApiV2UserByUserId

> ApiUser deleteApiV2UserByUserId(userId)

Deletes the specified user. Requires ADMIN privileges

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
let userId = "userId_example"; // String | User ID
apiInstance.deleteApiV2UserByUserId(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User ID | 

### Return type

[**ApiUser**](ApiUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2Logout

> SuccessStatus getApiV2Logout(opts)

Clears all user roles of the current session.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
let opts = {
  'session': "session_example" // String | Session Token
};
apiInstance.getApiV2Logout(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **session** | **String**| Session Token | [optional] 

### Return type

[**SuccessStatus**](SuccessStatus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2User

> ApiUser getApiV2User()

Get information about the current user.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
apiInstance.getApiV2User((error, data, response) => {
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

[**ApiUser**](ApiUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2UserByUserId

> ApiUser getApiV2UserByUserId(userId)

Gets details of the user with the given id.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
let userId = "userId_example"; // String | User's UID
apiInstance.getApiV2UserByUserId(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User&#39;s UID | 

### Return type

[**ApiUser**](ApiUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2UserSession

> String getApiV2UserSession(opts)

Get current sessionId

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
let opts = {
  'session': "session_example" // String | Session Token
};
apiInstance.getApiV2UserSession(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **session** | **String**| Session Token | [optional] 

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: text/plain, application/json


## patchApiV2UserByUserId

> ApiUser patchApiV2UserByUserId(userId, opts)

Updates the specified user, if it exists. Anyone is allowed to update their data, however only ADMINs are allowed to update anyone.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
let userId = "userId_example"; // String | User ID
let opts = {
  'apiUserRequest': new DresClientApi.ApiUserRequest() // ApiUserRequest | 
};
apiInstance.patchApiV2UserByUserId(userId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User ID | 
 **apiUserRequest** | [**ApiUserRequest**](ApiUserRequest.md)|  | [optional] 

### Return type

[**ApiUser**](ApiUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postApiV2Login

> ApiUser postApiV2Login(opts)

Sets roles for session based on user account and returns a session cookie.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
let opts = {
  'loginRequest': new DresClientApi.LoginRequest() // LoginRequest | 
};
apiInstance.postApiV2Login(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginRequest** | [**LoginRequest**](LoginRequest.md)|  | [optional] 

### Return type

[**ApiUser**](ApiUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postApiV2User

> ApiUser postApiV2User(opts)

Creates a new user, if the username is not already taken. Requires ADMIN privileges

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.UserApi();
let opts = {
  'apiUserRequest': new DresClientApi.ApiUserRequest() // ApiUserRequest | 
};
apiInstance.postApiV2User(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiUserRequest** | [**ApiUserRequest**](ApiUserRequest.md)|  | [optional] 

### Return type

[**ApiUser**](ApiUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

