module.exports = {
	db: {
        host: process.env.HOST,
    	user: process.env.USER, 
    	password: process.env.PASSWORD,
    	database: process.env.DATABASE
	},
	token: {
		secret: process.env.SECRET 
	},
	auth: {
		user: process.env.USER_MAIL,
		pass: process.env.USER_PASS
	}
}