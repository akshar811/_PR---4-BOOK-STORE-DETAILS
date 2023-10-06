const express = require("express");
const data = require("./db");
const Book = require("./schema");
const check = require("./check");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("welcome to the book store");
});

app.get("/books/book/:id", async (req, res) => {
  let { id } = req.params;
  let book = await Book.findById(id);
  if (book) {
    res.status(200).send(book);
  } else {
    res.status(404).send("Book not found");
  }
});

app.delete("/books/delete/:id", async (req, res) => {
  let { id } = req.params;
  let deletes = await Book.findByIdAndDelete(id);
  let data = await Book.find();
  console.log(deletes);
  res.send(data);
});

app.get("/books", async (req, res) => {
  let book = await Book.find(req.body);
  res.send(book);
});

app.post("/books/addbooks", check, async (req, res) => {
  let post = await Book.create(req.body);
  res.send(post);
});

app.patch("/books/update/:id", async (req, res) => {
  let { id } = req.params;
  let data = await Book.findByIdAndUpdate(id, req.body);
  let get = await Book.find();
  console.log(data);
  res.send(get);
});

app.get(`/books/filter`, async (req, res) => {
  let { author, category, title, sort } = req.query;
  let titleRegex = new RegExp(title, "i");

  if (author) {
    const authors = await Book.find({ author: author });
    res.send(authors);
  } else if (category) {
    const categorys  = await Book.find({ category: category });
    res.send(categorys);
  } else if (title) {
    const filter = await Book.find({ title: { $regex: titleRegex } });
    res.send(filter);
  } else if (sort == "lth") {
    const lth = await Book.find().sort({ price: 1 });
    res.send(lth);
  } else if (sort == "htl") {
    const htl = await Book.find().sort({ price: -1 });
    res.send(htl);
  }
});

app.listen(8090, () => {
  console.log("listening on server 8090");
  data();
});
