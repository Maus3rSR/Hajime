const fs = require("fs")
const args = process.argv.slice(2)

function callback(err) {
    if (err) throw err
    console.log(`${args[0]} was copied to ${args[1]}`)
}

fs.copyFile(args[0], args[1], callback)