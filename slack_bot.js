fetch('https://my-traffic-wizard-node-js-2.onrender.com/postMessage')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });