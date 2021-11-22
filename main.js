const { app, BrowserWindow, globalShortcut } = require('electron')
const fs = require('fs')
const fetch = require('node-fetch')
process.discord = require('./discord.js')

var config = {
    "host": "http://127.0.0.1",
    "token": ""
}
if (!fs.existsSync('config.json')) fs.writeFileSync('config.json', JSON.stringify(config, null, '\t'))
process.env = JSON.parse(fs.readFileSync('config.json'))

app.on('ready', () => {
    process.Window = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        autoHideMenuBar: true,
        darkTheme: true,
        icon: './assets/images/fav.ico',
        title: 'Horizons Link'
    })

    globalShortcut.register('f5', () => process.Window.reload())

    process.Window.loadFile('./public/loading.html')
})



//!
//! Express
//!

const express = require('express')
const exp = express()
exp.listen(3000, () => {
    console.log('Server started on port 3000')
})
exp.set('view engine', 'ejs')
exp.use('/assets', express.static('assets'))

fs.readdirSync('./app').forEach(file => {
    if (file.includes('.js')) {
        require(`./app/${file}`)(exp)
    }
})



//!
//! Login Verify
//!

fetch(`${process.env.host}/user?token=${process.env.token}`)
    .then(res => {
        if (res.status === 200) {
            process.Window.loadURL('http://localhost:3000')
        } else {
            process.Window.loadFile('./public/login.html')
        }
    })
    .catch(err => console.log(err))