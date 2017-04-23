const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const { exampleChannel } = require('../../assets/_data/settings');
const Tag = require('../../models/Tag');
const Util = require('../../util/Util');


module.exports = class ExampleAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-example',
			aliases: ['example-add', 'tag-add-example', 'add-example-tag'],
			group: 'tags',
			memberName: 'add-example',
			description: 'Adds an example.',
			details: `Adds an example and posts it into the #examples channel. (Markdown can be used.)`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'name',
					label: 'examplename',
					prompt: 'what would you like to name it?\n',
					type: 'string'
				},
				{
					key: 'content',
					label: 'examplecontent',
					prompt: 'what content would you like to add?\n',
					type: 'string',
					max: 1800
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || msg.member.roles.exists('name', 'Server Staff');
	}

	async run(msg, args) {
		const name = Util.cleanContent(args.name.toLowerCase(), msg);
		const content = Util.cleanContent(args.content, msg);
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (tag) {
			return msg.embed({
				color: colors.red,
				description: `An example with the name **${name}** already exists, ${msg.author}`
			});
		}

		await Tag.create({
			userID: msg.author.id,
			userName: `${msg.author.tag}`,
			guildID: msg.guild.id,
			guildName: msg.guild.name,
			channelID: msg.channel.id,
			channelName: msg.channel.name,
			name: name,
			content: content,
			type: true,
			example: true
		});
		const msgID = await msg.guild.channels.get(exampleChannel).sendMessage('', {
			embed: {
				color: colors.blue,
				description: content
			}
		});
		Tag.update({ exampleID: msgID }, { where: { name, guildID: msg.guild.id } });
		return msg.embed({
			color: colors.green,
			description: `An example with the name **${name}** has been added, ${msg.author}`
		});
	}
};
