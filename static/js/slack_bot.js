document.getElementById('userForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const slackId = document.getElementById('slackId').value;
  const name = document.getElementById('name').value;

  const payload = {
    slackId: slackId,
    name: name,
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

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
});