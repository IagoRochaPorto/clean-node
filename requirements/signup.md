# Signup

> ## Success Cases

1. ✅ Receive a **POST** requisition in route **/api/signup**
2. ✅ Validate required data **name**, **email**, **password** and **passwordConfirmation**
3. ✅ Ensure **password** and **passwordConfirmation** are equals
4. ✅ Ensure **email** is a valid email.
5. ⛔ **Check** if has an user with the provided email.
6. ✅ Generate an **encrypted** password (this password cannot be uncrypted)
7. ✅ **Create** an account for the user with provided data, **replacing** the password with the encrypted passsword.
8. ✅ Generate an access **token** from the user ID
9. ✅ **Update** user data with the generated access token
10. ✅ Returns **200** with the access token and the user name

> ## Exceptions

1. ✅ Returns an error **404** if the API doenst exists
2. ✅ Returns an error **400** if the name, email, password or passwordConfirmation have not been provided by the client
3. ✅ Returns an error **400** if password and passwordConfirmation are not equals
4. ✅ Returns an error **400** if the email field was an invalid email
5. ✅ Returns an error **403** if the provided email is already been used
6. ✅ Returns an error **500** if the generation of the encrypted password throws
7. ✅ Returns an error **500** if the user account creation throws
8. ✅ Returns an error **500** if the generation of the access token throws
9. ✅ Returns an error **500** if the update of the user with the access token and user name throws