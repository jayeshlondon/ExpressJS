const express = require('express');
const app = express();
const myMiddleware= require('./my-middleware.js');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const { matchedData ,sanitizeBody } = require('express-validator');

app.use(express.static('public'));
app.listen(8089, ()=> {
    console.log("Server started on port 8089");
});

app.get("/files", (req, res)=> {
    res.sendFile(__dirname + '/public/main.html');
});

// Routing
app.get("/users/:Id?", (req, res)=> {
    console.log(req.params);
    if(req.params.Id == undefined) {
        res.send("<h1>no user found</h1>")
    }else {
        res.send("<h1>User Id " + req.params.Id + "</h1>");
    }
});

// Routing From:-To:
app.get("/flights/:From?-:To?", (req, res)=> {
    console.log(req.params);
    if(req.params.From && req.params.To == undefined) {
        res.send("<h1>no flights found</h1>");
    }else {
        res.send("<h1>From: " + req.params.From+ "<br>"+ "To: " + req.params.To + "</h1>");
    }
    
});

// Pattern, Parameter and Slash character
app.get("/ab(*)cd", (req, res)=> {
    console.log(req.params);
    res.send("<h1>your pattern is working "+ req.params[1] +"</h1>");
});

// Middleware 
const Validation = (req, res, next)=> {
    req.params.user == "jay" ? console.log('Valid User') : console.log('Invalid User');
    next();
}

app.use(myMiddleware({ option1: '1', option2: '2' }));

app.get("/auser/:user", Validation, (request, response)=> {
    let data = "";
    for(let i=0; i<1;i++) {
        data = data + "<h1> Active user : " + request.params.user+"</h1>";
    }
    response.send(data);
}); 

//using querystring 
app.get("/welcome", (request, response) => {
    let msg = request.query.message; 
    let t = request.query.times;
    let data = "";
    if(msg === undefined) {
        msg = "Hello";
    }
    if(t === undefined) {
        t = 5;  
    } else {
        t = parseInt(t);
    }
    for(let i=0; i<t; i++) {
        data += "<h1>" + msg +"</h1>";
    }
    response.send(data);
}); 

// twig template engine
app.set('view engine', 'twig');
app.set('views', './public/views');

// simple view
app.get('/views', function (req, res) {
    res.render('index', { title: 'Hello', message: 'This is come from Template engine' });
});

// body parsing middleware
app.get('/about/:a?-:b?', (req, res) => {
    console.log(req.params);
    res.render('about', { title: 'About', add: 'Addition : ', sum: parseInt(req.params.a) + parseInt(req.params.b) });
});

//login form

// parse application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false });
 
// parse application/json
app.use(bodyParser.json());
app.get('/login', (req, res) => {
    res.render('index', {title: "Login Form", message: "Enter Username and Password"});
});
app.post('/login', urlencodedParser, [
    check('username', 'Username should be email id').isEmail(), 
    check('password', 'Password must be 5 characters').isLength({min: 5}),
    check('cpassword').custom((value, {req}) => {
        if(value != req.body.password) {
            throw new Error('Confirm does not match password');
        } else {
            return true;
        }  
    })
    ], (req, res) => {
    const errors = validationResult(req);
    console.log(errors.mapped());
    console.log(req.body);
    if(!errors.isEmpty()) {
        const user = matchedData(req);
        res.render('index', {title: "Please enter the details again!!", error: errors.mapped(), user: user});
    } else {
        const user = matchedData(req);
        console.log(user);
        res.render('login', {title:"Users Details", user: user});
    }
});
