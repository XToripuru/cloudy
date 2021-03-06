import express from 'express';

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.render("index");
});

app.listen(8080, () => {
    console.info("server running on port 8080");
});

