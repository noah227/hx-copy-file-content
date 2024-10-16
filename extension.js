var hx = require("hbuilderx");
const fs = require("fs")
//该方法将在插件激活的时候调用
function activate(context) {
    const sizeWarningLimit = 5 * 1024 * 1024
    const getSizeWarningLimit = () => {
        const _ = hx.workspace.getConfiguration().get("hx-copy-file-content.sizeWarningLimit", sizeWarningLimit)
        if(_ === 0) return Infinity
        if(_ < 0 || typeof _ !== "number") {
            hx.window.showErrorMessage([
                "<div>【文件内容复制】：<br>",
                "插件<b>文件过大预警值</b>配置无效，已使用默认的尺寸限制（5MB）",
                "</div>"
            ].join(""))
            return sizeWarningLimit
        }
        return _
    }
    
	const copyAction = (fsPath) => {
		try {
			hx.env.clipboard.writeText(fs.readFileSync(fsPath, {encoding: "utf8"}))
			hx.window.setStatusBarMessage("已复制文件内容到剪贴板！", 5000)
		}
		catch(e) {
			hx.window.showErrorMessage(e.message)
		}
	}
	let disposable = hx.commands.registerCommand('extension.copyFileContent', (ctx) => {
		const fsPath = ctx.fsPath
		
		// Byte
		const size = fs.statSync(fsPath).size
        const sizeLimit = getSizeWarningLimit()
		if(size > sizeLimit) {
            const filesize = require("filesize")
			hx.window.showMessageBox({
				title: "提示",
				text: [
                    `当前文件过大（${filesize.filesize(size, {base: 2})}），是否继续复制文件内容？`,
                    `可在插件配置里调整大小限制（当前限制：${filesize.filesize(sizeLimit, {base: 2})}）`
                ].join("\n\n"),
				buttons: ["取消", "复制"],
				defaultButton: "取消"
			}).then(button => {
				if(button === "复制") copyAction(fsPath)
			})
		}
		else copyAction(fsPath)

	});
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	context.subscriptions.push(disposable);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}
