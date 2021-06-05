const {
  error
} = require("console");
const express = require("express");
const app = express();
//const fs = require("fs")
app.use(express.json())
const {
  promises: {
    writeFile
  }
} = require("fs");
const {
  promises: {
    readFile
  }
} = require("fs");


const quotes = require("./quotes.json");

app.get('/', function (request, response) {
  response.send('hello server up')
});

app.get("/quotes", function (request, response) {
  response.json(quotes);
});

app.get("/quotes/:id", (req, res) => {
  let id = parseInt(req.params.id);
  const isANumber = !isNaN(id);
  if (isANumber && id >= 0) {
    id = parseInt(req.params.id);
    let quote = quotes.find((i) => i.id == id);
    if (quote) {
      // si existe
      res.json(quote);
    } else {
      // si no existe
      res.status(404).send(`quote with id=${id} not found`);
    }
  } else {
    res.status(400).send("id must be equal or larger than 0!");
  }
});

app.post("/quotes/add", (req, res) => {
  const newQuotes = req.body
  console.log(newQuotes)
  newQuotes.id = Math.max(...quotes.map((q) => q.id)) + 1;
  quotes.push(newQuotes);
  fs.writeFileSync("quotes.json", JSON.stringify(quotes, null, 2))
  res.status(201).json(quotes);

});
app.put("/quotes/update/:id", async (req, res) => {
  try {
    id = parseInt(req.params.id)
    upDate = req.body
    quotesFind = quotes.find((quote) => quote.id === id)
    quotesFind.author = upDate.author
    quotesFind.quote = upDate.quote
    await writeFile("quotes.json", JSON.stringify(quotes, null, 2))
    res.status(201).json(quotes)

  } catch (err) {
    res.status(400).json(err)
    console.error(err.message)
  }
})

/* app.put("/quotes/update/:id", (req, res)=> {
  id = parseInt(req.params.id)
  upDate =req.body
  quotesFind= quotes.find((quote) => quote.id === id )
  quotesFind.author= upDate.author
  quotesFind.quote= upDate.quote
  fs.writeFileSync("quotes.json", JSON.stringify(quotes, null ,2))
  res.status(201).json(quotes);
}) */

app.delete("/quotes/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id)
    //quotesFind = quotes.find((quote) => quote.id === id)
    let removeJson = (arr, item) => {

      let i = arr.map(obj => obj.id).indexOf(item)
      if (i !== -1) {
        arr.splice(i, 1);
      }
    }
    removeJson(quotes, id)
    await writeFile("quotes.json", JSON.stringify(quotes, null, 2))
    res.status(200).json(quotes)
  } catch (err) {
    res.status(404).json(err)
    console.err(err.message)
  }
})
/* function removeItemFromArr ( arr, item ) {
  var i = arr.indexOf( item );

  if ( i !== -1 ) {
      arr.splice( i, 1 );
  }
} */








app.listen(5000, () => console.log("Listening on port 5000"));