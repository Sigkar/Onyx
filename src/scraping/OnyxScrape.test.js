const OnyxScrape = require("./OnyxScrape").OnyxScrape;

// Use the following test functions to call the scraping functions in test suites

test('Onyx should scrape', async () => {
  let data = await new OnyxScrape(
    "https://www.w3schools.com/tags/ref_colornames.asp",
    "td",
    "/colors/color_tryit"
  );
  let strippedArray = [];
  data.forEach( (content) => {
      if(content.substring(0, 1) === "#"){
        strippedArray.push([content]);
      }else{
        strippedArray.push(
          content.split(/([A-Z][a-z]+|[0-9]+)/g).filter( (innerContent) => {
            if(innerContent !== "" && typeof(innerContent) !== "undefined"){
              return innerContent;
            }
          })
        )
      }
  })
  expect(data).toBeTruthy();
});

