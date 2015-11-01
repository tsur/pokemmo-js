var mongodb = require('mongodb');
var crypto = require('crypto');

var server = new mongodb.Server("127.0.0.1", 27017, {});
var dbclient;
var accounts;
var MAX_ACCOUNTS = 10;

Array.prototype.remove = function(e){
	var i = 0;
	var arr = this;
	
	while((i = arr.indexOf(e, i)) != -1){
		arr.splice(i, 1);
		return true;
	}
	
	return false;
};

new mongodb.Db('pokemmo', server, {}).open(function (error, client) {
	if(error) throw error;
	dbclient = client;
	
	dbclient.createCollection('accounts', function(error, accountsCollection){
		accounts = accountsCollection;
		accounts.ensureIndex({username: 1}, {unique:true}, function(){});
		accounts.ensureIndex({lcusername: 1}, {unique:true}, function(){});
		makeAccount();
	});
	
	
}, {strict:true});

function createAccount(username, password, email, callback){
	callback = callback || function(){};
	if(username.length < 4){
		callback('short_username');
		return;
	}
	if(username.length > 10){
		callback('long_username');
		return;
	}
	if(!(/^[a-zA-Z0-9_]{1,10}$/).test(username)){
		callback('invalid_username');
		return;
	}
	if(password.length < 8){
		callback('short_password');
		return;
	}
	if(password.length > 32){
		callback('long_password');
		return;
	}
	if(!(/^[a-zA-Z0-9_!@#$%&*\(\)\[\]\{\}.,:;-]+$/).test(password)){
		callback('invalid_password');
		return;
	}
	
	if(email.length > 100 || !isEmail(email)){
		callback('invalid_email');
		return;
	}
	
	var passsalt = sha512(+new Date().getTime() + '#' + Math.random() + '#' + Math.random());
	var passhash = sha512(password, passsalt);
	
	accounts.count(function(err, count) {
		console.log('Registered accounts: '+count);
		
		if(err){
			console.warn(err.message);
			callback('internal_error');
			return;
		}
		
		if(count >= MAX_ACCOUNTS){
			callback('registration_disabled');
			return;
		}
		
		accounts.find({email: email}, {limit: 1}).count(function(err, count){
			if(err){
				console.warn(err.message);
				callback('internal_error');
				return;
			}
			
			if(count > 0){
				callback('email_already_registered');
				return;
			}
			
			accounts.insert({username: username, lcusername: username.toLowerCase(), password: passhash, email: email, salt: passsalt}, {safe: true}, function(err, objects) {
				if(err){
					if(err.code == 11000){
						callback('username_already_exists');
						return;
					}
					console.warn(err.message);
					callback('internal_error');
					return;
				}
				
				callback('success');
			});
		});
	});
}

function sha512(pass, salt){
	var hasher = crypto.createHash('sha512');
	if(salt){
		hasher.update(pass+'#'+salt, 'ascii');
	}else{
		hasher.update(pass, 'ascii');
	}
	return hasher.digest('base64');
}

function isEmail(str){
	return (/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/).test(str);
}


function makeAccount(){

	var data = {

		username: 'test',
		password: 'test1234',
		email: 'test@test.com'
	}

	createAccount(data.username, data.password, data.email, function(result){
		console.log('Account created', result);
	});
}
