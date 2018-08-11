import NoAuthError from '../errors/noAuthError';

class Authorization {
  async check(event) {
    if (event.headers.Cookie) {
      const cookies = event.headers.Cookie.split(';');
      const hasAccess = cookies.some((cookieStr) => {
        const cookie = cookieStr.trim().split('=');
        if (cookie[0] === 'access_token') {
          event.accessToken = cookie[1];
          return true;
        }
        return false;
      });
      if (hasAccess) return;
    }
    throw new NoAuthError('please sign in');
  }
}

export default new Authorization();
