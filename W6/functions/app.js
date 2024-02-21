
const path = require('path');
const express = require(`express`);
const serverless = require("serverless-http");
const app = express();
const fs = require(`fs`);
const hbs = require(`hbs`);
const bodyParser = require('body-parser');
app.set(`view engine`, `hbs`);
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + `/views/partials`, (err) => {});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mongo DB -- Week 6
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://acastro:acastro@empl.0o9xly3.mongodb.net/Empl";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // 5s for timeout, aise tiimer if needed. 
}).then(() => {
  console.log("Connected to MongoDB!");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

// import scheme for the mongoDb atlas
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  department: String,
  startDate: Date,
  jobTitle: String,
  salary: Number,
});
const Employee = mongoose.model('Employee', employeeSchema);

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes (was quite confusing and gave me headaches, but it works now and I wont question how!)
app.get("/", (req, res) => {
  res.render("index");
});
app.get('/employees', (req, res) => {
  Employee.find()
    .then((employees) => {
      res.render("employees", { employees: employees });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Serverr didnt respond.");
    });
});
app.post('/employees', (req, res) => {
  const newEmployeeData = req.body;
  Employee.create(newEmployeeData)
    .then(() => {
      res.redirect('/employees'); 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error inserting empl: " + err.message); // Send detailed error message to client
    });
});
app.get('/employees/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    res.render('edit', { employee });
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverr didnt respond.");
  }
});
app.post('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = req.body;
    await Employee.findByIdAndUpdate(id, updatedEmployee, { new: true });
    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erroor updating empl: " + err.message);
  }
});
app.post('/employees/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting empl: " + err.message);
  }
});


//////////////////////////////

// Default local port for local testing
// const localPort = 86;

// env var for netlify port
port = process.env.PORT // || localPort;

// run the server on netlify or locally (node app.js)
app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});

// Export the Express app as a serverless function
module.exports.handler = serverless(app);
