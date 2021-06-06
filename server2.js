const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const posts = [
    {
    username:'Jim',
    title:"post 1"
},
{
    username:'Gem',
    title:"post 2"
},
]
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const authenticateToken = (req,res,next) =>{
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    console.log(authHeader.split(' ')[1]);
    
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
app.get('/posts',authenticateToken,(req,res) =>{ 
    //같은 이름의 유저 포스터만 조회
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login',(req,res) =>{
    const username = req.body.username;
    const user = {name: username}

    const accesToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accesToken:accesToken})
})



app.listen(4000)