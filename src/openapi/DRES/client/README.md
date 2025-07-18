# dres_client_api

DresClientApi - JavaScript client for dres_client_api
Client API for DRES (Distributed Retrieval Evaluation Server), Version 2.0.0-RC4
This SDK is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: 2.0.0-RC4
- Package version: 2.0.0-RC4
- Generator version: 7.13.0
- Build package: org.openapitools.codegen.languages.JavascriptClientCodegen

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/), please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install dres_client_api --save
```

Finally, you need to build the module:

```shell
npm run build
```

##### Local development

To use the library locally without publishing to a remote npm registry, first install the dependencies by changing into the directory containing `package.json` (and this README). Let's call this `JAVASCRIPT_CLIENT_DIR`. Then run:

```shell
npm install
```

Next, [link](https://docs.npmjs.com/cli/link) it globally in npm with the following, also from `JAVASCRIPT_CLIENT_DIR`:

```shell
npm link
```

To use the link you just defined in your project, switch to the directory you want to use your dres_client_api from, and run:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

Finally, you need to build the module:

```shell
npm run build
```

#### git

If the library is hosted at a git repository, e.g.https://github.com/GIT_USER_ID/GIT_REPO_ID
then install it via:

```shell
    npm install GIT_USER_ID/GIT_REPO_ID --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var DresClientApi = require('dres_client_api');


var api = new DresClientApi.EvaluationApi()
var evaluationId = "evaluationId_example"; // {String} The evaluation ID.
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.getApiV2EvaluationByEvaluationIdInfo(evaluationId, callback);

```

## Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DresClientApi.EvaluationApi* | [**getApiV2EvaluationByEvaluationIdInfo**](docs/EvaluationApi.md#getApiV2EvaluationByEvaluationIdInfo) | **GET** /api/v2/evaluation/{evaluationId}/info | Returns basic information about a specific evaluation.
*DresClientApi.EvaluationApi* | [**getApiV2EvaluationByEvaluationIdState**](docs/EvaluationApi.md#getApiV2EvaluationByEvaluationIdState) | **GET** /api/v2/evaluation/{evaluationId}/state | Returns the state of a specific evaluation.
*DresClientApi.EvaluationApi* | [**getApiV2EvaluationInfoList**](docs/EvaluationApi.md#getApiV2EvaluationInfoList) | **GET** /api/v2/evaluation/info/list | Lists an overview of all evaluations visible to the current user.
*DresClientApi.EvaluationApi* | [**getApiV2EvaluationStateList**](docs/EvaluationApi.md#getApiV2EvaluationStateList) | **GET** /api/v2/evaluation/state/list | Lists an overview of all evaluation visible to the current user.
*DresClientApi.EvaluationClientApi* | [**getApiV2ClientEvaluationCurrentTaskByEvaluationId**](docs/EvaluationClientApi.md#getApiV2ClientEvaluationCurrentTaskByEvaluationId) | **GET** /api/v2/client/evaluation/currentTask/{evaluationId} | Returns an overview of the currently active task for a run.
*DresClientApi.EvaluationClientApi* | [**getApiV2ClientEvaluationList**](docs/EvaluationClientApi.md#getApiV2ClientEvaluationList) | **GET** /api/v2/client/evaluation/list | Lists an overview of all evaluation runs visible to the current client.
*DresClientApi.LogApi* | [**postApiV2LogQueryByEvaluationId**](docs/LogApi.md#postApiV2LogQueryByEvaluationId) | **POST** /api/v2/log/query/{evaluationId} | Accepts query logs from participants for the specified evaluation.
*DresClientApi.LogApi* | [**postApiV2LogResultByEvaluationId**](docs/LogApi.md#postApiV2LogResultByEvaluationId) | **POST** /api/v2/log/result/{evaluationId} | Accepts result logs from participants  for the specified evaluation.
*DresClientApi.StatusApi* | [**getApiV2StatusTime**](docs/StatusApi.md#getApiV2StatusTime) | **GET** /api/v2/status/time | Returns the current time on the server.
*DresClientApi.SubmissionApi* | [**getApiV1Submit**](docs/SubmissionApi.md#getApiV1Submit) | **GET** /api/v1/submit | Endpoint to accept submissions
*DresClientApi.SubmissionApi* | [**postApiV2SubmitByEvaluationId**](docs/SubmissionApi.md#postApiV2SubmitByEvaluationId) | **POST** /api/v2/submit/{evaluationId} | Endpoint to accept submissions.
*DresClientApi.UserApi* | [**deleteApiV2UserByUserId**](docs/UserApi.md#deleteApiV2UserByUserId) | **DELETE** /api/v2/user/{userId} | Deletes the specified user. Requires ADMIN privileges
*DresClientApi.UserApi* | [**getApiV2Logout**](docs/UserApi.md#getApiV2Logout) | **GET** /api/v2/logout | Clears all user roles of the current session.
*DresClientApi.UserApi* | [**getApiV2User**](docs/UserApi.md#getApiV2User) | **GET** /api/v2/user | Get information about the current user.
*DresClientApi.UserApi* | [**getApiV2UserByUserId**](docs/UserApi.md#getApiV2UserByUserId) | **GET** /api/v2/user/{userId} | Gets details of the user with the given id.
*DresClientApi.UserApi* | [**getApiV2UserSession**](docs/UserApi.md#getApiV2UserSession) | **GET** /api/v2/user/session | Get current sessionId
*DresClientApi.UserApi* | [**patchApiV2UserByUserId**](docs/UserApi.md#patchApiV2UserByUserId) | **PATCH** /api/v2/user/{userId} | Updates the specified user, if it exists. Anyone is allowed to update their data, however only ADMINs are allowed to update anyone.
*DresClientApi.UserApi* | [**postApiV2Login**](docs/UserApi.md#postApiV2Login) | **POST** /api/v2/login | Sets roles for session based on user account and returns a session cookie.
*DresClientApi.UserApi* | [**postApiV2User**](docs/UserApi.md#postApiV2User) | **POST** /api/v2/user | Creates a new user, if the username is not already taken. Requires ADMIN privileges


## Documentation for Models

 - [DresClientApi.ApiAnswer](docs/ApiAnswer.md)
 - [DresClientApi.ApiAnswerSet](docs/ApiAnswerSet.md)
 - [DresClientApi.ApiAnswerType](docs/ApiAnswerType.md)
 - [DresClientApi.ApiClientAnswer](docs/ApiClientAnswer.md)
 - [DresClientApi.ApiClientAnswerSet](docs/ApiClientAnswerSet.md)
 - [DresClientApi.ApiClientEvaluationInfo](docs/ApiClientEvaluationInfo.md)
 - [DresClientApi.ApiClientSubmission](docs/ApiClientSubmission.md)
 - [DresClientApi.ApiClientTaskTemplateInfo](docs/ApiClientTaskTemplateInfo.md)
 - [DresClientApi.ApiContentElement](docs/ApiContentElement.md)
 - [DresClientApi.ApiContentType](docs/ApiContentType.md)
 - [DresClientApi.ApiCreateEvaluation](docs/ApiCreateEvaluation.md)
 - [DresClientApi.ApiEvaluation](docs/ApiEvaluation.md)
 - [DresClientApi.ApiEvaluationInfo](docs/ApiEvaluationInfo.md)
 - [DresClientApi.ApiEvaluationOverview](docs/ApiEvaluationOverview.md)
 - [DresClientApi.ApiEvaluationStartMessage](docs/ApiEvaluationStartMessage.md)
 - [DresClientApi.ApiEvaluationState](docs/ApiEvaluationState.md)
 - [DresClientApi.ApiEvaluationStatus](docs/ApiEvaluationStatus.md)
 - [DresClientApi.ApiEvaluationTemplate](docs/ApiEvaluationTemplate.md)
 - [DresClientApi.ApiEvaluationTemplateOverview](docs/ApiEvaluationTemplateOverview.md)
 - [DresClientApi.ApiEvaluationType](docs/ApiEvaluationType.md)
 - [DresClientApi.ApiHint](docs/ApiHint.md)
 - [DresClientApi.ApiHintContent](docs/ApiHintContent.md)
 - [DresClientApi.ApiHintOption](docs/ApiHintOption.md)
 - [DresClientApi.ApiHintType](docs/ApiHintType.md)
 - [DresClientApi.ApiJudgement](docs/ApiJudgement.md)
 - [DresClientApi.ApiJudgementRequest](docs/ApiJudgementRequest.md)
 - [DresClientApi.ApiJudgementValidatorStatus](docs/ApiJudgementValidatorStatus.md)
 - [DresClientApi.ApiMediaCollection](docs/ApiMediaCollection.md)
 - [DresClientApi.ApiMediaItem](docs/ApiMediaItem.md)
 - [DresClientApi.ApiMediaItemMetaDataEntry](docs/ApiMediaItemMetaDataEntry.md)
 - [DresClientApi.ApiMediaType](docs/ApiMediaType.md)
 - [DresClientApi.ApiOverrideAnswerSetVerdictDto](docs/ApiOverrideAnswerSetVerdictDto.md)
 - [DresClientApi.ApiPopulatedMediaCollection](docs/ApiPopulatedMediaCollection.md)
 - [DresClientApi.ApiRole](docs/ApiRole.md)
 - [DresClientApi.ApiRunProperties](docs/ApiRunProperties.md)
 - [DresClientApi.ApiScore](docs/ApiScore.md)
 - [DresClientApi.ApiScoreOption](docs/ApiScoreOption.md)
 - [DresClientApi.ApiScoreOverview](docs/ApiScoreOverview.md)
 - [DresClientApi.ApiScoreSeries](docs/ApiScoreSeries.md)
 - [DresClientApi.ApiScoreSeriesPoint](docs/ApiScoreSeriesPoint.md)
 - [DresClientApi.ApiSubmission](docs/ApiSubmission.md)
 - [DresClientApi.ApiSubmissionInfo](docs/ApiSubmissionInfo.md)
 - [DresClientApi.ApiSubmissionOption](docs/ApiSubmissionOption.md)
 - [DresClientApi.ApiTarget](docs/ApiTarget.md)
 - [DresClientApi.ApiTargetContent](docs/ApiTargetContent.md)
 - [DresClientApi.ApiTargetOption](docs/ApiTargetOption.md)
 - [DresClientApi.ApiTargetType](docs/ApiTargetType.md)
 - [DresClientApi.ApiTask](docs/ApiTask.md)
 - [DresClientApi.ApiTaskGroup](docs/ApiTaskGroup.md)
 - [DresClientApi.ApiTaskOption](docs/ApiTaskOption.md)
 - [DresClientApi.ApiTaskOverview](docs/ApiTaskOverview.md)
 - [DresClientApi.ApiTaskStatus](docs/ApiTaskStatus.md)
 - [DresClientApi.ApiTaskTemplate](docs/ApiTaskTemplate.md)
 - [DresClientApi.ApiTaskTemplateInfo](docs/ApiTaskTemplateInfo.md)
 - [DresClientApi.ApiTaskType](docs/ApiTaskType.md)
 - [DresClientApi.ApiTeam](docs/ApiTeam.md)
 - [DresClientApi.ApiTeamAggregatorType](docs/ApiTeamAggregatorType.md)
 - [DresClientApi.ApiTeamGroup](docs/ApiTeamGroup.md)
 - [DresClientApi.ApiTeamGroupValue](docs/ApiTeamGroupValue.md)
 - [DresClientApi.ApiTeamInfo](docs/ApiTeamInfo.md)
 - [DresClientApi.ApiTeamTaskOverview](docs/ApiTeamTaskOverview.md)
 - [DresClientApi.ApiTemporalPoint](docs/ApiTemporalPoint.md)
 - [DresClientApi.ApiTemporalRange](docs/ApiTemporalRange.md)
 - [DresClientApi.ApiTemporalUnit](docs/ApiTemporalUnit.md)
 - [DresClientApi.ApiUser](docs/ApiUser.md)
 - [DresClientApi.ApiUserRequest](docs/ApiUserRequest.md)
 - [DresClientApi.ApiVerdictStatus](docs/ApiVerdictStatus.md)
 - [DresClientApi.ApiViewerInfo](docs/ApiViewerInfo.md)
 - [DresClientApi.ApiVote](docs/ApiVote.md)
 - [DresClientApi.CurrentTime](docs/CurrentTime.md)
 - [DresClientApi.DresInfo](docs/DresInfo.md)
 - [DresClientApi.ErrorStatus](docs/ErrorStatus.md)
 - [DresClientApi.LoginRequest](docs/LoginRequest.md)
 - [DresClientApi.QueryEvent](docs/QueryEvent.md)
 - [DresClientApi.QueryEventCategory](docs/QueryEventCategory.md)
 - [DresClientApi.QueryEventLog](docs/QueryEventLog.md)
 - [DresClientApi.QueryResultLog](docs/QueryResultLog.md)
 - [DresClientApi.RankedAnswer](docs/RankedAnswer.md)
 - [DresClientApi.RunManagerStatus](docs/RunManagerStatus.md)
 - [DresClientApi.SuccessStatus](docs/SuccessStatus.md)
 - [DresClientApi.SuccessfulSubmissionsStatus](docs/SuccessfulSubmissionsStatus.md)
 - [DresClientApi.TemporalRange](docs/TemporalRange.md)


## Documentation for Authorization


Authentication schemes defined for the API:
### CookieAuth


- **Type**: API key
- **API key parameter name**: SESSIONID
- **Location**: 

