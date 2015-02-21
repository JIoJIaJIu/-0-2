Challenge Link: https://www.topcoder.com/challenge-details/30048519/?type=develop&lc=
By: CaptainChrno

Complete deployment guide can be found in Deployment_Guide.doc. It is also available in ./docs folder. It includes the following explanations:
- Project structure explanation
- Installation
- Configuration
- Deployment
- Verification

For the rest of this readme, I'll explain my decisions that are either not specified in the specification/architecture or deviated from them. If not written here, then it's based on the discussion in the forum.

1. Grunt
I believe every project in nodeJS, no matter how small, should use grunt. At the very least, I use grunt in this project mainly for jshint and nodemon.

2. Config
I like having config file in yaml format for its readability. Using config module is also a plus.

3. Routes
I think routes definition is better separated into its own file, to easily distinct between routes and custom middlewares.

4. Email Templates
I think having email templates as their own views allows for a more configurable email content. It's much better than hard-coding it in the services like in the tcuml file. The implementation uses Jade template.

5. Helper modules
I separated some functions into its own file, to better fulfill separation-of-concern.

6. Error handling
It's best practice to encapsulate all errors in the native Error objects. Express also has a great way to handle error by having a middleware that accepts 4 parameters (err, req, res, next) to send error response to the user. It also lets other middlewares not worrying about sending error response on their own.
