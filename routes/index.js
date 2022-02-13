var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var User = require('../models/user');
var Travel=require('../models/travel');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
    // flag=0;
	// if(User_Id=req.session.userId)
	console.log("profile");
	User_id = req.session.userId;
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email , "user_id" :User_id });
		}
	});
});
// router.get('/profile', function (req, res, next) {
// 	return res.render('data.ejs');
// });

router.post('/profile', function(req, res, next) {
	console.log(req.body);
	console.log("USER ID " + req.body.Curr_User_Id);
	var personInf = req.body;


	
	
		// if (personInfo.password == personInfo.passwordConf) {

		 	Travel.findOne({TravellingFrom:personInf.from},function(err,data){
				// if(!data)
		// 			var c;
		// 			Travel.findOne({},function(err,data){

		// 				if (data) {
		// 					console.log("if");
		// 					c = data.unique_id + 1;
		// 				}else{
		// 					c=1;
		// 				}
		// Travel.findOne({TravellingFrom:personInf.from},function(err,data){
		 	if(!data){
				var c;
				Travel.findOne({},function(err,data){

					if (data) {
						console.log("if");
						c = data.unique_id + 1;
					}else{
						c=1;
					}

						var newP = new Travel({
							unique_id:c,
							TravelName:personInf.TravelName,
							TravelMail:personInf.TravelMail,
							TravellingFrom:personInf.TravelFrom,
							TravellingTo: personInf.TravelTo,
							Reasons: personInf.TravelReason,
							User_Id : personInf.Curr_User_Id
						});

						newP.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					});
				}
});
return res.render('success.ejs');
			 			 
});			
	//.sort({_id: -1}).limit(1);
	router.get("/posts", function (req, res) {
		// finding the information about all users from the database
		Travel.find({}, function (err, response) {
			if (err) {
				console.log(err);
			}
			else {
				res.render("post.ejs", { result: response });
	
			}
	
		})
	})



router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

module.exports = router;