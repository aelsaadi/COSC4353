//Imports

if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()

}



const express  = require('express')
const app = express()
const port = 3000
const router = express.Router();


const flash=require('express-flash')
const session=require('express-session')
const bcrypt=require('bcrypt')
const users = []

const passport=require('passport')
const initializePassport = require('./passport-config')


initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave:false,
	saveUninitialized: false

}))

app.use(passport.initialize())
app.use(passport.session())

function checkAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	
	res.redirect('/')

}
function checkNotAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return res.redirect('/')
		}
		next()
	
	//res.redirect('/')
}


// Static Files 
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))




app.post('/logint', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/fuel',
  failureRedirect: '/fuel',
  failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req,res) =>{

	try{
		const hashedPassword=await bcrypt.hash(req.body.password, 10)
		users.push({
		id: Date.now().toString(),
		user: req.body.username,
		pass: hashedPassword
		
		})
		res.redirect('/project')
	}
	catch{
		res.redirect('/')
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


//Listen on port 3000
app.listen(port,() => console.info('Listening on port ' + port))
