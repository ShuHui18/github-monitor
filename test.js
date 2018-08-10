// import {branchCheck} from './src/branchCheckController';

// branchCheck().then(console.log)

let url = require('url');

let a = url.format({
  protocol: 'https',
  hostname: 'github.com',
  pathname: '/login/oauth/authorize',
  query: {
    client_id: 'f5f40bab8debde6aeb24',
  }
})

console.log(a.toString());