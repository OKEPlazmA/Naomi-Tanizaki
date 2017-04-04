const { Command } = require('discord.js-commando');
const { osukey, version } = require('../../settings.json');
const request = require('request-promise');

module.exports = class OsuCommand extends Command {
	constructor(Client) {
		super(Client, {
			name: 'osu',
			aliases: ['osuuser', 'osudata', 'osuinfo'],
			group: 'bot',
			memberName: 'osu',
			description: 'Searches Osu user data.',
			throttling: {
				usages: 3,
				duration: 30
			},

			args: [{
				key: 'username',
				prompt: 'What osu username would you like to search for?',
				type: 'string'
			}]

		});
	}

	async run(msg, args) {
		if (!osukey) {
			return msg.embed({
				color: 3447003,
				description: `I dont have osu key!`
			});
		}
		const { username } = args;
		const response = await request({
			uri: `https://osu.ppy.sh/api/get_user?k=${osukey}&u=${username}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		return msg.embed({
			author: {
				icon_url: 'http://vignette3.wikia.nocookie.net/osugame/images/c/c9/Logo.png/revision/latest?cb=20151219073209', // eslint-disable-line
				name: 'osu!',
				url: `https://osu.ppy.sh/u/${response[0].user_id}`
			},
			color: 0xFF66AA,
			fields: [
				{
					name: '**Username**',
					value: response[0].username,
					inline: true
				},
				{
					name: '**ID**',
					value: response[0].user_id,
					inline: true
				},
				{
					name: '**Level**',
					value: response[0].level,
					inline: true
				},
				{
					name: '**Accuracy**',
					value: `${parseFloat(Math.round(response[0].accuracy * 100) / 100).toFixed(2)}%`,
					inline: true
				},
				{
					name: '**Global rank**',
					value: `#${response[0].pp_rank}`,
					inline: true
				},
				{
					name: '**Play Count**',
					value: response[0].playcount,
					inline: true
				},
				{
					name: '**A/S/SS**',
					value: `${response[0].count_rank_a}/${response[0].count_rank_s}/${response[0].count_rank_ss}`,
					inline: true
				},
				{
					name: '**PP**',
					value: `${parseFloat(Math.round(response[0].pp_raw * 100) / 100).toFixed(2)}`,
					inline: true
				},
				{
					name: '**Country**',
					value: `:flag_${response[0].country.toLowerCase()}: ${response[0].country}`,
					inline: true
				}
			],
			thumbnail: { url: `https://a.ppy.sh/${response[0].user_id}` || undefined }
		});
	}
};
