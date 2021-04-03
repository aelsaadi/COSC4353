//Imports

if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()

}



const express  = require('express')
const app = express()
const port = 3000
const router = express.Router();

const bodyParser = require('body-parser')

const flash=require('express-flash')
const session=require('express-session')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const users = []

const passport=require('passport')
const initializePassport = require('./passport-config')


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://user:M2Zlp25kFD8cKnGr@cluster0.3wohx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex:true
})
const User = require('./model/user')

const JWT_SECRET='ilhas teezi'
// initializePassport(
//   passport,
//   username => users.find(user => user.username === username),
//   id => users.find(user => user.id === id)
// )

// app.use(express.urlencoded({extended:false}))
// app.use(flash())
// app.use(session({
// 	secret: process.env.SESSION_SECRET,
// 	resave:false,
// 	saveUninitialized: false

// }))

// app.use(passport.initialize())
// app.use(passport.session())

// function checkAuthenticated(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next()
// 	}
	
// 	res.redirect('/')

// }
// function checkNotAuthenticated(req,res,next){
// 	if(req.isAuthenticated()){
// 		return res.redirect('/')
// 		}
// 		next()
	
// 	//res.redirect('/')
// }


// Static Files 
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))




// app.post('/logint', checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/fuel',
//   failureRedirect: '/fuel',
//   failureFlash: true
// }))

// app.post('/register', checkNotAuthenticated, async (req,res) =>{

// 	try{
// 		const hashedPassword=await bcrypt.hash(req.body.password, 10)
// 		users.push({
// 		id: Date.now().toString(),
// 		user: req.body.username,
// 		pass: hashedPassword
		
// 		})
// 		res.redirect('/project')
// 	}
// 	catch{
// 		res.redirect('/')
// 	}
// 	console.log(users)


// })





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


app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.use(bodyParser.json())

app.post('/api/register', async(req,res)=>{
	console.log(req.body)
	res.json({status:'ok'})
	const { username, password: plainTextPassword } = req.body
	const password = await bcrypt.hash(plainTextPassword, 10)
	//	console.log(await bcrypt.hash(password,10))
	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })

})



//Listen on port 3000
app.listen(port,() => console.info('Listening on port ' + port))