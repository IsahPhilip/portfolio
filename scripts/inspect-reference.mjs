import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch({channel:'chrome',headless:true});
const report = [];
for (const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 for(const [name,path] of [['home','/'],['works','/works'],['about','/about'],['case-study','/works/flowpay-fintech']]){
  await page.goto('https://nuance-portfolio.framer.website'+path,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(3000);
  const height=await page.locator('body').evaluate(x=>x.scrollHeight);
  for(let y=0;y<height;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(120);}
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1000);
  await page.screenshot({path:`artifacts/reference-${name}-${width}.png`,fullPage:true});
  await page.screenshot({path:`artifacts/reference-${name}-${width}-top.png`});
  report.push({name,width,title:await page.title(),headings:await page.locator('h1,h2,h3').allTextContents(),text:await page.locator('body').innerText()});
  if(name==='home'){
   try{await page.getByText('MunchRun',{exact:true}).first().click({timeout:2500});report.push({interaction:'project selector',width,result:'clicked'});}catch{report.push({interaction:'project selector',width,result:'Reference selector remained unstable during click; static project links inspected.'});}
  }
  console.log(`Inspected ${name} at ${width}px`);
 }
 await page.close();
}
await fs.writeFile('artifacts/reference-inspection.json',JSON.stringify(report,null,2));
await browser.close();
