import { IntentsBitField } from 'discord.js';
import axios from 'axios';
const { Client, ActivityType } = require('discord.js');
require('dotenv').config()

const client = new Client({ intents: [] });

client.once('ready', () => {
  console.log(`Бот ${client.user?.tag} запущен!`);
});

const getLastTickInfo = async () => {
  const resApi = await axios.get(`https://api.battlemetrics.com/servers/${process.env.TARGET_ID}`);
  const lastTickInfo = resApi.data.data as { attributes: { name: string, players: number, maxPlayers: number, details: { squad_teamOne: string, squad_teamTwo: string, map: string } } };

  return lastTickInfo.attributes;
}

const update = async () => {
  try {
    const lTInfo = await getLastTickInfo();

    const resString = `${lTInfo.players}|${lTInfo.maxPlayers} ${lTInfo.details.map }`;
    // const description = `Состояние сервера ${lTInfo.name} ${lTInfo.details.squad_teamOne} - ${lTInfo.details.squad_teamTwo}`

    client.user?.setActivity(resString, { type: ActivityType.Playing });
  }
  catch (error: Error) {
    console.log(error);
  }
}

client.on("ready", async () => {
  console.log(">> Bot started");

  await update();

  setInterval(async () => await update(), 60 * 1000);
});

client.login(process.env.BOT_TOKEN as string);
