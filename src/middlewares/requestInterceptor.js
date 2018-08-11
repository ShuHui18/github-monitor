
async function requestInterceptor(event, action, ...middlewares) {
  try {
    await middlewares[0](event);
    // await Promise.all(middlewares.forEach(middleware => middleware(event)));
    return action(event);
  } catch (err) {
    console.log(err.message);
    if (err.result) {
      return err.result;
    }
    throw err;
  }
}

export default requestInterceptor;
