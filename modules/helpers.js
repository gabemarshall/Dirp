exports.parseCookieString = function (cookies) {
  let cooks = "";
  cookies = cookies.split(';');
  for (i = 0; i < cookies.length; i++) {
    cookie = cookies[i].trim();
    if (cookie) {
      cooks += cookie + ";";
    }
  }
  return cooks;

}