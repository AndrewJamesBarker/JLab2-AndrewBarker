//import required modules

const express = require("express"); 

const path = require("path");

const { MongoClient, ObjectId } = require("mongodb");

//Mongo config stuff

const dbUrl = "mongodb://127.0.0.1:27017";
const client = new MongoClient(dbUrl);


//set up Express object and port

const app = express();
const port = process.env.PORT || "8888";

//Set up template engine

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Set up static file paths

app.use(express.static(path.join(__dirname, "public")));


//page routes

var links = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "About",
      path: "/about"
    }
  ];

//test express app

app.get("/about", async (req, res) => {
    links = await getLinks();
    res.render("about", {title: "About", menu: links });
})

app.get("/", async (req, res) => { 
links = await getLinks();
 res.render("index", {title: "Home", menu: links});
});


app.get("/admin/menu/add", async (req, res) => { 
    links = await getLinks();
     res.render("menu-add", {title: "Home", menu: links});
    });


app.get("/admin/menu", async (req, res) => {
    links = await getLinks();
})



// form processing paths

app.post("/admin/menu/add/submit", async(req,res) => {
//for a post form the data is retrieved through the body
//req.body.<field.name>
let newLink = {
    weight: req.body.weight,
    path: req.body.path,
    name: req.body.name
}

await addlink(newLink);
res.redirect("/admin/menu");
});

app.get("/admin/menu/delete", async (req,res) => {
    //for a get form the data is passed in request.query
    await deletelink(req.query.linkId);
    res.redirect("/admin/menu");
});

app.get("/admin/menu/add", async(req,res) => {
links = await getLinks();
res.render("menu-add", { title: "Add menu link", menu: links});
});

app.get("/admin/menu/edit", async(req,res) => {
    links = await getLinks();
    res.render("menu-edit", { title: "Edit menu link", menu: links});
    });

//set up server listening

app.listen(port, () => {
console.log(`Listening on http://localhost:${port}`);
});


app.post("/admin/menu/edit/submit", async(req, res) => {
    //get the id
    //get the weight/path/name value from the form and use for the doc to update
    let link = {
        weight: FORM_VALUE,
        path: FORM_VALUE,
        name: FORM_VALUE
    };
});
// Mongo functions

// function to connect to the db and return the test db database

async function connection() {
    await client.connect();
    db = client.db("testdb");
    return db;
}

// function to select all docs from menulinks

async function getLinks() {
    db = await connection(); 
    var results = db.collection("menuLinks").find({});
    res = await results.toArray(); // convert to array
    return res;
}

async function addlink(link) {
    db = await connection();
    await db.collection("menuLinks").insertOne(link);
    console.log("link added");
}

async function deletelink(id) {
db = await connection();
const deleteIdFilter = {_id: new Object(id) };
const result = db.collection("menuLinks").deleteOne(deleteIdFilter);
if(result.deletedCount === 1)
console.log("delete successfull");
}

//function to select a singl doc from menu link

async function getSingleLink(id) {
db = await connection();
const editIdFilter = {_id: new ObjectId(id) };
const result = db.collection("menuLinks").findOne(editIdFilter);
console.log(result);
return result;
}

//function to update a given link
// async function editLink() {
    
// }