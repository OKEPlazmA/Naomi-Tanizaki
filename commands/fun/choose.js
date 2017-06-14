const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const RESPONSES = [
	ch => `I choose **${ch}**`,
	ch => `I pick **${ch}**`,
	ch => `**${ch}** is the best choice`,
	ch => `**${ch}** is my choice`,
	ch => `**${ch}** of course`
];

module.exports = class ChooseCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'choose',
			aliases: ['pick', 'decide'],
			group: 'fun',
			memberName: 'choose',
			description: '`AL: low` Makes a choice for you.',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'choices',
					prompt: 'what I should choose from?\n',
					type: 'string',
					infinite: true
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run (msg, { choices }) {
		if (choices.length < 2) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `You need to tell me atleast 2 things to choose from, ${msg.author}`
			});
		}

		let userError;
		choices.forEach(ch => {
			if (/[,|;|\||/|//|\-]/.test(ch) && ch.length >= 2) userError = true; // eslint-disable-line no-useless-escape
		});
		if (userError) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `Please seperate your choices with a simple space, ${msg.author}`
			});
		}

		let pick = Math.floor(Math.random() * choices.length);
		choices.forEach((ch, i) => {
			if ((ch.includes('homework')
				|| ch.includes('sleep')
				|| ch.includes('study')
				|| ch.includes('productiv')
				|| ch.includes('shower'))
			&& Math.random() < 0.3) {
				pick = i;
			}
		});

		await msg.embed({
			color: _sdata.colors.green,
			description: `${RESPONSES[Math.floor(Math.random() * RESPONSES.length)](choices[pick])}, ${msg.author}.`
		});
		return null;
	}
};
