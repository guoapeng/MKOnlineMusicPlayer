/**************************************************
 * MKOnlinePlayer v2.4
 * 封装函数及UI交互模块
 * 编写：mengkun(https://mkblog.cn)
 * 时间：2018-3-11
 *************************************************/
// 播放器功能配置
"use strict";
var mkPlayer = {
    api: "api.php", // api地址
    loadcount: 20,  // 搜索结果一次加载多少条
    method: "GET",     // 数据传输方式(POST/GET)
    defaultlist: 3,    // 默认要显示的播放列表编号
    autoplay: false,    // 是否自动播放(true/false) *此选项在移动端可能无效
    coverbg: true,      // 是否开启封面背景(true/false) *开启后会有些卡
    mcoverbg: true,     // 是否开启[移动端]封面背景(true/false)
    dotshine: true,    // 是否开启播放进度条的小点闪动效果[不支持IE](true/false) *开启后会有些卡
    mdotshine: false,   // 是否开启[移动端]播放进度条的小点闪动效果[不支持IE](true/false)
    volume: 0.6,        // 默认音量值(0~1之间)
    version: "v2.41",    // 播放器当前版本号(仅供调试)
    debug: true   // 是否开启调试模式(true/false)
};

/*******************************************************
 * 以下内容是播放器核心文件，不建议进行修改，否则可能导致播放器无法正常使用!
 * 
 * 哈哈，吓唬你的！想改就改呗！不过建议修改之前先【备份】,要不然改坏了弄不好了。
 * about player.js,以上注释是从player.js, 以前有很长一段代码, 包含的功能太多, 
 * 不符合单一职责原则,现在全打散到相应的类中去了.
 * 哈哈, 我全改了, 整个文件都分解了, 连文件名字都修改了, 2021-10-20 by eagle.
 ******************************************************/
// 存储全局变量
var rem = [];

// 我的要求并不高，保留这一句版权信息可好？
// 保留了，你不会损失什么；而保留版权，是对作者最大的尊重。
console.info('欢迎使用 MKOnlinePlayer!\n当前版本：'+mkPlayer.version+' \n作者：mengkun(https://mkblog.cn)\n歌曲来源于各大音乐平台\nGithub：https://github.com/mengkunsoft/MKOnlineMusicPlayer');

$(function () {
    if (mkPlayer.debug) {
        console.warn('播放器调试模式已开启，正常使用时请在 js/main.js 中按说明关闭调试模式');
    }
    rem.isMobile = device.isMobile();       // 判断是否是移动设备
    rem.webTitle = document.title;          // 记录页面原本的标题
    rem.errCount = 0;        
    rem.dataSaver = new DataSaver();        // 连续播放失败的歌曲数归零
    rem.controlPanel = new ControlPanel();
    // 初始化播放进度条
    var music_bar = new ProgressBar("#music-progress", 0, true); // 未播放时锁定不让拖动
    var volume_bar = new VolumeBar("#volume-progress", false);

    rem.controlPanel.initAudio();           // 初始化 audio 标签，事件绑定
    rem.controlPanel.initialize();
    rem.controlPanel.initBg();
    
    rem.mainList = new MainList(rem.isMobile);
    rem.mainList.init();
    rem.downloader = new Downloader();
    
    rem.coverManager = new CoverManager();
    rem.ajaxShare = new AjaxShare();
    rem.dataFetcher = new DataFetcher();
    
    rem.sheetList = new SheetList(rem.isMobile);
    
    rem.sheetList.initializeMusicSheet();

    // 初始化播放列表
    rem.sheetList.initList();
});


// 快捷键切歌，代码来自 @茗血(https://www.52benxi.cn/)
//TODO: 这一段应该找个合适的地方存放, 需要给它找个主人
//比如keyboard handler, controller, manager之类的
document.onkeydown = function showkey(e) {
    var key = e.keyCode || e.which || e.charCode;
    var ctrl = e.ctrlKey || e.metaKey;
    var isFocus = $('input').is(":focus");  
    if (ctrl && key == 37) rem.controlPanel.playList(rem.playid - 1);    // Ctrl+左方向键 切换上一首歌
    if (ctrl && key == 39) rem.controlPanel.playList(rem.playid + 1);    // Ctrl+右方向键 切换下一首歌
    if (key == 32 && isFocus == false) rem.controlPanel.pause();         // 空格键 播放/暂停歌曲
}