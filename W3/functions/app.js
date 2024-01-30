//Set up express
const express = require(`express`);
const serverless = require('serverless-http');
const app = express();
//Include the file system functions
const fs =require(`fs`);
//Include and set the hbs (handlebars) view engine
const hbs = require(`hbs`)
app.set(`view engine`,`hbs`)
//register the location of partial snippets for the view engine
hbs.registerPartials(__dirname + `/views/partials`,(err)=>{})
//Uses extended url capability
app.use(express.urlencoded({extended:true}));
//add the static asset folder
app.use(express.static(`${__dirname}/public`));
//allow express json functionality
app.use(express.json())

//path to the data folder
const data = `../data`

//Route to the root directory. Displays the text in browser
// app.get(`/`, (req, res) => {
//     res.send(`<title> W1 </title><h2>Welcome to my first Node 
//     application</h2>`);
// });

function dynTable(gridSize) {
    var notice = '<h1>Your generated table</h1> <a href="/"> Go Back</a>';
    var table = '<table style="height: 45%; width: 45%; border: 5px solid;">';
    for (var i = 0; i < gridSize; i++) {
        table += '<tr>';
        for (var j = 0; j < gridSize; j++) {
            var color = ((1<<24)*Math.random()|0).toString(16);
            table += '<td style="text-align: center; background-color: #' + color + ';">' + color + '<br /><span style="color: #ffffff;">' + color + '</span></td>';
        }
        table += '</tr>';
    }
    table += '</table>';
    return notice + table;
}


//Route used by form. Displays text input in the browser
app.post('/dynTable', (req, res) => {
    var gridSize = req.body.gridSize;
    var table = dynTable(gridSize);
    res.send(table);
});


//Route with parameters.Reads JSON file and displays the selected id from the class.json file
/*app.get(`/:file/:id`, (req,res)=>{
    fs.readFile(
        `${data}/${req.params.file}.json`, 
        `utf8`, 
        (err, data)=>{
            if(err){
                throw err;
            }
            const id = req.params.id
            res.send({"name":JSON.parse(data)[id]});
        })
})*/

//Route to /class. Reads JSON file and displays data in the browser
app.get(`/class`, (req, res) => {
    fs.readFile(
        `${__dirname}/${data}/class.json`, // Adjusted path to class.json
        `utf8`,
        (err, data) => {
            if (err) {
                throw err;
            }
            res.send(JSON.parse(data));
        }
    );
});

// ----- FOR WEEK 1 -----
// ROUTE TO NON-EXISTING PAGE; 404 ERROR; FOR NETLIFY.
app.use((req, res) => {
    res.status(404).send(`
        <title> Error </title>
        <a href="/">HOME</a>
        <h2>404 Error</h2>
        <p>Page not found.</p>
    `);
});

//Route with parameters. Displays first and last name in browser
app.get(`/:last/:first`, (req,res)=>{
    res.render(`farts`,{first:req.params.first, last:req.params.last,rules:`rules`})
})

/* // Default local port for local testing
const localPort = 89;

// env var for netlify port
// let port = process.env.PORT // || localPort;

// run the server on netlify or locally (node app.js)
app.listen(localPort, () => {
    console.log(`Server Running at http://localhost:${localPort}`);
});


// Export the Express app as a serverless function
module.exports.handler = serverless(app); */