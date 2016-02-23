import domEvent from 'zero-dom/event';
import domQuery from 'zero-dom/query';
import fetch from 'zero-net/fetch';
import win from 'zero-lang/global';
import hashRouter from 'zero-routing/hashRouter';

import tg from '../src/index';

const mpr = win.mpr;

fetch('../lib/marked-plus-renderer/features.md?raw')
    .then(function (res) {
        return res.text();
    })
    .then(function (markdownString) {
        let containerElement = domQuery.one('#container');
        mpr.render(containerElement, markdownString);
        let toc = new tg.Toc(containerElement, {
            maxDepth: 6
        });
        toc.on('scrolled-to', function (headerMeta) {
            hashRouter(headerMeta.uniqueId);
        });
        toc.placeAt(domQuery.one('#toc'));
        hashRouter({
            ':uniqueId': function (uniqueId) {
                toc.scrollTo(uniqueId);
            }
        });
        domEvent.on('#destroy-toc', 'click', function(){
            console.log('destroying toc instance');
            toc.destroy();
        });
    });
