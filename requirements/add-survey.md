# Create poll

> ## Success Cases

1. ⛔ Receive a **POST** requisition in route **/api/surveys**
2. ⛔ Validate if the requisition was made by an admin
3. ⛔ Validate required data **question** and **answers**.
4. ⛔ **Search** the user with the provided email and password
5. ⛔ Create a poll with de provided data
6. ✅ Returns **204**

> ## Exceptions

1. ⛔ Returns an error **404** if the API doenst exists
2. ⛔ Returns an error **403** if the  user is not an admin
3. ✅ Returns an error **400** if **question** or **answers** was not provided by the client
4. ✅ Returns an error **500** if the create request throws