import { Client, GatewayIntentBits, Message } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    if (client.user) {
        console.log(`🤖 OGFN Autoresponse Bot is online as ${client.user.tag}!`);
    }
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    const cleanContent = message.content.toLowerCase();
    const words = cleanContent.split(/\s+/); 

    if (words.some(word => ['iphone', 'apk', 'phone', 'android', 'ios'].includes(word))) {
        await message.reply(
            "📱 **OGFN Mobile Support:**\n" +
            "• For **Android**, make sure you download the official client APK.\n" +
            "• For **iOS/iPhone**, ensure your sideloading tool (AltStore, Scarlet, etc.) is fully updated and trusted in your device settings."
        );
        return;
    }

    if (cleanContent.includes("wont work") || cleanContent.includes("doesn't work") || cleanContent.includes("doesnt work")) {
        await message.reply(
            "❌ **Is something failing?**\n" +
            "Please double check that your backend port management is correct, your DLL injection was successful, and verify your anti-virus isn't blocking the OGFN launcher files."
        );
        return;
    }

    if (words.includes('cheating') || words.includes('cheat')) {
        await message.reply("⚠️ **Rule Reminder:** Discussing or sharing cheats, hacks, or macro exploits is strictly prohibited on this server.");
        return;
    }

    if (words.includes('donate') || words.includes('donation')) {
        await message.reply("💖 Thank you for supporting the OGFN project! Check the pinned messages or our official channels for the donation link.");
        return;
    }

    if (words.includes('close')) {
        await message.reply("🔒 If you are trying to close down your session safely, please use the exit shortcut inside the server launcher console.");
        return;
    }
});

const TOKEN = process.env.DISCORD_TOKEN || "YOUR_BOT_TOKEN_HERE";
client.login(TOKEN);
