const fs = require('fs');
const pdf = require('pdf-parse');

async function parse() {
    let mobileDataBuffer = fs.readFileSync('PageSpeed Insights mobile.pdf');
    let mobileData = await pdf(mobileDataBuffer);
    console.log("--- MOBILE REPORT ---");
    console.log(mobileData.text.substring(0, 2000));

    let laptopDataBuffer = fs.readFileSync('PageSpeed Insights laptp.pdf');
    let laptopData = await pdf(laptopDataBuffer);
    console.log("\n\n--- LAPTOP REPORT ---");
    console.log(laptopData.text.substring(0, 2000));
}
parse();
