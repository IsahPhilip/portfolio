import fs from 'node:fs/promises';
import path from 'node:path';
for (const folder of ['src/components','src/pages','src/layouts']) {
 async function walk(dir){
  for (const e of await fs.readdir(dir,{withFileTypes:true})) {
   const file=path.join(dir,e.name);
   if(e.isDirectory()){await walk(file);continue;}
   if(!file.endsWith('.astro'))continue;
   let text=await fs.readFile(file,'utf8');
   if(!/href="\//.test(text)&&!text.includes('href={`/works/'))continue;
   const configPath=path.relative(path.dirname(file),'src/config').replaceAll('\\','/');
   const importPath=configPath.startsWith('.')?configPath:'./'+configPath;
   text=text.replace('---\n',`---\nimport { link } from '${importPath}';\n`);
   text=text.replace(/href="(\/[^\"]*)"/g,(_,p)=>`href={link('${p}')}`);
   text=text.replace(/href=\{(`\/works\/[^`]*`)\}/g,(_,p)=>`href={link(${p})}`);
   if(file.includes('Header'))text=text.replace('const path = Astro.url.pathname;','const path = Astro.url.pathname.replace(site.base, "") || "/";');
   if(file.includes('Base'))text=text.replace('new URL(image, site.url)','new URL(link(image), site.url)');
   await fs.writeFile(file,text);
  }
 }
 await walk(folder);
}
