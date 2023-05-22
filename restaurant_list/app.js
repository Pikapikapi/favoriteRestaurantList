//require當中，如果沒有給定路徑，直接寫檔案名稱
//會自動先去node_modules的路徑下搜尋
//如果有給定路徑，則是在指定目錄下搜尋(e.g. 使用./則是在該檔案app.js的同一層路徑下尋找名為movieList.json的檔案)
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const routes = require('./routes')
const usePassport = require('./config/passport')
const methodOverrid = require('method-override')
const port = 3000

//using dotenv while run dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//connect to mongoDB
require('./config/mongoose')
const app = express()
// express template engine
// handlebars 使用的模板與使用HTML相似，就不用像下面寫一整串難維護難看的排版了
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//setting static files
app.use(express.static('public'))
app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true,
  })
)
//add body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverrid('_method'))
usePassport(app)
app.use(routes)
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
