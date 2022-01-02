# MyDiet_backend

# Model
user
	dietitianID
	username
	password
	fullname
	email
	phoneNumber
	about
	userType
	avatar
	rating
	needUpgrade
food
	name
	unit
	calories
	carbs
	fat
	protein

# Resolver
user
	signUp
		username
          	fullname 
            	email
            	password
            	phoneNumber
	signIn
		username
		password
	update
		fullname
		email
		phoneNumber
		about
	change_password
		oldPassword
		newPassword
	update_request		//user
	register_dietitian	//user
		_id
	personal_dietitian	//user
	upload_avatar
	client_list		//dietitian
	dietitian_list
	request_list		//admin
	add_dietitian		//admin
		_id
	remove_dietitian	//admin
		_id
food
	
