import puppeteer from 'puppeteer'
import moment from 'moment'
import fs from 'fs'

const url = 'https://www.paddypower.com/politics/uk-party-leaders/uk-party-leaders-28051208'

const main = async () => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(url)

    setTimeout( async () => {

        const headers = await page.$$('.accordion__header', el => el)

        const toryLeader = headers[3]

        await toryLeader.click()

        setTimeout(async () => {

        const list = await page.$$eval('outright-item', els => els.map( el => {
            
            const name = el.querySelector('.outright-item__runner-name').innerHTML.trim()
            const odds = el.querySelector('.btn-odds').innerHTML.replace('<!---->', '').trim()

            return [ name, odds ]
        
        }))

        console.log(list)

        const ts = moment().format('YYYY-MM-DD_HHmmss')

        fs.writeFileSync(`./src/server/data/odds_${ts}.json`, JSON.stringify(list))

        console.log('Saved file for', ts)

        await browser.close()

        }, 500)
        

    }, 1000)

    

}

main()