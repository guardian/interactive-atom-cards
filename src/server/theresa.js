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

        const theresa = headers[6]

        await theresa.click()

        setTimeout(async () => {

        const data = await page.$$eval('outright-item', els => {
            
            const el = els.slice(-1)[0]

            const name = el.querySelector('.outright-item__runner-name').innerHTML.trim()
            const odds = el.querySelector('.btn-odds').innerHTML.replace('<!---->', '').trim()

            return [ name, odds ]
        
        })

        console.log(data)

        const ts = moment().format('YYYY-MM-DD_HHmmss')

        fs.writeFileSync(`./src/server/data/may_${ts}.json`, JSON.stringify(data))

        console.log('Saved file for', ts)

        await browser.close()

        }, 1000)
        

    }, 1000)

    

}

main()