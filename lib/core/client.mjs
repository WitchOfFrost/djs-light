import axios from "axios";
import wsHandler from "../handlers/ws.mjs";

export default {
    /**
     * 
     * @param {string} token 
     * @param {Array} intents 
     */
    async login(token, intents) {
        await axios({
            url: 'https://discord.com/api/v9/gateway/bot',
            method: 'get',
            headers: {
                'Authorization': 'Bot ' + token
            }
        }).then(data => {
            wsHandler(token, intents, data, false);
        }).catch(err => {
            console.log(err);
        });
    }
}