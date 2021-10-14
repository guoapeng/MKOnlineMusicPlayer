SheetList = function(isMobile) {
    if (isMobile) {  // 加了滚动条插件和没加滚动条插件所操作的对象是不一样的
        this.listContainer = $("#sheet");
    } else {
        // 滚动条初始化(只在非移动端启用滚动条控件)
        $("#sheet").mCustomScrollbar({
            theme: "minimal",
            advanced: {
                updateOnContentResize: true // 数据更新后自动刷新滚动条
            }
        });

        this.listContainer = $("#sheet .mCSB_container");
    }
}

SheetList.protype = {
    
}