const respond = (request, response, status, object, type) => {
  let content = object;
  if (type === 'application/json') {
    content = JSON.stringify(object);
  }

  const headers = {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  response.writeHead(status, headers);

  response.write(content);
  response.end();
};

const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  if (request.headers.accept === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${responseJSON.message} </message>`;
    responseXML += '</response>';

    return respond(request, response, 200, responseXML, request.headers.accept);
  }

  // this ends up being the default, has to explicitly have the type spelt out for when directly
  // going to the URL
  return respond(request, response, 200, responseJSON, 'application/json');
};

const badRequest = (request, response) => {
  const responseJson = {};
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  if (parsedUrl.searchParams.get('valid') === 'true') {
    responseJson.message = 'This request has the required parameters';
    return respond(request, response, 200, responseJson, 'application/json');
  }

  // console.log(request.headers.accept);
  // const responseJson = {
  //   message: 'Missing valid query parameter set to true',
  //   id: 'bad request',
  // };

  // if (valid) {

  // }

  responseJson.message = 'Missing valid query parameter set to true';
  responseJson.id = 'bad request';

  if (request.headers.accept === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${responseJson.message} </message>`;
    responseXML += `<id>${responseJson.id}</id>`;
    responseXML += '</response>';

    return respond(request, response, 400, responseXML, request.headers.accept);
  }

  return respond(request, response, 400, responseJson, 'application/json');
};

const unauthorized = (request, response) => {
  const responseJson = {};
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  if (parsedUrl.searchParams.get('loggedIn') === 'yes') {
    responseJson.message = 'You have successfully viewed the content';
    return respond(request, response, 200, responseJson, 'application/json');
  }
  // const responseJson = {
  //   message: 'Missing loggedIn query parameter set to yes',
  //   id: 'unauthorized',
  // };

  responseJson.message = 'Missing loggedIn query parameter set to yes';
  responseJson.id = 'unauthorized';

  if (request.headers.accept === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${responseJson.message} </message>`;
    responseXML += `<id>${responseJson.id}</id>`;
    responseXML += '</response>';

    return respond(request, response, 401, responseXML, request.headers.accept);
  }

  return respond(request, response, 401, responseJson, 'application/json');
};

const forbidden = (request, response) => {
  const responseJson = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };

  if (request.headers.accept === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${responseJson.message} </message>`;
    responseXML += `<id>${responseJson.id}</id>`;
    responseXML += '</response>';

    return respond(request, response, 403, responseXML, request.headers.accept);
  }

  return respond(request, response, 403, responseJson, 'application/json');
};

const internal = (request, response) => {
  const responseJson = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  if (request.headers.accept === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${responseJson.message} </message>`;
    responseXML += `<id>${responseJson.id}</id>`;
    responseXML += '</response>';

    return respond(request, response, 500, responseXML, request.headers.accept);
  }

  return respond(request, response, 500, responseJson, 'application/json');
};

const notImplemented = (request, response) => {
  const responseJson = {
    message: 'A get request for this page has not been implemented yet. Check again later',
    id: 'notImplemented',
  };

  if (request.headers.accept === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${responseJson.message} </message>`;
    responseXML += `<id>${responseJson.id}</id>`;
    responseXML += '</response>';

    return respond(request, response, 501, responseXML, request.headers.accept);
  }

  return respond(request, response, 501, responseJson, 'application/json');
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  if (request.headers.accept === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${responseJSON.message} </message>`;
    responseXML += `<id>${responseJSON.id}</id>`;
    responseXML += '</response>';

    return respond(request, response, 404, responseXML, 'text/xml');
  }
  return respond(request, response, 404, responseJSON, 'application/json');
};

module.exports = {
  success,
  notFound,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
};
