// Run with Node.js; no browser or third-party dependencies required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../assets/editable-resume-base.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script); // Verify the complete editor's JavaScript syntax.
const start = script.indexOf('function collectCopyEntries(');
const end = script.indexOf('function buildCopyPanel(', start);
const context = {};
vm.createContext(context);
vm.runInContext(script.slice(start, end), context);
function element(tag, text = '', children = [], attrs = {}) {
  return {
    tagName: tag.toUpperCase(), innerText: text, textContent: text, children,
    dataset: { copyExclude: attrs.exclude, copyField: attrs.field },
    matches(selector) { return selector.split(',').some(s => s.trim() === tag || (s.trim() === '.row' && attrs.row)); },
    querySelector(selector) { if(selector.startsWith('[data-copy-field=')){const field=selector.match(/"([^"]+)"/)[1];return children.find(c=>c.dataset.copyField===field)||children.map(c=>c.querySelector(selector)).find(Boolean)||null;} return children.find(c => selector === 'b.row-main' ? c.tagName === 'B' && c.main : selector === '.row-date' ? c.date : c.main) || null; },
    main: attrs.main, date: attrs.date
  };
}
function header(label, date) {
  return element('div', '', [element('b', label, [], { main: true }), element('span', date, [], {date:true})], { row: true });
}
const boldBody = element('p', 'A fully bold description.', [element('b', 'A fully bold description.')]);
const editedBullet = element('li', 'First contribution.');
const page = element('main', '', [
  element('h2', 'Experience'), header('Example Company | Intern', '2024–2025'),
  element('p', 'Example department', [], { exclude: 'true' }),
  element('p', 'Work overview.'), boldBody,
  element('ul', '', [editedBullet, element('li', 'Second contribution.')]),
  header('Sample Project | Contributor', '2025'),
  element('ul', '', [element('li', 'Project description.')]),
  element('h2', 'Skills'), element('p', 'Must not become project content.')
]);
let entries = context.collectCopyEntries(page);
assert.equal(entries.length, 2);
assert.equal(entries[0].label, 'Example Company | Intern');
assert.equal(entries[0].company, 'Example Company');
assert.equal(entries[0].role, 'Intern');
assert.equal(entries[0].dates, '2024–2025');
assert.equal(entries[0].parts.join('\n'), 'Work overview.\nA fully bold description.\nFirst contribution.\nSecond contribution.');
assert.equal(entries[1].parts.join('\n'), 'Project description.');
assert(!entries[0].parts.join('\n').includes('2024'));
assert(!entries[0].parts.join('\n').includes('Example department'));
editedBullet.innerText = 'Edited contribution.';
assert(context.collectCopyEntries(page)[0].parts.includes('Edited contribution.'));
const zhPage = element('main', '', [element('h2', '项目经历'), header('示例项目', '2025'), element('p', '项目背景。'), element('ul', '', [element('li', '项目正文。')])]);
assert.equal(context.collectCopyEntries(zhPage)[0].parts.join('\n'), '项目背景。\n项目正文。');
console.log('PASS: grouping, metadata exclusion, bold descriptions, ordering, live edits, English and Chinese text, editor syntax.');

const explicit = element('main', '', [element('h2','Experience'), element('div','', [element('b','Example Holdings Limited\nResearch Analyst', [element('span','Example Holdings Limited',[],{field:'company'}),element('span','Research Analyst',[],{field:'role'})],{main:true}),element('span','2023–2025',[],{field:'dates'}),element('span','Example City')],{row:true}),element('p','Work content.')]);
const fields=context.collectCopyEntries(explicit)[0];
assert.equal(fields.company,'Example Holdings Limited');assert.equal(fields.role,'Research Analyst');assert.equal(fields.dates,'2023–2025');assert.equal(fields.parts.join('\n'),'Work content.');
console.log('PASS: separate full employer, role and dates, location exclusion.');
const printStart=script.indexOf('function preparePrint('), printEnd=script.indexOf('function finishPrint(',printStart);
let ratios=[.35,.96], fitted=[];
context.document={body:{classList:{add(){},remove(){},toggle(){}}},querySelectorAll(){return ratios.map((ratio,index)=>({ratio,index}))}};
context.currentBlock=null;context.fitOnePage=(target,compressOnly,sheet)=>{assert.equal(compressOnly,true);fitted.push(sheet.index)};
context.contentMetrics=sheet=>({ratio:sheet.ratio,overflow:sheet.ratio>1});context.updateFitStatus=()=>{};
vm.runInContext(script.slice(printStart,printEnd),context);
assert.equal(context.preparePrint().safe,true);assert.deepEqual(fitted,[0,1]);
ratios=[.96,1.1];assert.equal(context.preparePrint().safe,false);
console.log('PASS: per-language compression-only preflight, under-filled page allowed, overflowing page blocked.');
