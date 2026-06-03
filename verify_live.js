const https = require('https');
const url = 'https://martlet121.github.io/guide/1-intro.html';
https.get(url, (res) => {
  let s = '';
  res.on('data', (c) => s += c.toString());
  res.on('end', () => {
    const hp = s.indexOf('高级协议');
    const hf = s.indexOf('高级功能');
    const i40 = s.indexOf('40 HTTP2');
    const i41 = s.indexOf('41 前置代理');
    if (i40 > -1 && i41 > -1 && hp > -1 && i40 > hp && i41 > hp && (hf === -1 || (i40 < hf && i41 < hf))) {
      console.log('OK: labels present and under 高级协议');
      process.exit(0);
    } else {
      console.log('FAILED: verification failed');
      const snippets = [
        {name: '高级协议', idx: hp, excerpt: hp>-1 ? s.substr(Math.max(0,hp-100),200) : null},
        {name: '40 HTTP2', idx: i40, excerpt: i40>-1 ? s.substr(Math.max(0,i40-50),100) : null},
        {name: '41 前置代理', idx: i41, excerpt: i41>-1 ? s.substr(Math.max(0,i41-50),100) : null},
        {name: '高级功能', idx: hf, excerpt: hf>-1 ? s.substr(Math.max(0,hf-100),200) : null}
      ];
      console.log(JSON.stringify(snippets, null, 2));
      process.exit(2);
    }
  });
}).on('error', (e) => { console.error('ERR', e.message); process.exit(3); });
