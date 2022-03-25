# Backend

## DevDependencies

1. Babel

- @babel/core - core babel compiler,
- @babel/cli - command line interface for babel. We will need thiis to transpile our code using npm script.
- Run `npm run build`. This will run babel and the output will be present in `lib` directory, only now we are using a local copy
- Install @babel/preset-env which enables transforms for ES2015+

2. ESLint
   ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

- Install eslint package with `npm install eslint --save-dev`
- Install eslint plugins:

  - `eslint-plugin-import`. This plugin intends to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names. All the goodness that the ES2015+ static module syntax intends to provide, marked up in your editor.
  - `eslint-plugin-node`. Additional ESLint's rules for Node.js
  - `eslint-plugin-prettier`. Runs Prettier as an ESLint rule and reports differences as individual ESLint issues.

3. **Prettier** - Opinionated Code Formatter
4. **Nodemon** - is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
5. **rimraf** - the UNIX command rm -rf for node.

## Dependencies

1. `core-js`. Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2021
2. `regenerator-runtime`. Standalone runtime for Regenerator-compiled generator and async functions. [Link on why we need corejs and regenerator-runtime with Babel 7](https://stackoverflow.com/questions/53558916/babel-7-referenceerror-regeneratorruntime-is-not-defined)
3. `Express`. Fast, unopinionated, minimalist framework for node.
4. `body-parser`. Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
5. `morgan`. HTTP request logger middleware for node.js
6. `mongoose`. Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

- Add this inside package.json scripts:

```js
"build": "babel src -d dist",
    "start": "node dist/index.js",
    "restart": "rimraf dist && npm run build && npm start",
    "dev": "nodemon --exec npm run restart"
```

## Auth

### What is Authentication?

Authentication is ability of our app to determine who our user is based on user's credentials.
For authenticating our users we need to have logic on our backend as well as frontend.

- **Backend**

For the backend we need the following:

- Server running with express.
- Database for saving our users.
- Model to represent our user in the code.
- We will need signup route where we will be creating our users. Also, signin route where we will be logging in users.

1. First we need to make sure that all the dependencies are installed in our project. Then, start creating our express server and make sure that we are able to start it.

2. After we have created our server we want to proceed by creating our database. As mentioned above, we need to have the database itself as well as models to interact with that come from our ORM (mongoose)

- Create a config folder with index.js file
- Create a config object which will take in our jwt secret and our dbUrl

- Create a db.js file in utils folder
- Create a function that will connect to mongoose database

```js
const connect = () => mongoose.connect(baseConfig.dbUrl);
```

We will await this function in our server.js file before we start our server

3. Create a test route where can test if the user is being created in our database (ex. `/signup`). NOTE: we DO NOT need to worry about password hashing, email uniqueness etc. at this stage. We will implement it as soon as we are confident that we can save users to our database.

4. Now that we can save users, notice that our passwords are not hashed in any way. This might cause security issues, if our server/database gets hacked, exposing login credentials of our users. We want to change it by implementiing a mongoose hook on our user model.

```js
// Is a hook that runs before we save the document in database
userSchema.pre("save", function (next) {
  // IsModified returns true if the password was modified, and false if it was not
  // If we want to update an existing account we don't want to run bcrypt function
  if (!this.isModified("password")) {
    return next();
  }

  // hash password in order to prevent storing original password in the database
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});
```

```js
userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password; // hashed pass
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};
```

5. Next, notice that we are able to save our user with the exact same email several times in our database. This will cause issues during login since we will not be able to tell which user is which, since we do not have any unique credentials. We want to change it by creating a custom validator on our mongoose model.

```js
validate: {
  // Is a function that will throw an error if we already have this email in our database
  // If it returns false then it will throw an error
  // If it returns true then it will not throw an error
    validator: async function (email) {
      const count = await User.count({ email: email });
      return !count;
    },
    message: "Email already exist",
  },
```

6. Now that we have all validations in place, we want to make sure that all errors that occur are handled properly with either `try ... catch` or `.then().catch()` inside our controller.

7. On top of that we can check in our controller if user provided all information require before we even attempt saving it in our database. We can create `if` statements in our controller that will check if email, password, name etc exist in the payload of our request body. If they do not exist, we can throw an appropriate error back to our client since we already know that saving user without credentials wont yield any results.

8. Next we want to create `/signin` route.

9. Create a newToken function that will take in our user and return a new jwt token. We will need this function to generate our token that we will store in our cookies and we will be using for subsequent requests to determine if the user is logged in or not.

10. Create a verifyToken function that will verify our token. It will take a token as an argument and return a promise that will call `jwt.verify` with our token as an argument. We will resolve the promise with our payload. If we have an error we will reject the promise. We will need this function in checkToken function to get our payload from our token and then find our user by payload id

11. Create a checkToken function that will check if we have a token in our cookies, if we have it then we will split our token from it's bearer prefix. `try` Call verifyToken function with our token as an argument, that will return our token payload. Find our user by payload id

```js
await User.findById(payload.id).select("-password").lean().exec();
```

, and send it as a response. `catch` If there is an error, send 401. We will need this function to check if we are still logged in and if our token is still valid

12. Create a signin function that will sign in our user account and create a new token. If we don't have email or password on request body, send status 400. Find user in database by email on request body. If there is no user send status 401. `try` Check if our passwords match with database user password. Create new token with our user passed in. Add token on our cookie using `res.cookie`

```js
res.cookie("token", "Bearer " + token, {
  expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
  httpOnly: true,
});
```

. Send status 201 with our user as a response. `catch` If there is an error, send 401
