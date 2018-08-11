import githubAuth from '../services/githubAuth';

class NoAuthError extends Error {
  constructor(error) {
    super(error.message);
    // TODO redirect back
    // event.requestContext.path
    this.result = {
      statusCode: 302,
      headers: { Location: githubAuth.authorizeUrl() },
    };
  }
}

export default NoAuthError;
