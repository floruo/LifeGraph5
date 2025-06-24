# DresClientApi.EvaluationApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getApiV2EvaluationByEvaluationIdInfo**](EvaluationApi.md#getApiV2EvaluationByEvaluationIdInfo) | **GET** /api/v2/evaluation/{evaluationId}/info | Returns basic information about a specific evaluation.
[**getApiV2EvaluationByEvaluationIdState**](EvaluationApi.md#getApiV2EvaluationByEvaluationIdState) | **GET** /api/v2/evaluation/{evaluationId}/state | Returns the state of a specific evaluation.
[**getApiV2EvaluationInfoList**](EvaluationApi.md#getApiV2EvaluationInfoList) | **GET** /api/v2/evaluation/info/list | Lists an overview of all evaluations visible to the current user.
[**getApiV2EvaluationStateList**](EvaluationApi.md#getApiV2EvaluationStateList) | **GET** /api/v2/evaluation/state/list | Lists an overview of all evaluation visible to the current user.



## getApiV2EvaluationByEvaluationIdInfo

> ApiEvaluationInfo getApiV2EvaluationByEvaluationIdInfo(evaluationId)

Returns basic information about a specific evaluation.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.EvaluationApi();
let evaluationId = "evaluationId_example"; // String | The evaluation ID.
apiInstance.getApiV2EvaluationByEvaluationIdInfo(evaluationId, (error, data, response) => {
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
 **evaluationId** | **String**| The evaluation ID. | 

### Return type

[**ApiEvaluationInfo**](ApiEvaluationInfo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2EvaluationByEvaluationIdState

> ApiEvaluationState getApiV2EvaluationByEvaluationIdState(evaluationId)

Returns the state of a specific evaluation.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.EvaluationApi();
let evaluationId = "evaluationId_example"; // String | The evaluation ID.
apiInstance.getApiV2EvaluationByEvaluationIdState(evaluationId, (error, data, response) => {
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
 **evaluationId** | **String**| The evaluation ID. | 

### Return type

[**ApiEvaluationState**](ApiEvaluationState.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2EvaluationInfoList

> [ApiEvaluationInfo] getApiV2EvaluationInfoList()

Lists an overview of all evaluations visible to the current user.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.EvaluationApi();
apiInstance.getApiV2EvaluationInfoList((error, data, response) => {
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

[**[ApiEvaluationInfo]**](ApiEvaluationInfo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2EvaluationStateList

> [ApiEvaluationState] getApiV2EvaluationStateList()

Lists an overview of all evaluation visible to the current user.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.EvaluationApi();
apiInstance.getApiV2EvaluationStateList((error, data, response) => {
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

[**[ApiEvaluationState]**](ApiEvaluationState.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

