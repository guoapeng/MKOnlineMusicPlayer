/**************************************************
 * MKOnlinePlayer v2.4
 * 封装函数及UI交互模块
 * 编写：mengkun(https://mkblog.cn)
 * 时间：2018-3-11
 *************************************************/
$(function () {
    if (mkPlayer.debug) {
        console.warn('播放器调试模式已开启，正常使用时请在 js/player.js 中按说明关闭调试模式');
    }
    rem.isMobile = device.isMobile();      // 判断是否是移动设备
    rem.webTitle = document.title;      // 记录页面原本的标题
    rem.errCount = 0;                   // 连续播放失败的歌曲数归零
    rem.controlPanel = new ControlPanel();
    rem.controlPanel.initProgress();     // 初始化音量条、进度条（进度条初始化要在 Audio 前，别问我为什么……）
    rem.controlPanel.initAudio();    // 初始化 audio 标签，事件绑定

    rem.mainList = new MainList(rem.isMobile);
    rem.mainList.init();
    rem.downloader = new Downloader();
    rem.dataSaver = new DataSaver();
    rem.coverManager = new CoverManager();
    rem.ajaxShare = new AjaxShare();
    rem.dataFetcher = new DataFetcher();
    
    rem.sheetList = new SheetList(rem.isMobile);
    
    rem.sheetList.initializeMusicSheet();
    rem.controlPanel.initializeControlPanel();
    rem.controlPanel.initBg();
    // 初始化播放列表
    rem.sheetList.initList();
});

