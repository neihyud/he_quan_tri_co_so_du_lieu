const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const { google } = require('googleapis')
var CronJob = require('cron').CronJob
const dotenv = require('dotenv')
dotenv.config()

const DB_URI =
    'mongodb+srv://admin:abc12345@cluster0.mmi1upr.mongodb.net/database01'

const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
})

async function uploadFile(name, filePath) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: `${name}`, //file name
                mimeType: 'application/gzip',
                parents:["1bNkMp4OFygZ-bz6CHL16ABRaus9nsxZR"],
            },
            media: {
                mimeType: 'application/gzip',
                body: fs.createReadStream(filePath),
            },
        })
        // report the response from the request
        console.log('DATA ==========================', response.data)
    } catch (error) {
        //report the error message
        console.log(error)
    }
}

var job = new CronJob(
    '*/2 * * * * *',
    function () {
        backupMongoDB()
    },
    null,
    true,
    'America/Los_Angeles'
)

function backupMongoDB() {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const ARCHIVE_PATH = path.join(
        __dirname,
        'backup',
        `${day}-${month}-${year}.gzip`
    )

    const child = spawn('mongodump', [
        `--uri=${DB_URI}`,
        `--archive=${ARCHIVE_PATH}`,
        '--gzip',
    ])

    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data)
    })
    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString())
    })

    child.on('error', (error) => {
        console.log('error:\n', error)
    })
    child.on('exit', (code, signal) => {
        if (code) console.log('Process exit with code:', code)
        else if (signal) console.log('Process killed with signal:', signal)
        else {
            console.log('Backup is successfull ✅')

            uploadFile(`${day}-${month}-${year}`, ARCHIVE_PATH)
        }
    })
}

job.start()
