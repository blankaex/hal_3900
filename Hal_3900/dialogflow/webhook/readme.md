# Hal\_3900

## Request & Respones formats -- V2 API

### Request format

| Name | Type | Description |
| ------ | ------ | ------ |
| responseID | String | Unique id for request |
| session | String | Unique session id |
| queryResult | Object | Result of the conversation query or event processing |
| ->queryText | String | The original text of the query |
| ->parameters | Object | Consists of parameter_name:parameter_value pairs |
| ->allRequiredParamsPresent | Boolean | Set to false if required parameters are missing in query |
| ->fulfillmentText | String | Text to be pronounced to the user or shown on the screen |
| ->fulfillmentMessages | Object | Collection of rich messages to show the user, including text to be shown or pronounced |
| ->outputContexts | Object | Collection of output contexts |
| ->intent | Object | The intent that matched the user's query |
| ->intentDetectionConfidence | Number 0-1 | Matching score for the intent |
| ->diagnosticInfo | Object | Free-form diagnostic info |
| ->languageCode | String | The language that was triggered during intent matching |
| originalDetectIntentRequest | Object | Full request coming from an integrated platform |


### Respones format

| Name | Type | Description |
| ------ | ------ | ------ |
| fulfillmentText | String | Optional. The text to be shown on the screen. This value is passed directly to QueryResult.fulfillment.text |
| fulfillmentMessages[] | Object(Message) | Optional. The collection of rich messages to present to the user. This value is passed directly to QueryResult.fulfillment_messages |
| source | String | Optional. This value is passed directly to QueryResult.webhook_source |
| playload | Object(Struct) | Optional. This value is passed directly to QueryResult.webhook_payload |
| outputContexts[] | Object(Context) | Optional. The collection of output contexts. This value is passed directly to QueryResult.output_contexts |
| followupEventInput | Object(EventInput) | Optional. Makes the platform immediately invoke another sessions.detectIntent call internally with the specified event as input |



