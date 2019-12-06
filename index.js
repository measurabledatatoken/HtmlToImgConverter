const puppeteer = require('puppeteer');
const path = require('path');
const program = require('commander');
const fsPromises = require('fs').promises;
const fs = require('fs');


const convertHtmlInFolderToToJPG = async (inputFolders, outputFolders) => {
  const inputFolderArray = inputFolders.split(',');
  const outputFolderArray = outputFolders.split(',');
  if (inputFolderArray.length !== outputFolderArray.length) {
    console.error('input folder length number need to be same as output folder array length!');
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < inputFolderArray.length; i++) {
    const inputFolder = inputFolderArray[i];
    const outputFolder = outputFolderArray[i];

    const fileList = await fsPromises.readdir(inputFolder);
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

        if (!fs.existsSync(outputFolder)) {
          fs.mkdirSync(outputFolder);
        }
        await page.screenshot({ path: outPutUrl, fullPage: true });
      }
    }
  }
  await browser.close();
};


program
  .option('-d, --dirs <dirs>', 'array of directory of html to convert seperate in comma');
program
  .option('-o, --outputDirs <outputDirs>', 'the directory to export the masked html');
program.parse(process.argv);

if (program.dirs) {
  convertHtmlInFolderToToJPG(program.dirs, program.outputDirs);
}
