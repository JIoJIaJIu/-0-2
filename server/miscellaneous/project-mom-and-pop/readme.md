# Project Mom and Pop

This app is a platform that will support the sale, exchange, and redemption of gift cards between businesses and individuals.  The goal of this platform is to help small businesses expand, using both web and mobile layouts, by giving them a simple way to raise capital and acquire new customers using gift cards.

### Project Structure, Setup, Configuration, Deployment, and Verification

Complete documentation can be found in **./docs/Deployment_Guide.doc**.

### Grunt

Grunt is included in this submission. Currently, there are two tasks registered as grunt tasks:

- **default**

This task runs **jshint**, **nodemon**, and starting the app itself.

- **test**

This task runs a **mocha test** on all js files in **./tests** folder.

### Routes

Routes are registered in **./routes.js**.

### Error handling

Error handling should be handled by calling the callback function of the middleware and inserting an Error object as the parameter input. For example,

```
exports.exampleMiddleware = function(req, res, next) {
  next(new Error('Something bad happens!'));
}
```

A catch-all error response handler is registered in the express app. Each time an error handled like above, the error response handler will be executed.

### Views

While this is just an API, I include a Views folder for storing email templates.
