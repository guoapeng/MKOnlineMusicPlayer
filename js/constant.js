var CONST = {};
CONST.SEARCH_RESULT_LIST_ID = 0;
CONST.PLAYING_LIST_ID = 1;
CONST.PLAYED_HISTORY_LIST_ID = 2;
CONST.MSG_FINISHED_LOADING = '<div class="list-item text-center" id="list-foot">全都加载完了</div>';
CONST.MSG_CLICK_TO_LOAD_MORE = '<div class="list-item text-center list-loadmore list-clickable" title="点击加载更多数据" id="list-foot">点击加载更多...</div>';
CONST.MSG_PLAYLIST_IS_LOADING = '<div class="list-item text-center" id="list-foot">播放列表加载中...</div>';
CONST.MSG_NOTHING_TO_LOAD = '<div class="list-item text-center" id="list-foot">可能是个假列表，什么也没有</div>';
CONST.MSG_EMPTY_PLAYING_LIST = '<div class="list-item text-center list-clickable" id="list-foot" onclick="rem.sheetList.clearDislist();">清空列表</div>';

CONST.PL_PLAYLIST_HEAD = '<div class="list-item list-head">' +
            '    <span class="music-album">' +
            '        专辑' +
            '    </span>' +
            '    <span class="auth-name">' +
            '        歌手' +
            '    </span>' +
            '    <span class="music-name">' +
            '        歌曲' +
            '    </span>' +
            '</div>';
CONST.TEMPLATE_MUSIC_NAME_CULT = '<span class="music-name-cult">' +
'{0}' +
'</span>' +
'<div class="list-menu" data-no="{1}">' +
'<span class="list-icon icon-play" data-function="play" title="点击播放这首歌"></span>' +
'<span class="list-icon icon-download" data-function="download" title="点击下载这首歌"></span>' +
'<span class="list-icon icon-share" data-function="share" title="点击分享这首歌"></span>' +
'</div>';

CONST.TEMPLATE_MAIN_LIST_ITEM = '<div class="list-item" data-no="' + '{0}'+ '">' +
            '    <span class="list-num">' + '{1}' + '</span>' +
            '    <span class="list-mobile-menu"></span>' +
            '    <span class="music-album">' + '{2}' + '</span>' +
            '    <span class="auth-name">' + '{3}' + '</span>' +
            '    <span class="music-name">' + '{4}' + '</span>' +
            '</div>';
Object.freeze(CONST);