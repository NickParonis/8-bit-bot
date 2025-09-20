import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AttachmentBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

async function createSoundBoard(message) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
    await message.channel.bulkDelete(fetchedMessages, true);

    const jsonPath = path.join(__dirname, '../content/soundBoard.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const soundEffectBoard = JSON.parse(rawData);
        
    for (const group of soundEffectBoard) {
        // each groop displays/sends in message channel 1 embed and rows of up to 3 buttons
        const embed = new EmbedBuilder()
            .setColor(group.embed.Color);
        
        if(group.embed.description){
            embed.setDescription(group.embed.description)
        }

        if(group.embed.title){
            embed.setTitle(group.embed.title)
        }

        if(group.embed.Footer){
            embed.setFooter({ text: group.embed.Footer })
        }

        const files = [];	
        if (group.embed.BannerImageName) {
            embed.setImage(`attachment://${group.embed.BannerImageName}`);
            const bannerPath = path.join(__dirname, '../content/img', group.embed.BannerImageName);
            files.push(new AttachmentBuilder(bannerPath, { name: group.embed.BannerImageName }));
        }
        
        if (group.embed.ThumbnailImageName) {
            embed.setThumbnail(`attachment://${group.embed.ThumbnailImageName}`);
            const thumbPath = path.join(__dirname, '../content/img', group.embed.ThumbnailImageName);
            files.push(new AttachmentBuilder(thumbPath, { name: group.embed.ThumbnailImageName }));
        }

        const rows = [];
        for (let i = 0; i < group.buttons.length; i += 3) {
            const row = new ActionRowBuilder();
            const chunk = group.buttons.slice(i, i + 3);
        
            chunk.forEach(btn => {
                row.addComponents(new ButtonBuilder()
                    .setCustomId(btn.id)
                    .setLabel(btn.label)
                    .setStyle(ButtonStyle[btn.style]) 
                );
            });
    
            rows.push(row);
        };


        await message.channel.send({
            embeds: [embed],
            components: rows,
            files: files,
        });
        await message.channel.send({ content: '\u200B' });
    }
};

export default {
	createSoundBoard
};