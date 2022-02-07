const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const createJSON = (message, id) => {
  let json = `{"message": "${message}"`;

  if (id) { json += `,"id":"${id}"`; }

  json += '}';

  return json;
};

const createXML = (message, id) => {
  let xml = `<response><message>${message}</message>`;

  if (id) { xml += `<id>${id}</id>`; }

  xml += '</response>';

  return xml;
};

const getPage = (request, response, code, type, data) => {
  response.writeHead(code, { 'Content-Type': type });
  response.write(data);
  response.end();
};

const getIndex = (request, response) => {
  getPage(request, response, 200, 'text/html', index);
};

const getStyle = (request, response) => {
  getPage(request, response, 200, 'text/css', style);
};

const getSuccess = (request, response, accept) => {
  let data;
  if (accept.includes('text/xml')) {
    data = createXML('This is a successful response');
  } else {
    data = createJSON('This is a successful response');
  }

  getPage(request, response, 200, (accept.includes('text/xml') && 'text/xml') || 'application/json', data);
};

const getBadRequest = (request, response, accept, params) => {
  const code = (params.valid === 'true' && 200) || 400;

  let data;
  if (accept.includes('text/xml')) {
    if (code === 200) {
      data = createXML('This is a successful response');
    } else {
      data = createXML('Missing valid query parameter set to true', 'badRequest');
    }
  } else if (code === 200) {
    data = createJSON('This is a successful response');
  } else {
    data = createJSON('Missing valid query parameter set to true', 'badRequest');
  }

  getPage(request, response, code, (accept.includes('text/xml') && 'text/xml') || 'application/json', data);
};

const getUnauthorized = (request, response, accept, params) => {
  const code = (params.loggedIn === 'yes' && 200) || 401;

  let data;
  if (accept.includes('text/xml')) {
    if (code === 200) {
      data = createXML('This is a successful response');
    } else {
      data = createXML('Missing loggedIn query parameter set to yes', 'unauthorized');
    }
  } else if (code === 200) {
    data = createJSON('This is a successful response');
  } else {
    data = createJSON('Missing loggedIn query parameter set to yes', 'unauthorized');
  }

  getPage(request, response, code, (accept.includes('text/xml') && 'text/xml') || 'application/json', data);
};

const getForbidden = (request, response, accept) => {
  let data;
  if (accept.includes('text/xml')) {
    data = createXML('You do not have access to this content', 'forbidden');
  } else {
    data = createJSON('You do not have access to this content', 'forbidden');
  }

  getPage(request, response, 403, (accept.includes('text/xml') && 'text/xml') || 'application/json', data);
};

const getInternal = (request, response, accept) => {
  let data;
  if (accept.includes('text/xml')) {
    data = createXML('Internal Server Error. Something went wrong.', 'internalError');
  } else {
    data = createJSON('Internal Server Error. Something went wrong.', 'internalError');
  }

  getPage(request, response, 500, (accept.includes('text/xml') && 'text/xml') || 'application/json', data);
};

const getNotImplemented = (request, response, accept) => {
  let data;
  if (accept.includes('text/xml')) {
    data = createXML('A get request for this page has not been implemented yet. Check again later for updated content.', 'notImplemented');
  } else {
    data = createJSON('A get request for this page has not been implemented yet. Check again later for updated content.', 'notImplemented');
  }

  getPage(request, response, 501, (accept.includes('text/xml') && 'text/xml') || 'application/json', data);
};

const notFound = (request, response, accept) => {
  let data;
  if (accept.includes('text/xml')) {
    data = createXML('The page you are looking for was not found.', 'notFound');
  } else {
    data = createJSON('The page you are looking for was not found.', 'notFound');
  }

  getPage(request, response, 404, (accept.includes('text/xml') && 'text/xml') || 'application/json', data);
};

module.exports = {
  getIndex,
  getStyle,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  notFound,
};
