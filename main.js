var express = require('express')
var app = express()
app.set("view engine","ejs")
app.set('views',__dirname+'/views')
const database =require("./routes/database")

var bodyParser= require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use("/",database)
// app.get('/',function(req,res){
//     res.render("home",{})

// })

// app.get('/test',function(req,res){
//     res.send("test")
// })




var server = app.listen(8080,function()
{
    const host = server.address().address
    const port = server.address().port
    console.log("address http://%s:%s", host, port)
}
)