import express from "express";
import path from "path";
import bcrypt from 'bcrypt';
import passport from "passport";
import passportLocal from 'passport-local';
import session from "express-session";
import Users from "./models/Users.js";
import mongoose from "mongoose";
import Product from "./models/Products.js";

const db = "mongodb+srv://razmiqayelyan:{your password}@cluster0.2jceo.mongodb.net/pay-shop?retryWrites=true&w=majority"
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Mongoose connected Successfully')).catch((err) => console.log(err))


const app = express()


app.use(express.json())
app.use(session({
    secret: 'wadwadwafwa',
    resave:false,
    saveUninitialized: false,
    cookie: { maxAge: 600000000 }
}))
app.use(express.static(path.resolve('html')));
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy({
    usernameField: 'email'
}, async (email,password,done) => {
    // let user = users.find((user) => user.email === email)
    const user = await Users.findOne({email : email})
    
    if(user === null){
        return done(null, null , {message: 'incorrect email'})
    }
    else if(await bcrypt.compare(password, user.password)){
        return done(null, user)

    }
    done(null ,null , {message: 'incorrect passwors'})
}))
passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser( async (id, done) => {
    // done(null, users.find((user) => user.id === id))
    done(null, await Users.findOne({_id : id}))
})


app.get('/', isAuth, (req,res) => {
    res.sendFile(path.resolve('html/profile.html'))
})

app.get('/get-username',isAuth,  (req, res) => {
    res.send({ username: req.user.username })
})



app.get('/login',isNotAuth,  (req,res) => {
    res.sendFile(path.resolve('html/login.html'))
})
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))




app.get('/register',isNotAuth, async (req,res) => {
    res.sendFile(path.resolve('html/register.html'))
})
app.post('/register', async (req,res) => {
    const password = await bcrypt.hash(req.body.password, 10)
    const user = new Users( {
        username: req.body.name,
        email: req.body.email,
        password,
    })
    user.save()
    .then(() => console.log(user))
    .catch((err) => console.log(err))
    res.redirect('/login')
})

app.post('/logout', function(req, res){
    req.logout();
    res.redirect('/register') 
});

function isAuth(req, res , next){
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    next()
}
function isNotAuth(req, res , next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

// TODOS


app.get('/products', isAuth, async (req,res) =>  {
    console.log(req.user.username)
    const products = await Product.find({username : req.user.username })
    res.send(products)
})
app.post('/products', isAuth ,(req, res) => {
    const {text, price} = req.body
    const product = new Product({username : req.user.username ,text: text, price: price})
    product.save()
    .then((result) => res.send(result))
    .catch((err) => console.log(err))
})

app.get('/products/:id', isAuth,  (req, res) => {
    let product = Product.findOne( {_id : req.params.id})
    if(product){
        return res.send(product)
    }
    res.send("Products not Found")
})

// app.patch('/products/:id', (req,res) => {
//     let todo = todos.find(todo => todo.id === +req.params.id)
//     if(todo && req.body){
        
//        console.log(todos[todo])
//     }
// })

app.listen(6969)