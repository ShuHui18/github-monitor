import githubAuth from './services/githubAuth';
import authorization from './middlewares/authorization';
import { branchCheck, pr } from './branchCheckController';
import requestInterceptor from './middlewares/requestInterceptor';

async function createPr(event, context, callback) {
  const result = await requestInterceptor(event, pr, authorization.check);
  callback(null, result);
}

async function oauth(event, context, callback) {
  const token = await githubAuth.accessToken(event.queryStringParameters.code);
  const result = {
    statusCode: 302,
    headers: {
      Location: '/',
      'Set-Cookie': `access_token=${token}`,
    },
  };
  callback(null, result);
}

async function repoList(event, context, callback) {
  const result = await requestInterceptor(event, branchCheck, authorization.check);
  callback(null, result);
}


export { createPr, oauth, repoList };
