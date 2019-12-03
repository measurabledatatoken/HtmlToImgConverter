const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const program = require('commander');


const convertHtmlInFolderToToJPG = async (inputFolder, outputFolder) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();


  const fileList = await fs.readdir(inputFolder);
  for (const file of fileList) {
    if (path.extname(file) === '.html') {
      const url = `file://${inputFolder}/${file}`;
      await page.setViewport({
        width: 1080,
        height: 1920,
        deviceScaleFactor: 1,
      });
      await page.goto(url);
      const fileName = file.split('.').slice(0, -1).join('.');
      const outPutUrl = `${outputFolder}/${fileName}.jpg`;
      await page.screenshot({ path: outPutUrl, fullPage: true });
    }
  }

  await browser.close();
};


program
  .option('-d, --dir <dir>', 'the directory of html to conver');
program
  .option('-o, --output <output>', 'the directory to export the image');
program.parse(process.argv);

if (program.dir) {
  convertHtmlInFolderToToJPG(program.dir, program.output);
}
