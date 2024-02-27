// Test of Slack postMessage functionality

const http = require('http');

const data = JSON.stringify({
  slackId: 'U06HQP5JN1X',
  message: 'Updated message!'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/slack/postMessage',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();