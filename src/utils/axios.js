import Axios from 'axios'
export const axios = Axios.create({
    baseURL: 'https://us-central1-fishing-game-cosmize.cloudfunctions.net',
})
