import config from 'etc/config';
import EmailValidator from 'email-validator';
const sg = require('sendgrid')(config.mail.key);


export function sendMail(req, res) {
		let fromEmail = req.body.femail;
		let message   = req.body.fmessage;
		const resJson = {
			status: 'SUCCESS', // other ERROR , SUCCESS
			fields: {
				femail: 2, // 0 - is empty, 1 - not valid, 2 - success
				fmessage: 2
			},
			sended: 'OK' // other - FAIL
		};

		if (!message){
			resJson.status = 'ERROR';
			resJson.fields.fmessage = 0;
		}

		if (!fromEmail){
			resJson.status = 'ERROR';
			resJson.fields.femail = 0;
		} else {
			if (!EmailValidator.validate(fromEmail)) {
				resJson.status = 'ERROR';
				resJson.fields.femail = 1;
			}
		}

		if (resJson.status === 'ERROR') {
			res.json(resJson);
			return;
		}
		
		let contentText = message;
		let contentHtml = `<div style="font-size: 18px;">${message}</div>`;

		let sendArray = config.mail.sendto;
		let sendTo    = [];

		for(let i = 0; i < sendArray.length; i++){
				sendTo.push({
						email: sendArray[i]
				});
		}
		
		const request = sg.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: {
				personalizations: [
					{
						to: sendTo,
						subject: config.mail.subject
					}
				],
				from: {
					email: fromEmail
				},
				content: [
					{
						type: 'text/plain',
						value: contentText
					},
					{
						type: 'text/html',
						value: contentHtml
					}
				]
			}
		});

		
		sg.API(request)
			.then(function (response) {
				res.json(resJson);
			})
			.catch(function (error) {
				resJson.status = 'ERROR';
				resJson.sended = 'FAIL';
				res.json(resJson);
			});
		
}
