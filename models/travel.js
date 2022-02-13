var mongoose = require('mongoose');
var Schema = mongoose.Schema;

travelSchema = new Schema( {
	
	TravelName:String,
	TravelMail:String,
	
	TravellingFrom: String,
	TravellingTo: String,
	Reason: String,
	User_Id: Number

}),
Travel = mongoose.model('travel', travelSchema);

module.exports = Travel;