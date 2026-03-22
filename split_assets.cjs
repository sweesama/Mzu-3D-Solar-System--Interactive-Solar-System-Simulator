const fs = require('fs');

console.log("Starting split...");
const html = fs.readFileSync('index.html', 'utf8');

const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>');

let styleStr = '';
let newHtml = html;

if (styleStart !== -1 && styleEnd !== -1) {
    const fullStyleBlock = html.substring(styleStart, styleEnd + '</style>'.length);
    styleStr = html.substring(styleStart + '<style>'.length, styleEnd).trim();
    fs.writeFileSync('style.css', styleStr, 'utf8');
    console.log('Created style.css');
    newHtml = newHtml.replace(fullStyleBlock, '<link rel="stylesheet" href="style.css">');
}

const scriptStartStr = '<script>';
const scriptEndStr = '</script>';

let currentIndex = 0;
let scriptsList = [];

while (true) {
    const start = newHtml.indexOf(scriptStartStr, currentIndex);
    if (start === -1) break;
    const end = newHtml.indexOf(scriptEndStr, start);
    if (end === -1) break;
    
    const content = newHtml.substring(start + scriptStartStr.length, end);
    const fullBlock = newHtml.substring(start, end + scriptEndStr.length);
    scriptsList.push({ start, end, content, fullBlock });
    currentIndex = end + scriptEndStr.length;
}

if (scriptsList.length > 0) {
    const mainScript = scriptsList.reduce((prev, curr) => curr.content.length > prev.content.length ? curr : prev);
    
    fs.writeFileSync('main.js', mainScript.content.trim(), 'utf8');
    console.log('Created main.js');
    
    const newScriptTags = '<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>\n    <script src="main.js"></script>';
    newHtml = newHtml.replace(mainScript.fullBlock, newScriptTags);
    
    fs.writeFileSync('index.html', newHtml, 'utf8');
    console.log('Updated index.html safely!');
} else {
    console.error('No scripts found!');
}
