document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const slackId = document.getElementById('slackId').value;
  const name = document.getElementById('name').value;

  const payload = {
    slackId: slackId,
    name: name,
  };

  // use '/postMessage' for local run or full URL for deployed app
  fetch('https://my-traffic-wizard-node-js-2.onrender.com/postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
});