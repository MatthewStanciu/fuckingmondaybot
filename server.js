import express from 'express'
import { IgApiClient } from 'instagram-private-api'
import * as Bluebird from 'bluebird'
import schedule from 'node-schedule'
import 'babel-polyfill'
import { readFile } from 'fs'

const app = express()
const http = require('http').Server(app)
const img = './FuckingMonday.jpg'
const ig = new IgApiClient()

async function login() {
  ig.state.generateDevice('fuckingmondaybot')
  await ig.account.login('fuckingmondaybot', process.env.PASSWORD)
}

const fuckingMonday = schedule.scheduleJob({ dayOfWeek: 1, hour: 7, minute: 30 }, () => {
  (async () => {
    console.log("it's fucking monday! posting new image...")
    await login()

    const publishResult = await ig.publish.photo({
      file: await Bluebird.fromCallback(cb => readFile(img, cb))
    })

    console.log('Uploaded new Fucking Monday image!')
  })()
})

http.listen(3000)
