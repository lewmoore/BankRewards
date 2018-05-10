let path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

let config = {
  development: {
    root: rootPath,
    app: {
      name: 'rewards-ref-app-mvc'
    },
    port: 3000,
    CLIENT_ID:'ef6778befedb4311a4e211e75cf89f73',
    CLIENT_SECRET:'8546b3341ebdef7953164c34a7abe66c',
    REDIRECT_URI:'http://localhost:3000/authredirect',  //Replace this with the redirect uri entered in the developer portal
    BASE_URI:'https://api-sandbox.capitalone.com',
    SESSION_SECRET: 'thisisnowarandomstring' //Change this to a random string
  },

  test: {
    root: rootPath,
    app: {
      name: 'rewards-ref-app-mvc'
    },
    port: 3000,
  },

  production: {
    root: rootPath,
    app: {
      name: 'rewards-ref-app-mvc'
    },
    port: 3000,
  }
};

module.exports = config[env];
