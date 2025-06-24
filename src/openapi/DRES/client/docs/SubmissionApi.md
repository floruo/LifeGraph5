# DresClientApi.SubmissionApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getApiV1Submit**](SubmissionApi.md#getApiV1Submit) | **GET** /api/v1/submit | Endpoint to accept submissions
[**postApiV2SubmitByEvaluationId**](SubmissionApi.md#postApiV2SubmitByEvaluationId) | **POST** /api/v2/submit/{evaluationId} | Endpoint to accept submissions.



## getApiV1Submit

> SuccessfulSubmissionsStatus getApiV1Submit(opts)

Endpoint to accept submissions

This has been the submission endpoint for version 1. Please refrain from using it and migrate to the v2 endpoint.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.SubmissionApi();
let opts = {
  'collection': "collection_example", // String | Collection identifier. Optional, in which case the default collection for the run will be considered.
  'item': "item_example", // String | Identifier for the actual media object or media file.
  'text': "text_example", // String | Text to be submitted. ONLY for tasks with target type TEXT. If this parameter is provided, it superseeds all athers.
  'frame': 56, // Number | Frame number for media with temporal progression (e.g., video).
  'shot': 56, // Number | Shot number for media with temporal progression (e.g., video).
  'timecode': "timecode_example", // String | Timecode for media with temporal progression (e.g,. video).
  'session': "session_example" // String | Session Token
};
apiInstance.getApiV1Submit(opts, (error, data, response) => {
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
 **collection** | **String**| Collection identifier. Optional, in which case the default collection for the run will be considered. | [optional] 
 **item** | **String**| Identifier for the actual media object or media file. | [optional] 
 **text** | **String**| Text to be submitted. ONLY for tasks with target type TEXT. If this parameter is provided, it superseeds all athers. | [optional] 
 **frame** | **Number**| Frame number for media with temporal progression (e.g., video). | [optional] 
 **shot** | **Number**| Shot number for media with temporal progression (e.g., video). | [optional] 
 **timecode** | **String**| Timecode for media with temporal progression (e.g,. video). | [optional] 
 **session** | **String**| Session Token | [optional] 

### Return type

[**SuccessfulSubmissionsStatus**](SuccessfulSubmissionsStatus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## postApiV2SubmitByEvaluationId

> SuccessfulSubmissionsStatus postApiV2SubmitByEvaluationId(evaluationId, apiClientSubmission, opts)

Endpoint to accept submissions.

### Example

```javascript
import DresClientApi from 'dres_client_api';

let apiInstance = new DresClientApi.SubmissionApi();
let evaluationId = "evaluationId_example"; // String | The ID of the evaluation the submission belongs to.
let apiClientSubmission = new DresClientApi.ApiClientSubmission(); // ApiClientSubmission | 
let opts = {
  'session': "session_example" // String | Session Token
};
apiInstance.postApiV2SubmitByEvaluationId(evaluationId, apiClientSubmission, opts, (error, data, response) => {
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
 **evaluationId** | **String**| The ID of the evaluation the submission belongs to. | 
 **apiClientSubmission** | [**ApiClientSubmission**](ApiClientSubmission.md)|  | 
 **session** | **String**| Session Token | [optional] 

### Return type

[**SuccessfulSubmissionsStatus**](SuccessfulSubmissionsStatus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

