import url from 'url';;
import { branchCheck } from './branchCheckController';

function signin(event, context, callback) {
  const location = url.format({
    protocol: 'https',
    hostname: 'github.com',
    pathname: '/login/oauth/authorize',
    query: {
      client_id: 'f5f40bab8debde6aeb24',
    }
  });
  const result = {
    statusCode: 302,
    headers: {'Location': location.toString()},
  };
  callback(null, result);
}

function get(event, context, callback) {
  const code = event.queryStringParameters.code;
  // https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
  branchCheck(code).then( (contents) => {
    const result = {
      statusCode: 200,
      body: contents,
      headers: {'content-type': 'text/html'}
    };
    callback(null, result);
  }).catch(console.log);
};

export { signin, get };
