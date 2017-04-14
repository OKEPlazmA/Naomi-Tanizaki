const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const RESPONSES = [
	'it is certain.',
	'it is decidedly so.',
	'without a doubt.',
	'you may rely on it.',
	'as i see it, yes',
	'most likely.',
	'outlook good',
	'yes.',
	'signs point to yes.',
	'reply hazy try again.',
	'ask again later.',
	'better not tell you now.',
	'cannot predict now',
	'don\'t count on it.',
	'my reply is no.',
	'my sources say no.',
	'outlook not so good.',
	'very doubtful.'
];

module.exports = class EightBallCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			aliases: ['8', '🎱'],
			group: 'fun',
			memberName: '8ball',
			description: 'Ask the magic 8 ball.',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'question',
					prompt: 'what question do you want ask the magic 8ball?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg) { // eslint-disable-line require-await
		return msg.embed({
			color: colors.blue,
			description: `🎱  |  ${msg.author}, ${RESPONSES[Math.floor(Math.random() * RESPONSES.length)]}`
		});
	}
};
