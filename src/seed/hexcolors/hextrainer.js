import OnyxScrape from "../../scraping/OnyxScrape";

const requestHexColors = async () => {
   let data = await new OnyxScrape(
      "https://www.w3schools.com/tags/ref_colornames.asp",
      "td",
      "/colors/color_tryit"
    );
    console.log(data);
}

requestHexColors()