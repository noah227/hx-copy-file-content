const cozip = require("cozip")
const publishName = `${require("./package.json").name}.zip`

;(() => {
    cozip(publishName, [
        ["./extension.js", false],
        ["./node_modules/filesize/", true],
        ["./package.json", false],
    ], err => {
        if (err) console.error(err)
        else {
            console.log("打包完成, 文件大小", (require("fs").statSync(publishName).size / 1024).toFixed(2), "KB")
        }
    })
})()
