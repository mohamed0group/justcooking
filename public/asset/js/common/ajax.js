const dataFormat = obj => {
  if (typeof obj !== 'object') {
    return '';
  }

  let arr = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      arr.push(window.encodeURIComponent(key) + '=' + window.encodeURIComponent(element));
    }
  }
  return arr.join('&');
}

/**
 * AJAX
 * 
 * @param {Object} options 
 */
export default options => {
  if (!options.method || !options.url) return;
  let request = new XMLHttpRequest();
  request.open(options.method, options.url + '?' + dataFormat(options.data));
  request.timeout = 30000;
  if (options.method.toLowerCase() === 'post') {
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }
  if (options.timeout) {
    request.timeout = options.timeout;
  }
  if (options.dataType) {
    request.responseType = options.dataType;
  }
  request.addEventListener('readystatechange', (e) => {
    if (request.readyState === 4 && request.status === 200 && request.response) {
      options.success && options.success(request.response);
    } else if (request.status === 404) {
      options.error(e);
    }
  });
  if (options.error) {
    request.addEventListener('error', (e) => {
      options.error(e);
    });
    request.addEventListener('timeout', (e) => {
      options.error(e);
    });
  }
  request.send(options.data ? options.data : null);
}