import axios from "axios";
import { logger } from "../index.mjs";

export default {
    /**
     * Accepts discord bot token to return
     * data for the matching user.
     * 
     * @param {string} token 
     * @returns 
    */
    get(token) {
        return new Promise((resolve, reject) => {
            axios({
                url: 'https://discord.com/api/oauth2/applications/@me',
                method: 'get',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bot ' + token
                }
            }).then(data => {
                resolve(data);
            }).catch(err => {
                logger.log({
                    level: 'error',
                    message: 'ERR || accountData.get() ||' + err
                })
            });
        });
    }
};
