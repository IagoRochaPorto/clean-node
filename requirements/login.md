# Login

> ## Success Cases

1. ✅ Receive a **POST** requisition in route **/api/login**
2. ✅ Validate required data **email** and **password**
3. ✅ Ensure **email** is a valid email.
4. ✅ **Search** the user with the provided email and password
5. ✅ Generate an access **token** from the user ID
6. ✅ **Update** the user data with the generated access token
7. ✅ Returns **200** with the access token and the user name

> ## Exceptions

1. ✅ Returns an error **404** if the API doenst exists
2. ✅ Returns an error **400** if the  email or password have not been provided by the client
3. ✅ Returns an error **400** if the email field was an invalid email
4. ✅ Returns an error **401** if not found user with the provided data
5. ✅ Returns an error **500** if the generation of the access token throws
6. ✅ Returns an error **500** if the update of the user with the access token and user name throws