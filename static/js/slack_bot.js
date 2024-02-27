document.getElementById('userForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const slackId = document.getElementById('slackId').value;
  const message = document.getElementById('message').value;

  const payload = {
    slackId: slackId,
    message: message,
  };

  try {
    const response = await fetch('/slack/postMessage', {
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