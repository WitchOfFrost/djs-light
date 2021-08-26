// Import the module

import * as djsLight from 'djs-light';

// Main Function

function main() {

    // Login with your Discord Bot Account

    djsLight.client.login("Your Token here", ["GUILD_MESSAGES"]);

    // Run code on successful connection event

    djsLight.events.on('ready', state => {
        console.log(`Logged in as ${state.user.username}#${state.user.discriminator}`);
    });

    // Run code on message event

    djsLight.events.on('message', msg => {
        if (msg.author.bot) return;

        // Send Message to the same channel

        djsLight.message.send(msg.channel_id, msg.content);
        console.log(`Message by: ${msg.author.username}#${msg.author.discriminator} || Content: ${msg.content}`);
    });
};

// Run Main function

main();