// 1. Request the data from your Node.js backend port
fetch('http://localhost:3000')
  .then(response => response.json()) // 2. Parse the text stream back into a JS object
  .then(jsonData => {
      // 3. Select your empty HTML container
      const container = document.getElementById('ui-container');
      
      // 4. Create new HTML elements programmatically
      const heading = document.createElement('h2');
      heading.textContent = jsonData.message; // Injects "Welcome to our server"
      
      const badge = document.createElement('span');
      badge.textContent = `Status: ${jsonData.status}`; // Injects "Status: success"
      
      // 5. Append these elements to update the web DOM actively
      container.appendChild(heading);
      container.appendChild(badge);
  })
  .catch(error => console.error('Error fetching data:', error));
