const express = require("express");
const app = express();

app.listen(() => console.log("Server started"));

app.use('/ping', (req, res) => {
  res.send(new Date());
});


const Discord = require('discord.js');
const client = new Discord.Client();
const cmd = require("node-cmd");
const ms = require("ms");
const fs = require('fs');
const ytdl = require("ytdl-core");
const canvas = require("canvas");
const convert = require("hh-mm-ss")
const fetchVideoInfo = require("youtube-info");
const simpleytapi = require('simple-youtube-api')
const util = require("util")
const gif = require("gif-search");
const jimp = require("jimp");
const guild = require('guild');
const hastebins = require('hastebin-gen');
const getYoutubeID = require('get-youtube-id');
const pretty = require("pretty-ms");
const moment = require('moment');
const request = require('request');
const dateFormat = require('dateformat');
const cnfg = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const { prefix, devs } = require("./config.json");


 


const k2rba = JSON.parse(fs.readFileSync("./tickets.json", "utf8"));
function k2br() {
  require("fs").writeFileSync("./tickets.json", JSON.stringify(k2rba, null, 4));
}

client.on("message", message => {
  var args = message.content
    .split(" ")
    .slice(1)
    .join("-");
  if (message.content.startsWith(prefix + "new")) {
    let ticketReason = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    if (!ticketReason)
      return message.channel.send(
        `**ERORR: i can't find \`reason\` open ticket**`
      );
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return message.channel.send("**Please Check My Permission**");
    let Support = message.guild.roles.cache.find(
      role => role.name === cnfg.ticketrole
    );
    let everyone = message.guild.roles.cache.find(
      role => role.name === "@everyone"
    );
    if (!Support)
      return message.channel.send(
        `**I Can't find \`${cnfg.ticketrole}\` Role**`
      );
    if (
      message.guild.channels.cache.some(
        n => n.channelname === `ticket-${message.author.username}`
      )
    )
      return message.channel.send(`**you already have got a Ticket.**`);
    let nCategory = cnfg.nCategory;
    let ticketCategory = message.guild.channels.cache.find(
      kah => kah.name === `${nCategory}`
    );
    if (!ticketCategory)
      return message.channel.send(`**ERORR: I can't find \`${nCategory}\`**`);
    if (!k2rba[message.author.id])
      k2rba[message.author.id] = {
        limt: 0,
        channelname: "kah"
      };
    if (k2rba[message.author.id].limt === cnfg.limttick)
      return message.reply(
        `**ERORR: You need to close a ticket from \`${k2rba[message.author.id].limt}\`tickets.**`
      );
    message.guild.channels
      .create(`ticket-${message.author.username}`, { type: "text" })
      .then(async ticket => {
        ticket.setParent(ticketCategory);
        ticket.createOverwrite(Support, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true
        });
        ticket.createOverwrite(everyone, {
          SEND_MESSAGES: false,
          VIEW_CHANNEL: false
        });
        ticket.createOverwrite(message.author, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true
        });
        if (k2rba[message.author.id])
          k2rba[
            message.author.id
          ].channelname = `ticket-${message.author.username}`;
        k2rba[message.author.id].limt =
          `${k2rba[message.author.id].limt}` * 1 + 2 - 1;
        k2br();
        let embed = new Discord.MessageEmbed().setDescription(
          `Your Ticket <#${ticket.id}>`
        );
        message.channel.send(embed);
        let embed1 = new Discord.MessageEmbed()
          .addField(
            `Ticket information `,
            `\`\`\`By : ${message.author.username} ,- ID : ${message.author.id}\`\`\``,
            true
          )
          .addField(`Ticket Reseon `, `\`\`\`${ticketReason}\`\`\``, true)
          .addField(
            `${message.author.username}\`Ticket's limit\``,
            `\`\`\`${eval(
              `${cnfg.limttick} - ${k2rba[message.author.id].limt}`
            )}\`\`\``
          )

          .setFooter(message.author.username, message.author.avatarURL())
          .setTimestamp();
        ticket.send(embed1);
        ticket.send(`${Support} ..`).then(m => {
          setTimeout(function() {
            m.edit(`**Please wait for the \`staff\` to come.**`);
          }, 5000);
        });
      });
  } 


   


  if (message.content.startsWith(prefix + "add")) {
    let args = message.content.split(" ");
    let user = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[1])
    );
    if (!user) {
      message.channel.send(
        `**>>> Please specify a friend to add, ${message.author}**`
      );
      return;
    }
    if (!message.channel.name.startsWith("ticket-"))
      return message.channel.send(
        `**You must be in a ticket to do that, ${message.author}**`
      );
    message.channel.createOverwrite(user.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true
    });
    let embed = new Discord.MessageEmbed()
      .setTitle("Added")
      .addField(
        `**User:**`,
        `\`\`\`${user.username || user.user.username}\`\`\``,
        true
      )
      .addField(`**By:**`, `\`\`\`${message.author.username}\`\`\``, true)
      .setTimestamp()
      .setFooter(
        `added by: ${message.author.username}`,
        message.author.avatarURL()
      );
    message.channel.send(`${message.author.tag} invited ${user} to the ticket`);
    message.channel.send(embed);
  }
  if (message.content.startsWith(prefix + "remove")) {
    let args = message.content.split(" ");
    let user = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[1])
    );
    if (!user) {
      message.channel.send(
        `**>>> Please specify a friend to remove, ${message.author}**`
      );
      return;
    }
    if (!message.channel.name.startsWith("ticket-"))
      return message.channel.send(
        `**You must be in a ticket to do that, ${message.author}**`
      );
    message.channel.createOverwrite(user.id, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false
    });
    let embed = new Discord.MessageEmbed()
      .setTitle("Removed")
      .addField(
        `**User:**`,
        `\`\`\`${user.username || user.user.username}\`\`\``,
        true
      )
      .addField(`**By:**`, `\`\`\`${message.author.username}\`\`\``, true)
      .setTimestamp()
      .setFooter(
        `removed by: ${message.author.username}`,
        message.author.avatarURL()
      );
    message.channel.send(`${message.author.tag} removed ${user} to the ticket`);
    message.channel.send(embed);
  }
  if (message.content.startsWith(prefix + "rename")) {
    let args = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return message.channel.send("**Please Check My Permission**");
    if (!message.guild.member(message.author).hasPermission("MANAGE_CHANNELS"))
      return message.channel.send("**Please Check Your Permission**");
    if (!message.channel.name.startsWith("ticket-"))
      return message.channel.send(
        `**You must be in a ticket to do that, ${message.author}**`
      );
    if (!args)
      return message.channel.send("**Please Type To Can Reanmed Ticket**");
    message.channel.setName(`ticket-${args}`);
    let embed = new Discord.MessageEmbed()
      .setDescription(`Ticket renamed To => ${args}`)
      .setTimestamp()
      .setFooter(`By :${message.author.username}`, message.author.avatarURL());
    message.channel.send(embed);
  }
  if (message.content.startsWith(prefix + "close")) {
    let args = message.content.split(" ");
    let user =
      message.mentions.users.first() ||
      message.author ||
      message.guild.member.cache.get(args[1]);
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return message.channel.send("**Please Check My Permission**");
    if (!message.guild.member(message.author).hasPermission("MANAGE_CHANNELS"))
      return message.channel.send("**Please Check Your Permission**");
    if (!user) message.channel.send("**>>> mention to user or put him id**");
    if (!message.channel.name.startsWith("ticket-"))
      return message.channel.send(
        `**You must be in a ticket to do that, ${message.author}**`
      );
    let embed = new Discord.MessageEmbed().setDescription(
      "**```css\nTicket - Closing\nClosing your ticket in 5 seconds```**"
    );
    message.channel.send(embed);
    setTimeout(function() {
      if (k2rba[message.author.id])
        k2rba[user.id].limt = `${k2rba[user.id].limt}` * 1 + 2 - 1 - 1 - 1;
      k2br();
      message.channel.delete();
    }, 5000);
  }
  if (message.content.toLowerCase() === prefix + "help new") {
    let newT = new Discord.MessageEmbed()
      .setTitle(`Command: new `)
      .addField("Usage", `${prefix}new [Reason]`)
      .addField("Information", "Open Ticket");
    message.channel.send(newT);
  }
  if (message.content.toLowerCase() === prefix + "help rename") {
    let rename = new Discord.MessageEmbed()
      .setTitle(`Command: rename `)
      .addField("Usage", `${prefix}rename [args]`)
      .addField("Information", "Renamed Ticket");
    message.channel.send(rename);
  }
});

client.login(process.env.token); // edit this
