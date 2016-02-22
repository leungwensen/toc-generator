export default function anonymous(data, helper
/**/) {
    data = data || {};helper = helper || {};var _e = helper.escape ? helper.escape : function (s) {return s;};var _s = '<span class="toc-anchor" data-unique="' + _e(data.uniqueId) + '" style="font-weight: normal !important;">&#9875;</span>';return _s;
};
