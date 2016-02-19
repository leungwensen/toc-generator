import domQuery from 'zero-dom/query';
import fetch from 'zero-net/fetch';
import win from 'zero-lang/global';

import tg from '../src/index';

const mpr = win.mpr;

fetch('../lib/marked-plus-renderer/features.md')
    .then(function (res) {
        return res.text();
    })
    .then(function (markdownString) {
        console.log(markdownString);
        let containerElement = domQuery.one('#container');
        console.log(mpr);
        mpr.render(containerElement, markdownString);
        let toc = new tg.Toc(containerElement);
        toc.placeAt(domQuery.one('#toc'));
    });
