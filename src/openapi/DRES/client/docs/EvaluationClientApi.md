# DresClientApi.EvaluationClientApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getApiV2ClientEvaluationCurrentTaskByEvaluationId**](EvaluationClientApi.md#getApiV2ClientEvaluationCurrentTaskByEvaluationId) | **GET** /api/v2/client/evaluation/currentTask/{evaluationId} | Returns an overview of the currently active task for a run.
[**getApiV2ClientEvaluationList**](EvaluationClientApi.md#getApiV2ClientEvaluationList) | **GET** /api/v2/client/evaluation/list | Lists an overview of all evaluation runs visible to the current client.



## getApiV2ClientEvaluationCurrentTaskByEvaluationId

> ApiClientTaskTemplateInfo getApiV2ClientEvaluationCurrentTaskByEvaluationId(evaluationId, opts)

Returns an overview of the currently active task for a run.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.EvaluationClientApi();
let evaluationId = "evaluationId_example"; // String | The evaluation ID.
let opts = {
  'session': "session_example" // String | Session Token
};
apiInstance.getApiV2ClientEvaluationCurrentTaskByEvaluationId(evaluationId, opts, (error, data, response) => {
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
 **session** | **String**| Session Token | [optional] 

### Return type

[**ApiClientTaskTemplateInfo**](ApiClientTaskTemplateInfo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getApiV2ClientEvaluationList

> [ApiClientEvaluationInfo] getApiV2ClientEvaluationList(opts)

Lists an overview of all evaluation runs visible to the current client.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.EvaluationClientApi();
let opts = {
  'session': "session_example" // String | Session Token
};
apiInstance.getApiV2ClientEvaluationList(opts, (error, data, response) => {
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

[**[ApiClientEvaluationInfo]**](ApiClientEvaluationInfo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

