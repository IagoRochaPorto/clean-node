# List polls

## Success cases

1. ⛔ Receive a **GET** requisition in route **/api/surveys**
2. ⛔ Ensure if the requistion was made by an user
3. ⛔ Returns 204 if there is no content
4. ⛔ Returns 200 with the poll data

## Exceptions

1. ⛔ Returns 404 if the API doesn't exists
2. ⛔ Returns 403 if isn't an user
3. ⛔ Returns 500 if the list poll throws an error
