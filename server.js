require('dotenv').config()
const express = require("express");
const https = require("https");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static("public"));

const newDate = new Date();
const todayDate = newDate.getDate();
const todayMonth = newDate.getMonth() + 1;
const today = todayDate+"/"+todayMonth;

var city = "Delhi";
const id= process.env.ID;

app.get("/", (req, res) => {
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" +id+ "&units=metric";

  https.get(url, (response) => {
    response.on('data', (d) => {

      const weatherData = JSON.parse(d);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const country = weatherData.sys.country;
      const wurl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";

      res.render('main', {
        linkIco : wurl,
        temp: temp,
        desc: description,
        city: city,
        date: today,
        country:country
      })
    });
  });
})

app.post("/", (req, res) => {
   city = req.body.search;
  res.redirect("/");
})

app.get("*", (req, res) => {
  res.send("Page not found.")
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
