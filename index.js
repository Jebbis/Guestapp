const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Routes for each page to push when opened
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Home</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
      </head>
      <body>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
          <a class="navbar-brand" href="/">Guestbook</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/guestbook">View Messages</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/newmessage">Add a Message</a>
              </li>
            </ul>
          </div>
        </nav>
        <div class="col text-center">
          <h1>Welcome to the Yellow Tavern House</h1>
          <img src="https://images.unsplash.com/photo-1602348143971-0c5c97d23367?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=896&q=80" alt="Tavern house">
        </div>
      </body>
    </html>
  `);
});

app.get('/guestbook', (req, res) => {
  const data = fs.readFileSync('./data.json');
  const guestbook = JSON.parse(data);


  // Lets create the table for new messages in guestbook
  let table = `
    <table class="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">Username</th>
          <th scope="col">Country</th>
          <th scope="col">Message</th>
        </tr>
      </thead>
      <tbody>
  `;
  guestbook.forEach(entry => {
    table += `
      <tr>
        <td>${entry.username}</td>
        <td>${entry.country}</td>
        <td>${entry.message}</td>
      </tr>
    `;
  });
  table += '</tbody></table>';

  res.send(`
    <html>
      <head>
        <title>Guestbook</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
      </head>
      <body>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
          <a class="navbar-brand" href="/">Guestbook</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/guestbook">View Messages</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/newmessage">Add a Message</a>
              </li>
            </ul>
          </div>
        </nav>
        <div class="container">
          <h1>Guestbook Messages</h1>
          ${table}
        </div>
      </body>
    </html>
  `);
});

app.get('/newmessage', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Add a Message</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
      </head>
      <body>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
          <a class="navbar-brand" href="/">Guestbook</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/guestbook">View Messages</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/newmessage">Add a Message</a>
              </li>
            </ul>
          </div>
        </nav>
        <div class="container">
          <h1>Add a Message</h1>
          <form action="/newmessage" method="POST">
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" class="form-control" id="username" name="username" required>
            </div>
            <div class="form-group">
              <label for="country">Country:</label>
              <input type="text" class="form-control" id="country" name="country" required>
            </div>
            <div class="form-group">
              <label for="message">Message:</label>
              <textarea class="form-control" id="message" name="message" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/newmessage', (req, res) => {
  var data = require(__dirname + "/data.json");
  if (!req.body.username || !req.body.country || !req.body.message) {
    return res.status(400).send('All fields are required');
  }

  data.push({
    username: req.body.username,
    country: req.body.country,
    message: req.body.message,
  });

  var jsonStr = JSON.stringify(data);

  fs.writeFile(__dirname + "/data.json", jsonStr, err => {
    if (err) throw err;
    console.log("It's saved!");
    console.log(data);
  });

  console.log('Message added successfully');
  res.redirect('/guestbook');

});

// Open server on the port 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
