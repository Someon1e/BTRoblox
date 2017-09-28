"use strict"

localStorage.removeItem("cssCache") // Legacy cleanup

MESSAGING.listen({
	getSettings(data, respond) {
		Settings.get(settings => {
			respond(settings)
		})
	},
	setSetting(data, respond) {
		Settings.set(data)
		respond(true)
	},
	getRankName(data, respond) {
		const url = `https://www.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRole&playerid=${data.userId}&groupid=${data.groupId}`
		fetch(url).then(async resp => respond(await resp.text()))
	},
	downloadFile(url, respond) {
		fetch(url, { credentials: "include" })
			.then(async response => {
				const blob = await response.blob()
				respond(URL.createObjectURL(blob))
			})
			.catch(ex => {
				console.error("[cshandler] downloadFile error", ex)
				respond(null)
			})
	},
	requestBlogFeed(_, respond) {
		Blogfeed.get(respond)
	},
	_execScripts(list, respond, port) {
		const promises = list.map(path => new Promise(resolve => {
			chrome.tabs.executeScript(port.sender.tab.id, { file: path, runAt: "document_start", frameId: port.sender.frameId }, resolve)
		}))

		Promise.all(promises).then(respond)
	}
});