import type { PkgInfo } from "../types";

// 通过路由地址，解析获取包名
const getPkgName = () => {
  const owner = window.location.pathname.split("/")?.[2] || "";
  const pkgName = window.location.pathname.split("/")?.[3] || "";
  return pkgName ? `${owner}/${pkgName}` : owner;
};

// 具体请求交给 service wroker处理，不受跨域限制
const getPkginfo = async (pkgName: string) => {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "GET_PKG_INFO",
      pkgName,
    });

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("获取包信息失败：", error);
    return null;
  }
};

// 获取得分信息 https://api-docs.npms.io/#api-Package-GetPackageInfo
const getPkgScore = async (pkgName: string) => {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "GET_PKG_SCORE",
      pkgName,
    });

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("获取包信息失败：", error);
    return null;
  }
};

//渲染包名信息
const renderPkgInfo = (info: PkgInfo) => {
  const sideBar = document.querySelector(".fdbf4038"); // 侧边栏
  if (sideBar) {
    // 渲染总标题
    const title = document.createElement("div");

    title.style =
      "font-weight: 600;font-size: 18px;color: #000;margin-bottom: 8px";
    title.innerText = `${info.name} 信息`;

    const container = document.createElement("div");
    container.appendChild(title);

    // 渲染相似npm包
    if (info.related_package_names?.length) {
      const relatedContainer = document.createElement("div");
      relatedContainer.style.marginBottom = "8px";
      relatedContainer.style.color = "rgba(0, 0, 0, 0.6)";
      relatedContainer.style.fontWeight = "500";
      relatedContainer.style.fontSize = "14px";

      const relatedTitle = document.createElement("div");
      relatedTitle.innerText = "相似npm包";
      relatedTitle.style.marginBottom = "8px";
      relatedTitle.style.color = "rgba(0, 0, 0)";
      relatedContainer.appendChild(relatedTitle);
      info.related_package_names.forEach((name) => {
        const relatedItem = document.createElement("div");
        relatedItem.style.color = "rgb(9, 105, 218)";
        relatedItem.style.cursor = "pointer";
        relatedItem.style.fontSize = "16px";
        relatedItem.innerText = name;
        relatedItem.style.marginTop = "8px";
        relatedItem.style.marginBottom = "8px";
        // 增加点击事件
        relatedItem.onclick = () => {
          window.open(`https://www.npmjs.com/package/${name}`);
        };
        relatedContainer.appendChild(relatedItem);
      });
      container.appendChild(relatedContainer);

      // 渲染npm包比较
      const compareBtn = document.createElement("div");
      compareBtn.innerText = "比较";
      compareBtn.style.margin = "8px 0";
      compareBtn.style.fontSize = "14px";
      compareBtn.style.cursor = "pointer";
      compareBtn.style.color = "#cb3837";
      compareBtn.onclick = () => {
        const queryies = [pkgName, ...info.related_package_names].join(",");
        window.open(`https://npm-compare.com/zh-CN/${queryies}`);
      };
      container.appendChild(compareBtn);
    }

    // 渲染体积分析按钮
    const sizeBtn = document.createElement("div");
    sizeBtn.innerText = "体积分析";
    sizeBtn.style.margin = "8px 0";
    sizeBtn.style.fontSize = "14px";
    sizeBtn.style.cursor = "pointer";
    sizeBtn.style.color = "rgb(203, 56, 55)";
    sizeBtn.style.padding = "0";
    sizeBtn.onclick = () => {
      window.open(` https://bundlephobia.com/package/${info.name}`);
    };

    container.appendChild(sizeBtn);

    const descTitle = document.createElement("div");
    descTitle.style =
      "font-weight: 600;font-size: 14px;color: #000;margin-bottom: 8px";
    descTitle.innerText = "简介";
    container.appendChild(descTitle);

    const descContainer = document.createElement("div");
    descContainer.style.maxHeight = "4.5em"; // 默认显示约3行
    descContainer.style.lineHeight = "1.5";
    descContainer.style.overflow = "hidden";
    descContainer.style.color = "rgba(0, 0, 0, 0.8);";
    descContainer.style.transition = "max-height 0.3s ease-out";
    descContainer.innerText = info.related_package_desc;

    // 创建展开/收起按钮
    const toggleBtn = document.createElement("button");
    toggleBtn.innerText = "显示更多";
    toggleBtn.style.fontSize = "14px";
    toggleBtn.style.marginTop = "8px";
    toggleBtn.style.color = "#0969da";
    toggleBtn.style.background = "none";
    toggleBtn.style.border = "none";
    toggleBtn.style.padding = "0";
    toggleBtn.style.cursor = "pointer";

    let isExpanded = false;
    toggleBtn.onclick = () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        descContainer.style.maxHeight = "none";
        toggleBtn.innerText = "收起";
      } else {
        descContainer.style.maxHeight = "3em";
        toggleBtn.innerText = "显示更多";
      }
    };

    container.appendChild(descContainer);
    container.appendChild(toggleBtn);
    sideBar.insertBefore(container, sideBar.firstChild);
  }
};

// 计算得分信息
const getScore = (score: number) => {
  return `${Math.floor(score * 100)} / 100`;
};

// 渲染得分信息
const renderPkgScore = (info: PkgInfo) => {
  const container = document.querySelector("#top > div");
  if (info.score.final && container) {
    const score = document.createElement("span");
    score.className = "f6 dib ph0 pv2 ml2 mb2-ns black-80 nowrap f5 fw4";
    score.innerText = "";
    score.innerText += `综合得分：${getScore(info.score.final)}`;
    if (info.score.detail) {
      score.innerText += `，流行度：${getScore(
        info.score.detail.popularity
      )}，质量：${getScore(info.score.detail.quality)}`;
    }

    console.log("info.score>>", info.score);
    container.appendChild(score);
  }
};

const pkgName = getPkgName();
if (pkgName) {
  getPkgScore(pkgName).then((info) => {
    if (info) {
      renderPkgScore(info);
    }
  });
  getPkginfo(pkgName).then((info) => {
    if (info) {
      renderPkgInfo(info);
    }
  });
}
