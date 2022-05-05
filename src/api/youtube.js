import axios from "axios";
import { REACT_APP_YOUTUBE_API_KEY } from "@env";
export default axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    params: {
        part: "snippet",
        key: REACT_APP_YOUTUBE_API_KEY,
    },
    headers: {},
});
