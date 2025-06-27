// background service workder

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PKG_INFO") {
    const pkgName = message.pkgName;
    fetch(`https://npm-compare.com/0_api/zh-CN/packageDetail/${pkgName}.json`)
      .then((res) => res.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // 表示会异步发送响应
  } else if (message.type === "GET_PKG_SCORE") {
    const pkgName = message.pkgName;
    fetch(`https://api.npms.io/v2/package/${pkgName}`)
      .then((res) => res.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // 表示会异步发送响应
  }
});
