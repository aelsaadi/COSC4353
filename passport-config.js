const LocalStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')

function initialize(passport,getUserByUID,getUserByID){

const authenticateUser= async (newUser, password, done)=>{
const user=getUserByUID(newUser)
	if(user==NULL){
	return done(null, false, {message:'No user with that userID'})
	}
	try{
		if(await bcrypt.compare(password,user.password)){
			return done(null, user)
		}
		else{
			return done(null,false, {message: "Password Incorrect"})
		}
	}
	catch(e){
		return done(e)
	}
}
passport.use(new LocalStrategy({usernameField: 'newUser'}, authenticateUser))
passport.serializeUser((newUser, done)=> done(null, newUser.id ))
passport.deserializeUser((ID, done)=>{

	return done(null, getUserByID(ID))

})
}
module.exports= initialize