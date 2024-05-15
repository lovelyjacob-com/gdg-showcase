/**
 * Server module, used for local hosting only.
 * Production page is handled by GitHub pages.
 * - Requires Node.js (latest version recommend)
 */

// Import modules.
import express from 'express';
import open from 'open';
import getPort from 'get-port';

// Before we do anything, let's clean the console.
console.clear();

// Create the app.
const app = express();

// Get the port.
const port = await getPort({ port: 80 });

// Listen for requests.
app.use('/', express.static('src/client/', { extensions: ['html'] }));

// Listen for 404 requests.
app.use(function (_, response) {
    response.status(404).sendFile('src/client/404.html', { root: '.' });
});

// Start the app.
app.listen(port, () => console.log(`Server listening on port ${port}.`));

// Open the URL.
open(`http://localhost:${port}`);
