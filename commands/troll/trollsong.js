const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    Colors,
} = require('discord.js');
const { createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const download = require('../../utils/tools/download');
const reply = require('../../utils/tools/reply');
const guild = require('../../models/guild');

module.exports = {
    name: 'trollsong',
    description: 'Commande de gestion des sons trolls',
    category: 'trolls',
    permissions: [],
    ownerOnly: false,
    usage: '/trollsong <command>',
    examples: ['/trollsong add ', '/trollsong list '],
    options: [
        {
            name: 'add',
            description:
                "Envoi un son au format MP3 pour pouvoir l'utiliser avec le bot",
            type: ApplicationCommandOptionType.Subcommand,
            permissions: [],
            usage: 'trollsong add <son> <titre>',
            options: [
                {
                    name: 'son',
                    description: 'Son au format MP3',
                    type: ApplicationCommandOptionType.Attachment,
                    required: true,
                },
                {
                    name: 'titre',
                    description: 'Titre a donner au son',
                    type: ApplicationCommandOptionType.String,
                    permissions: [],
                    required: true,
                },
            ],
        },
        {
            name: 'list',
            description: 'Affiche la liste des sons disponible pour ce serveur',
            type: ApplicationCommandOptionType.Subcommand,
            permissions: [],
            usage: 'trollsong list <page>',
            options: [
                {
                    name: 'page',
                    description: 'Numéro de la page',
                    type: ApplicationCommandOptionType.Number,
                    permissions: [],
                    required: false,
                },
            ],
        },
        {
            name: 'delete',
            description:
                'Supprime un son de la liste (ATTENTION : cette action supprime le fichier audio !)',
            type: ApplicationCommandOptionType.Subcommand,
            permissions: [PermissionFlagsBits.Administrator],
            usage: 'trollsong delete <ID du son>',
            options: [
                {
                    name: 'id',
                    description: 'id du son a supprimer',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ],
        },
        {
            name: 'test',
            description: 'Joue le son selectionné pour tester)',
            type: ApplicationCommandOptionType.Subcommand,
            permissions: [],
            usage: 'trollsong test <id du son>',
            options: [
                {
                    name: 'id',
                    description: 'id du son a tester',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ],
        },
    ],
    run: async (client, interaction) => {
        interaction.deferReply();
        if (interaction.options._subcommand === 'add') {
            trollSong_add(client, interaction);
        }
        if (interaction.options._subcommand === 'test') {
            trollSong_test(client, interaction);
        }
        if (interaction.options._subcommand === 'list') {
            trollSong_list(client, interaction);
        }
        interaction.deleteReply();
    },
};

async function trollSong_add(client, interaction) {
    const son = interaction.options.get('son');
    const titre = interaction.options.get('titre');
    const splittedName = son.attachment.name.split('.');
    const extension = splittedName[splittedName.length - 1];
    const AUTHORIZED_EXTENSION = ['mp3'];
    if (!AUTHORIZED_EXTENSION.includes(extension)) {
        return reply(interaction, 'Extension non valide !');
    }

    const downloaded = await download(
        son.attachment.url,
        interaction.guild,
        'trolls',
        titre.value
    );
    if (downloaded) {
        const song = {
            guild_id: interaction.guild.id,
            created_by: interaction.user.id,
            duration: 0,
            isTroll: true,
            title: titre.value + '.mp3',
            path:
                './storage/' +
                interaction.guild.id +
                '/trolls/' +
                titre.value +
                '.mp3',
        };
        client.createSongInBDD(interaction.user, interaction.guild, song);
        reply(interaction, titre.value + '.mp3 téléchargé avec succés !');
    } else {
        reply(
            interaction,
            titre.value + '.mp3 existe déjà! Choisis un autre nom!'
        );
    }
}

async function trollSong_test(client, interaction) {
    const id = interaction.options.get('id').value;
    const songList = await client.getSongListFromBDD({
        guild_id: interaction.guild.id,
        isTroll: true,
    });
    const song = songList[id];
    if (song) {
        const resource = createAudioResource(song.path, { inlineVolume: true });
        resource.volume.setVolume(0.3);
        client.player.play(resource);
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        client.player.subscription = connection.subscribe(client.player);
    } else {
        await reply(interaction, "L'id ne correspond à aucun son!");
    }
}

async function trollSong_list(client, interaction) {
    let page = interaction.options.get('page');
    if (!page) page = 1;
    else page = page.value;
    const songList = await client.getSongListFromBDD(interaction.guild);
    const embed = new EmbedBuilder()
        .setTitle('🎶  Liste  🎶')
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setColor(Colors.DarkGreen)
        .setFooter({
            text: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        });
    console.log('page ' + page);
    console.log('song entre :' + 25 * (page - 1) + ' et :' + 25 * page);
    songList.forEach((song, index) => {
        console.log(index + '. ' + song.title);
        if (index >= 25 * (page - 1) && index < 25 * page) {
            embed.addFields({
                name: index + '.',
                value: song.title,
                inline: false,
            });
        }
    });
    await interaction.channel.send({
        embeds: [embed],
        fetchReply: true,
    });
}
