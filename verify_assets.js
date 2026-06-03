const https = require('https');
const base = 'https://martlet121.github.io';
const page = base + '/guide/1-intro.html';
function fetch(url, cb) {
  https.get(url, res => { let s = ''; res.on('data', c => s += c.toString()); res.on('end', () => cb(null, s)); }).on('error', e => cb(e));
}
fetch(page, (err, html) => {
  if (err) { console.error('ERR', err.message); process.exit(3); }
  const hp = html.indexOf('高级协议');
  const i40_html = html.indexOf('40 HTTP2');
  const i41_html = html.indexOf('41 前置代理');
  console.log('HTML indices:', {hp, i40_html, i41_html});
  if (i40_html > -1 && i41_html > -1 && hp > -1 && i40_html > hp && i41_html > hp) {
    console.log('OK: labels present in HTML under 高级协议');
    process.exit(0);
  }
  const m = html.match(/src=\"(\/assets\/js\/app\.[^\"]+\.js)\"/);
  if (!m) { console.log('No app.js found in HTML'); process.exit(2); }
  const appurl = base + m[1];
  console.log('Found app.js:', appurl);
  fetch(appurl, (err2, appjs) => {
    if (err2) { console.error('ERR', err2.message); process.exit(3); }
    const hp2 = appjs.indexOf('高级协议');
    const i40 = appjs.indexOf('40 HTTP2');
    const i41 = appjs.indexOf('41 前置代理');
    console.log('app.js indices:', {hp2, i40, i41});
    if (i40 > -1 && i41 > -1 && hp2 > -1 && i40 > hp2 && i41 > hp2) {
      console.log('OK: labels present in app.js under 高级协议');
      process.exit(0);
    } else {
      console.log('FAILED: labels not found in app.js');
      const idx = Math.min((i40>-1?i40:1e9),(i41>-1?i41:1e9));
      console.log('Snippet near found index:', idx<1e9 ? appjs.substr(Math.max(0, idx-100), 400) : appjs.substr(0,400));
      process.exit(2);
    }
  });
});
