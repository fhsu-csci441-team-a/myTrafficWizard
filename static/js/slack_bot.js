document.getElementById('userForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const slackId = document.getElementById('slackId').value;
  const message = document.getElementById('message').value;

  const payload = {
    userID: slackId,
    formattedMessage: message,
  };

  try {
    // use '/slack/postMessage' for local run or full URL for deployed app
    const response = await fetch('https://mytrafficwizard.onrender.com/slack/postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data;
    if (response.headers.get('content-type').includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
});