const curl = new (require('curl-request'))();
const jsdom = require("jsdom");
const fs = require('fs')
const { JSDOM } = jsdom;
import moment from 'moment'

curl
.get('http://sports.williamhill.com/bet/en-gb/betting/e/9592071/Party%20Leader%20Betting.html')
.then(({ body }) => {
    const dom = new JSDOM(body);
    
    return Array.from(dom.window.document.querySelector('#ip_marketBody383949661').querySelectorAll('td')).map(d => {
      const rawOdd = d.querySelector('div').querySelector('.eventprice').innerHTML.trim().split('/')
      return {
        candidate: d.querySelector('div').querySelector('.eventselection').innerHTML.trim(),
        odd: (Number(rawOdd[0]) / Number(rawOdd[1])) + 1
      }
    })
  }).then(odds => {

    const ts = moment().format('YYYY-MM-DD_HHmmss')
    fs.writeFileSync(`./src/server/williamhill/toryOdds_${ts}.json`, JSON.stringify(odds))
    console.log('wrote file for', ts)
  
  })
.catch((e) => {
    console.log(e);
});
