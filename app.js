const fs = require("fs");
const path = require("path");
const express = require("express");
const uuid = require("uuid");
const app = express();

app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded({extended : false}))

app.get("/", function (req, res) {
  res.render('index');
});

app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json");
  const restaurant_json_file = fs.readFileSync(filePath);
  const restaurants_as_js_object = JSON.parse(restaurant_json_file);
  res.render('restaurants', {numberOfRestaurant : restaurants_as_js_object.length, restaurants : restaurants_as_js_object});
});

app.get("/restaurants/:id", function (req, res) {
  const restaurantID = req.params.id;
  const jsonPath = path.join(__dirname, "data", "restaurants.json");
  const fileData = fs.readFileSync(jsonPath);
  const restaurants = JSON.parse(fileData);

  for(const restaurantItem of restaurants) {
    if(restaurantID === restaurantItem.id) {
     return res.render('restaurant-detail', {restaurant : restaurantItem});
     
    }
    res.render('404');
  }
  });


app.get("/recommend", function (req, res) {
  res.render('recommend');
});
app.post("/recommend", (req, res) => {
  const restaurant = req.body;
  restaurant.id = uuid.v4(); 
  const filePath = path.join(__dirname, "data", "restaurants.json");
  const restaurant_json_file = fs.readFileSync(filePath);
  const restaurants_as_js_object = JSON.parse(restaurant_json_file);
  restaurants_as_js_object.push(restaurant);
  fs.writeFileSync(filePath, JSON.stringify(restaurants_as_js_object));
  res.render('confirm');
});

app.get("/confirm", function (req, res) {
  res.render('confirm');
});

app.get("/about", function (req, res) {
  res.render('about');
});

app.use((req,res)=>{
  res.status(404).render('404');

})

app.use((error, req,res,next) =>{
  res.status(500).render('500');

})
app.listen(3000);
