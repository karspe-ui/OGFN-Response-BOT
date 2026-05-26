import { Client, GatewayIntentBits, Message } from 'discord.js';
import AutoResponseRules from './Response';
import settings from '../settings.json';

const config = settings as any;

const DiscordToken = config.discordToken;
const IgnoredRoles = config.ignoredRoleIds ?? [];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

function shouldIgnore(message: Message): boolean {
  const member = message.member;
  if (!member) return false;
  return member.roles.cache.some((role) => IgnoredRoles.includes(role.id));
}

client.once('ready', () => {
  console.log(`Bot is online as ${client.user?.tag ?? 'unknown'}`);
  console.log(`Monitoring ${client.guilds.cache.size} server(s)`);
  console.log(`Ignoring ${IgnoredRoles.length} role(s)`);
});

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;
  if (shouldIgnore(message)) return;

  const content = message.content?.toLowerCase() ?? '';

  for (const rule of AutoResponseRules) {
    try {
      const responseEmbed = rule(content);
      if (responseEmbed) {
        const reply = await message.reply({ embeds: [responseEmbed] });

        if (config.autoDelete?.enabled) {
          const afterMs = Math.max(0, (config.autoDelete.afterSeconds ?? 0) * 1000);
          if (afterMs > 0) {
            setTimeout(() => {
              reply.delete().catch(() => void 0);
            }, afterMs);
          }
        }

        return;
      }
    } catch (err) {
      console.error('Error in autoresponse rule:', err);
    }
  }
});

client.on('error', (err) => {
  console.error('Discord client error:', err);
});

client
  .login(DiscordToken)
  .catch((err) => {
    console.error('Failed to login:', err);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (String((err as any)?.message ?? '').includes('TOKEN_INVALID')) {
      console.error('Your bot token is invalid. Get it from: https://discord.com/developers/applications');
    }
  });

