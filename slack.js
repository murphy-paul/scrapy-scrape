const { IncomingWebhook } = require('@slack/webhook');
const slack_url = process.env.SLACK_URL
const slack_channel = process.env.SLACK_CHANNEL
const slack_users =  process.env.SLACK_USERS

const webhook = new IncomingWebhook(slack_url);
const users = slack_users.split(",")
const fromUser = users[0]

console.log(users);

function createMessage(message) {
    return {
        text: message,
        channel: `#${slack_channel}`,
        username: fromUser,
        icon_url: "https://avatars1.githubusercontent.com/u/17338686?v=3&s=200"
    };
}

function createButton(message,link) {
    return {
        channel: `#${slack_channel}`,
        username: fromUser,
        icon_url: "https://avatars1.githubusercontent.com/u/17338686?v=3&s=200",
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: message
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "View now",
                        emoji: true
                    },
                    value: "view_now",
                    url: link,
                    action_id: "button-action"
                }
            }
        ]
    }
}

function userTags(users) {
    return users.map(u => `<@${u}>`).join(" ");
}


async function sendMessage(message, props, link) {
    const messagebody = props.debug ? message : `${userTags(users)} ${message}`
    if (props.silent) {
        console.log(`Slack notifications disabled, not sending message ${messagebody}`)
    } else {
        const payload = link ? createButton(messagebody, link) : createMessage(messagebody);
        webhook.send(payload);
    }
}

module.exports = { sendMessage }