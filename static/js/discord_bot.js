// Originally written and debugged by Nicole-Rene Newcomb

// used to test the sending of messages via Discord

document.getElementById('userForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const discordId = document.getElementById('discordId').value;
  const message = document.getElementById('message').value;

  const payload = {
    userID: discordId,
    formattedMessage: message,
  };

  try {
    // use '/discord/postMessage' for local run or full URL for deployed app
    const response = await fetch('https://mytrafficwizard.onrender.com/discord/postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Request succeeded');
    } else {
      console.log('Response is not ok', response.status);
    }
  } catch(err) {
    console.log("Error: " + err);
  }
});
