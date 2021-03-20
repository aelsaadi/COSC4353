//Imports
if(process.env.NODE_ENV!=='production'){
require('dotenv').config()
}


const express  = require('express')
const app = express()
const port = 3000

const passport=require('passport')
const flash=require('express-flash')
const session=require('express-session')
const bcrypt=require('bcrypt')
app.use(express.json())
const initializePassport= require('./passport-config')
initializePassport(passport, newUser => users.find(user => user.newUser==newUser), id=>users.find(user => user.id==id))
const users=[]
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Static Files 
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Login stuff
/*app.get('/users', (req,res)=>{
	res.json(users)
})
app.post('/users/' , async (req,res)=> {
try{
	const salt=bcrypt.genSalt()
}
	const user={ req.body.name, password:req.body.password}
	users.push(user)
	res.status(201).send()
	

})
*/


app.post('/login', passport.authenticate('local', {
successRedirect: '/fuel',
failureRedirect: '/fuel',
failureFlash: true,




}))

app.post('/register', async (req,res) => {
	try{
		const hashedPassword= await bcrypt.hash(req.body.newPass, 10)
		users.push({
		id: Date.now().toString(),
		name: req.body.newUser,
		password: hashedPassword
		})
	
	res.redirect('/project')
	}
	catch{
	res.redirect('/index.html')
	
	}
	console.log(users)
	
	
	
})






//Renders HTML file
app.get('', (req,res) =>{
    res.sendFile(__dirname + '/views/index.html')
})

app.set('views','./views')

app.get('/fuel', (req,res) =>{
    res.sendFile(__dirname + '/views/fuel.html')
})
app.get('/project', (req,res) =>{
    res.sendFile(__dirname + '/views/Project.html')
})
app.get('/login', (req,res) => {
	res.render('/fuel')
})

app.get('/register', (req,res) => {
	res.render('/project')
})


//Listen on port 3000
app.listen(port,() => console.info('Listening on port ' + port))
