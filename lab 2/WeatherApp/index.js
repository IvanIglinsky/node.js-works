const express = require('express')
const hbs=require('hbs')
const fetch=require('node-fetch')
const url = require ( "url" );
const app = express()
app.set('view engine','hbs')
const port = 3000

app.get('/', (req, res) => {

    res.render('main.hbs')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/weather(/:city?)',async (req,res)=>{
    let city=req.params.city;
    if(!city){
        res.render('Main.hbs')
        return;
    }
   // let key='189baf0d60cdb6e0978064b183e364c0';
    let key='b5018676b6c9e7d01aa7056fd2b9186d'
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
    let response=await fetch(url)
    let weather=await response.json()
    res.render('weather.hbs',{city,weather})
});
