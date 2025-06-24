# DresClientApi.LogApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**postApiV2LogQueryByEvaluationId**](LogApi.md#postApiV2LogQueryByEvaluationId) | **POST** /api/v2/log/query/{evaluationId} | Accepts query logs from participants for the specified evaluation.
[**postApiV2LogResultByEvaluationId**](LogApi.md#postApiV2LogResultByEvaluationId) | **POST** /api/v2/log/result/{evaluationId} | Accepts result logs from participants  for the specified evaluation.



## postApiV2LogQueryByEvaluationId

> SuccessStatus postApiV2LogQueryByEvaluationId(evaluationId, session, opts)

Accepts query logs from participants for the specified evaluation.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.LogApi();
let evaluationId = "evaluationId_example"; // String | The evaluation ID.
let session = "session_example"; // String | Session Token
let opts = {
  'queryEventLog': new DresClientApi.QueryEventLog() // QueryEventLog | 
};
apiInstance.postApiV2LogQueryByEvaluationId(evaluationId, session, opts, (error, data, response) => {
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
 **session** | **String**| Session Token | 
 **queryEventLog** | [**QueryEventLog**](QueryEventLog.md)|  | [optional] 

### Return type

[**SuccessStatus**](SuccessStatus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postApiV2LogResultByEvaluationId

> SuccessStatus postApiV2LogResultByEvaluationId(evaluationId, session, opts)

Accepts result logs from participants  for the specified evaluation.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.LogApi();
let evaluationId = "evaluationId_example"; // String | The evaluation ID.
let session = "session_example"; // String | Session Token
let opts = {
  'queryResultLog': new DresClientApi.QueryResultLog() // QueryResultLog | 
};
apiInstance.postApiV2LogResultByEvaluationId(evaluationId, session, opts, (error, data, response) => {
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
 **session** | **String**| Session Token | 
 **queryResultLog** | [**QueryResultLog**](QueryResultLog.md)|  | [optional] 

### Return type

[**SuccessStatus**](SuccessStatus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

