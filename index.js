'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Szeva, én vagyok a ChatRobot!")
})

let token = "EAAHKakgyBkkBAA1dNdDoUTxUDHD10qxhn3qZCZBKny31XMlMSaqce7lmXnJb5qUG6pHkKBZCn60OjPU12NsKGebiSKCa6ZAbiQXiGkOTb6hkzcp002NCQTUIZCzJpKeHR4AG0f6JD73qzOOASGRZApP5hmuOvFGkQcCpP7SZCcHJwZDZD"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "gr-messenger") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Hibás token")
})

let viccek = [
	'- Mi az abszolút pech? - ??? - Lezuhanni egy repülővel egy süllyedő hajóra.',
	'- Mi az? Fekete a színe, de fehér levelei vannak? - ??? - Néger postás.',
	'- Vádlott, miért ad elő nekem ma a történtekről a tegnapitól teljesen eltérő történetet? - Azért bíró úr, mert a tegnapit nem hitte el...'
]

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			
			if ( text.search("szeretlek") > -1) {
				sendText(sender, "Én is! 😘");
			} 

			if ( text.search("vicc") > -1) {
				sendText(sender, viccek[Math.floor((Math.random() * viccek.length ))] );
			}

			else if {
				sendText(sender, "Nem értem: '" + text.substring(0, 10)+ "...'");
			}
		}
	}
	res.sendStatus(200)
})



function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})








