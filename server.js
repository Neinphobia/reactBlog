const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');



app.use(bodyParser.json());
app.use(cors());
mongoose.connect('mongodb+srv://admin:E0el8liBiIgSzqoD@customers.dnpgiql.mongodb.net/Customers?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
  name: String,
  body: String,
  img: String,
  ytlink:String
});

const Blog = mongoose.model('Blog', blogSchema);

app.get('/blogs', (req, res) => {
 Blog.find({}, (err, blogs) => {
  if (err) {
    res.status(400).send(err);
  } else {
    const sortedBlogs = blogs.sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp());
    res.status(200).send(sortedBlogs);
  }
});

});

app.post('/blogs', (req, res) => {
  const blog = new Blog({
    name: req.body.name,
    body: req.body.body,
    img:req.body.img,
    ytlink:req.body.ytlink
  });
  blog.save((err, blog) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(blog);
    }
  });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndRemove(id, (error, data) => {
    if (error) {
      return res.send(error);
    }

    const response = {
      message: "Blog successfully deleted",
      id: data._id
    };

    return res.status(200).send(response);
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
