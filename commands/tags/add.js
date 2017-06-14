const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Tag = require('../../models/Tag');
const Util = require('../../util/Util');

module.exports = class TagAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-tag',
			aliases: ['tag-add'],
			group: 'tags',
			memberName: 'add',
			description: '`AL: low` Adds a tag.',
			details: `Adds a tag, usable for everyone on the server. (Markdown can be used.)`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'name',
					label: 'tagname',
					prompt: 'what would you like to name it?\n',
					type: 'string'
				},
				{
					key: 'content',
					label: 'tagcontent',
					prompt: 'what content would you like to add?\n',
					type: 'string',
					max: 1800
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run(msg, args) {
		const name = Util.cleanContent(msg, args.name.toLowerCase());
		const content = Util.cleanContent(msg, args.content);
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (tag) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `A tag with the name **${name}** already exists, ${msg.author}`
			});
		}

		await Tag.create({
			userID: msg.author.id,
			userName: `${msg.author.username}#${msg.author.discriminator}`,
			guildID: msg.guild.id,
			guildName: msg.guild.name,
			channelID: msg.channel.id,
			channelName: msg.channel.name,
			name,
			content
		});
		return msg.embed({
			color: _sdata.colors.green,
			description: `A tag with the name **${name}** has been added, ${msg.author}`
		});
	}
};
