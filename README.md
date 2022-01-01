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
	personal_dietitian	//user
	upload_avatar
	dietitian_list
	request_list		//admin
	add_dietitian		//admin
	remove_dietitian	//admin