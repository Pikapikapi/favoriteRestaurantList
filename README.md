# favoriteRestaurantList
##my favorite restaurant 

a website you can make your own pocket list in convenience way

![index](https://user-images.githubusercontent.com/12609595/222797216-58613f94-e18a-469f-8837-cbfbf2de5685.png)


##install step

1. clone repo into your computer
2. npm install
3. npm install -g nodemon
   //if you don't have nodemon  -g will setting nodemon to global that you won't to install again while running another nodemon repo
4. create and setting your mongoDB link in /favoriteRestaurantList/restaurant_list/.env
   //MONGODB_URI=your mongoDB connection
5. npm run seed
   //this will build the data into your mongoDB  
6. npm run dev

##dependencies

  "dependencies": {
    "body-parser": "^1.20.1",
    "express": "^4.16.4",
    "express-handlebars": "^3.0.0",
    "method-override": "^3.0.0",
    "mongoose": "^5.9.16"
  },
  "devDependencies": {
    "dotenv": "^16.0.3"
  }
