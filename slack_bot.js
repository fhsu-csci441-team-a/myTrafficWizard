fetch('https://my-traffic-wizard-node-js.onrender.com/postMessage')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });