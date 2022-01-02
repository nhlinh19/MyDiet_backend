# MyDiet_backend

## Model
### user
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
### post
	ownerID
    postType
    dateTime
    content
    image
### comment
	userID
    postID
    dateTime
    content
### like
	userID
    postID
### food
	name
	unit
	calories
	carbs
	fat
	protein

## Resolver
### user
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
### post
	uploadPost
		req.body.postType
		req.body.content
	commentPost
		req.body.postID
		req.body.content
	getPostList
		req.query -> _id cua post cuoi cung hien thi trong feed
		req.body.type
	toggleLike
		req.body.postID
	getComment
		req.body.postID
### food
	findFood
		req.body.name
	
