const { spawn } = require('child_process')
const path = require('path')

const DB_URI =
    'mongodb+srv://admin:abc12345@cluster0.mmi1upr.mongodb.net/database01'

var CronJob = require('cron').CronJob
var job = new CronJob(
    '*/5 * * * * *',
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
    const ARCHIVE_PATH = path.join(__dirname, 'backup', `${day}-${month}-${year}.gzip`)

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
        else console.log('Backup is successfull ✅')
    })
}

job.start()
