/**
 * Created by liangwensen on 3/16/16.
 */

import domConstruct from 'zero-dom/construct';
import domEvent from 'zero-dom/event';
import domQuery from 'zero-dom/query';
import lang from 'zero-lang';

import Toc from './toc';
import tmplAnchor from './template/anchor';
import templateHelper from './templateHelper';
import {
    DEFAULT_OPTIONS
} from './const';
import {
    getHeaderLevel,
    getHeaderSelector,
    getHeaderText
} from './utils';

const body = document.body;

function locationCallback(e) {
    let delegateTarget = e.delegateTarget;
    let uniqueId = domData.get(delegateTarget, 'unique');
    lang.global.location = '#' + uniqueId;
}

function generate(element, options) {
    options = lang.extend({}, DEFAULT_OPTIONS, options);
    if (element) {
        element = domQuery.one(element);
    }
    element = element || body;

    let links = [];
    let headers = domQuery.all(getHeaderSelector(options.maxDepth), element);
    let headerMetaById = {};

    function getHeaderUniqueId(text) {
        let id = text
            .replace(/\s+/g, options.uniqueIdSeparator)
            .replace(/\\/g, options.uniqueIdSeparator)
            .replace(/\//g, options.uniqueIdSeparator);
        if (!lang.hasKey(headerMetaById, id)) {
            return options.uniqueIdPrefix + id;
        }

        return getHeaderUniqueId(id + options.uniqueIdSuffix);
    }

    lang.each(headers, function (header) {
        let level = getHeaderLevel(header);
        let text = getHeaderText(header);
        let uniqueId = getHeaderUniqueId(text);
        let meta = {
            text,
            uniqueId,
            level,
            isExpanded: true,
            expanderClassName: options.expanderClassName,
            textClassName: options.textClassName,
            children: [],
        };
        let anchorElement = domConstruct.toDom(tmplAnchor(meta, templateHelper));
        meta.anchorElement = anchorElement;
        domConstruct.place(anchorElement, header, 'first'); // add anchor to header

        headerMetaById[uniqueId] = meta;
        links.push(meta);
    });

    let toc = new Toc(links, options);

    domEvent.on(element, 'click', '.toc-anchor', locationCallback);
    toc.on('unbind-events', function () {
        domEvent.off(element, 'click', locationCallback);
        // remove all dom nodes
        lang.each(domQuery.all('.toc-anchor', element), function (anchor) {
            domConstruct.destroy(anchor);
        });

    });

    return toc;
}

export default generate;
