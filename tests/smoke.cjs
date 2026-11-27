const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const base = 'http://127.0.0.1:8765';
const example = name => path.join(__dirname, '..', 'examples', name + '.example.json');

async function readDownload(page, button) {
  const [download] = await Promise.all([page.waitForEvent('download'), button.click()]);
  assert.equal(await download.failure(), null);
  return JSON.parse(await fs.readFile(await download.path(), 'utf8'));
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    const unexpected = [];
    page.on('pageerror', err => unexpected.push(err.message));
    page.on('request', req => {
      if (/^https?:/.test(req.url()) && new URL(req.url()).origin !== base) unexpected.push(req.url());
    });
    page.on('dialog', dialog => dialog.accept());
    await page.goto(base);
    assert.equal(await page.locator('.ccard').count(), 0);
    await page.locator('#importFile').setInputFiles(example('crm'));
    await page.getByText('演示客户甲', {exact:true}).waitFor();
    assert.equal(await page.locator('.ccard').count(), 2);
    await page.getByRole('button', {name:'交付流程', exact:true}).click();
    assert.equal(await page.locator('.ccard').count(), 1);
    await page.getByText('演示客户乙', {exact:true}).click();
    await page.locator('#logInput').fill('已确认材料清单');
    await page.locator('#logInput').press('Enter');
    await page.getByRole('button', {name:'保存', exact:true}).click();
    await page.reload();
    const customers = await readDownload(page, page.getByRole('button', {name:'导出', exact:true}));
    assert.ok(customers.find(c => c.name === '演示客户乙').logs.some(log => log.text === '已确认材料清单'));
    await page.locator('#importFile').setInputFiles({
      name:'backup.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(customers))
    });
    await page.getByText('导入成功', {exact:true}).waitFor();
    await page.getByRole('button', {name:'表格', exact:true}).click();
    assert.equal(await page.locator('#tableBody tr').count(), 2);
    assert.deepEqual(unexpected, []);
    console.log('CRM passed import, persistence, export and restore checks.');
  } finally {
    await browser.close();
  }
}

run().catch(err => { console.error(err); process.exitCode = 1; });
