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
    dataset: { copyExclude: attrs.exclude },
    matches(selector) { return selector.split(',').some(s => s.trim() === tag || (s.trim() === '.row' && attrs.row)); },
    querySelector(selector) { return children.find(c => selector === 'b.row-main' ? c.tagName === 'B' && c.main : c.main) || null; },
    main: attrs.main
  };
}
function header(label, date) {
  return element('div', '', [element('b', label, [], { main: true }), element('span', date)], { row: true });
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
assert.equal(entries[0].parts.join('\n'), 'Work overview.\nA fully bold description.\nFirst contribution.\nSecond contribution.');
assert.equal(entries[1].parts.join('\n'), 'Project description.');
assert(!entries[0].parts.join('\n').includes('2024'));
assert(!entries[0].parts.join('\n').includes('Example department'));
editedBullet.innerText = 'Edited contribution.';
assert(context.collectCopyEntries(page)[0].parts.includes('Edited contribution.'));
const zhPage = element('main', '', [element('h2', '项目经历'), header('示例项目', '2025'), element('p', '项目背景。'), element('ul', '', [element('li', '项目正文。')])]);
assert.equal(context.collectCopyEntries(zhPage)[0].parts.join('\n'), '项目背景。\n项目正文。');
console.log('PASS: grouping, metadata exclusion, bold descriptions, ordering, live edits, English and Chinese text, editor syntax.');
