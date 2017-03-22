'use strict'

require('dotenv').config()

const getIt = require('get-it')
const promise = require('get-it/lib/middleware/promise')
const jsonRequest = require('get-it/lib/middleware/jsonRequest')
const prettyMs = require('pretty-ms')
const request = getIt([promise(), jsonRequest()])

const channel = process.env.SLACK_CHANNEL || '#windward'
const iconUrl = process.env.SLACK_ICON_URL || 'http://i.imgur.com/sEuub5r.png'
const slackUsername = process.env.SLACK_USERNAME || 'Windward'
const webhookUrl = process.env.SLACK_WEBHOOK_URL
const statsUrl = process.env.WINDWARD_SERVER_URL
const interval = Math.max(1, (parseInt(process.env.POLL_INTERVAL, 10) || 5)) * 1000

const lastJoined = {}
let prevState = null

function fetch () {
  request(statsUrl).then(update).catch(onError)
}

function update (res) {
  const newPlayers = parsePlayers(res.body)
  if (!prevState) {
    prevState = newPlayers
    return
  }

  for (let i = 0; i < prevState.length; i++) {
    const player = prevState[i]
    if (newPlayers.indexOf(player) === -1) {
      const joined = lastJoined[player]
      const joinedText = joined ? ` after playing for ${prettyMs(Date.now() - joined)}` : ''
      notify(`${player} left the game${joinedText}`)
    }
  }

  for (let i = 0; i < newPlayers.length; i++) {
    const player = newPlayers[i]
    if (prevState.indexOf(player) === -1) {
      notify(`${player} joined the game`)
      lastJoined[player] = Date.now()
    }
  }

  prevState = newPlayers
}

function parsePlayers (players) {
  return players.trim().split('\n').slice(2).map(parsePlayer).sort()
}

function parsePlayer (line) {
  return line.split(/\s+/).slice(1).join(' ')
}

function onError (err) {
  console.error(err)
}

function notify (text) {
  return request({
    url: webhookUrl,
    method: 'POST',
    timeout: Math.floor(interval * 0.9),
    body: {
      channel: channel,
      username: slackUsername,
      text: text,
      icon_url: iconUrl
    }
  }).catch(onError)
}

function run () {
  if (!/^https:\/\/hooks.slack.com\//.test(webhookUrl)) {
    onError(new Error('SLACK_WEBHOOK_URL must be set to an url that starts with https://hooks.slack.com'))
    process.exit(1)
  }

  if (!/^https?:\/\//.test(statsUrl)) {
    onError(new Error('WINDWARD_SERVER_URL must be set to an http URL, for instance: http://192.168.1.11:5127/'))
    process.exit(1)
  }

  if (!/\/$/.test(statsUrl)) {
    onError(new Error('WINDWARD_SERVER_URL must end with a trailing slash, for instance: http://192.168.1.11:5127/'))
    process.exit(1)
  }

  setInterval(fetch, interval)
}

run()
