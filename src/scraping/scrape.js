import {axios} from "axios";

export const Scrape = async (url) => {
   const scrapedData = await axios.get(url).then(response => {
      console.log(response);
      return response;
   }).catch(error=>{
      console.error(error);
      return false;
   });
}

const getScrapedContent = (url) => {

}