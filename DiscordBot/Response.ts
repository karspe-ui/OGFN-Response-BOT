import { EmbedBuilder, ColorResolvable } from 'discord.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const configPath = join(process.cwd(), 'settings.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8')) as any;

export type AutoResponseRule = (message: string) => EmbedBuilder | null;

const brandName: string = config.embeds?.brandName ?? 'Gilded';
const brandUrl: string = config.embeds?.brandUrl ?? 'https://gildedfn.dev/';

const helpChannelUrl: string =
  config.channels?.helpChannelUrl ??
  'https://discord.com/channels/YOUR_SERVER/YOUR_HELP_CHANNEL';

const learnMoreSafetyUrl: string =
  config.channels?.learnMoreSafetyUrl ??
  'https://discord.com/channels/YOUR_SERVER/YOUR_SAFETY_CHANNEL';

const creatorProgramUrl: string =
  config.channels?.creatorProgramUrl ??
  'https://discord.com/channels/YOUR_SERVER/YOUR_CREATOR_CHANNEL';

const donationsUrl: string =
  config.channels?.donationsUrl ??
  'https://discord.com/channels/YOUR_SERVER/YOUR_DONATIONS_CHANNEL';

const reportsUrl: string =
  config.channels?.reportsUrl ??
  'https://discord.com/channels/YOUR_SERVER/YOUR_REPORTS_CHANNEL';

const supportChannelUrl: string =
  config.channels?.supportChannelUrl ?? helpChannelUrl;

const appealsChannelUrl: string =
  config.channels?.appealsChannelUrl ?? helpChannelUrl;

function baseEmbed(
  color: string,
  title: string,
  description: string
) {
  return new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: `Powered by ${brandName}` })
    .setURL(brandUrl);
}

// 🎯 Absolute matching engine: strips basic trailing punctuation to ensure clean phrase/word inclusion
function includesAny(haystack: string, needles: string[]) {
  const cleanedHaystack = haystack.toLowerCase().replace(/[?.,!]/g, '').trim();
  return needles.some((needle) => cleanedHaystack.includes(needle.toLowerCase().trim()));
}

const AutoResponseRules: AutoResponseRule[] = [
  // 1. Mobile / Android Status
  function (message) {
    const msg = message.toLowerCase();

    const talksMobile = includesAny(msg, [
      'android',
      'mobile',
      'phone',
      'apk',
      'ios',
      'iphone',
      'ipad',
      'switch',
      'console'
    ]);

    if (talksMobile) {
      return baseEmbed(
        '#FFB020',
        '📱 Mobile / Android Status',
        '**Android/mobile is not supported on this build (12.41).**\n\nCrashes and errors are expected on Android for this version.'
      ).addFields(
        {
          name: '✅ Best Option',
          value: 'Use **Windows** for the most stable experience.'
        },
        {
          name: '🧩 Getting Help',
          value: `If you still need assistance, open a thread here: ${helpChannelUrl}`
        },
        {
          name: '🔁 Updates',
          value: 'We’ll announce when mobile is supported again.'
        }
      );
    }

    return null;
  },

  // 2. General help
  function (message) {
    const msg = message.toLowerCase();

    if (
      includesAny(msg, [
        'i need help',
        'need help',
        'help me',
        'please help',
        'help pls',
        'help',
        'halp',
        'how to fix',
        'fix this',
        'any fix',
        'stuck on',
        'not loading',
        'how do i',
        'can someone help'
      ])
    ) {
      return baseEmbed(
        '#FF6B6B',
        '💬 Need Help?',
        '**Tell us what you’re stuck on** and we’ll guide you to the right fix.'
      ).addFields(
        {
          name: '📝 Include',
          value:
            'Device/PC type + what you tried + any screenshots/errors (if available).'
        },
        {
          name: '📍 Support channel',
          value: `Start here: ${supportChannelUrl}`
        }
      );
    }

    return null;
  },

  // 3. Antivirus / safety
  function (message) {
    const msg = message.toLowerCase();

    const looksAv = includesAny(msg, [
      'is this a virus',
      'is a virus',
      'is this safe',
      'is it safe',
      'antivirus',
      'anti-virus',
      'defender',
      'malware',
      'trojan',
      'miner',
      'flagged',
      'false positive',
      'falsepositive',
      'unsafe',
      'rat',
      'download safe',
      'virus',
      'threat',
      'blocked',
      'windows defender',
      'avast',
      'mcafee'
    ]);

    if (looksAv) {
      return baseEmbed(
        '#4ECDC4',
        '🛡️ Anti-Virus / Safety',
        '**Detections can happen.**\nIn most cases you do **not** have to disable protection entirely.'
      ).addFields(
        {
          name: '✅ Recommended',
          value: `Read our safety guidance: ${learnMoreSafetyUrl}`
        },
        {
          name: '⚙️ If it breaks',
          value:
            'If the tool fails to launch because of detection, you may need to temporarily allow/disable in your AV settings (only as needed).'
        },
        {
          name: '🚨 False Alarm Warning',
          value: `Many OG Fortnite projects get similar flags. (${brandName})`
        }
      );
    }

    return null;
  },

  // 4. Reports / cheating
  function (message) {
    const msg = message.toLowerCase();

    const wantsReport = includesAny(msg, [
      'cheater',
      'cheaters',
      'hacker',
      'hackers',
      'report',
      'report player',
      'report cheater',
      'cheat',
      'cheating',
      'aimbot',
      'softaim',
      'wallhack',
      'hax',
      'hacking',
      'banned',
      'ban this',
      'exploit'
    ]);

    if (wantsReport) {
      return baseEmbed(
        '#E74C3C',
        '🎯 Reporting Cheaters',
        '**Thank you for helping keep things fair.**\n\nThere is **no report command**—please submit via the channels below.'
      ).addFields(
        {
          name: '📍 Submit Evidence',
          value: `Main report channel: ${reportsUrl}`
        },
        {
          name: '🧾 Include',
          value:
            'Player IGN + timestamps + video/screenshot evidence (if you have it).'
        },
        {
          name: '🕊️ Appeal Ticket',
          value: `If you were falsely reported/banned: ${appealsChannelUrl}`
        }
      );
    }

    return null;
  },

  // 5. Donations / creator program
  function (message) {
    const msg = message.toLowerCase();

    if (
      includesAny(msg, [
        'donate',
        'donation',
        'support the project',
        'support',
        'creator program',
        'donating',
        'buy role',
        'supporter',
        'pay',
        'paypal',
        'crypto',
        'patreon',
        'cc code',
        'creator code',
        'sac'
      ])
    ) {
      return baseEmbed(
        '#2ECC71',
        '✨ Support / Donations',
        '**Thanks for supporting the project.**'
      ).addFields(
        {
          name: '📍 Donate',
          value: donationsUrl
        },
        {
          name: '👑 Creator Program',
          value: creatorProgramUrl
        }
      );
    }

    return null;
  }
];

export default AutoResponseRules;
