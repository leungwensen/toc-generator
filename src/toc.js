/**
 * Created by liangwensen on 2/17/16.
 */
import declare from 'zero-oop/declare';
import domClass from 'zero-dom/class';
import domConstruct from 'zero-dom/construct';
import domQuery from 'zero-dom/query';
import sprintf from 'zero-fmt/sprintf';
import lang from 'zero-lang';
import htmlUtils from 'zero-text/html';

import {
    getHeaderLevel,
    getHeaderSelector,
    getHeaderText
} from './utils';

import tmplAnchor from './template/anchor';
import tmplLink from './template/link';
import tmplLinkList from './template/link-list';

const DEFAULT_OPTIONS = {
    anchorIdPrefix: 'toc-',
    hasChildClassName: 'has-child',
    maxDepth: 3,
    uniqueIdSeparator: '-',
    uniqueIdSuffix: '1'
};

const extend = lang.extend;
const body = document.body;
const templateHelper = extend({}, htmlUtils, lang);

let Toc = declare({
    constructor(element, options) {
        let self = this;
        if (element) {
            element = domQuery.one(element);
        }
        self._srcElement = element || body;
        self._options = extend({}, DEFAULT_OPTIONS, options);
        self._parse()
            ._bindEvents();
        return self;
    },
    _parse() {
        let self = this;
        let options = self._options;
        let tocElement = self._outerDomNode = domConstruct.toDom(tmplLinkList({}, templateHelper));

        let headers = domQuery.all(getHeaderSelector(options.maxDepth), self._srcElement);
        let currentHeaderMeta;
        let headerMetaById = {};

        function getHeaderUniqueId(text) {
            let id = text.replace(/\s+/, options.uniqueIdSeparator);
            if (!lang.hasKey(headerMetaById, id)) {
                return id;
            }
            return getHeaderUniqueId(id + options.uniqueIdSuffix);
        }

        function addToChildren(headerMeta, parentHeaderMeta) {
            console.log(arguments);
            let childrenElement = domQuery.one('ul', parentHeaderMeta.element);
            if (!childrenElement) {
                childrenElement = domConstruct.toDom(tmplLinkList({}, templateHelper));
                domConstruct.place(childrenElement, parentHeaderMeta.element);
            }
            domConstruct.place(headerMeta.element, childrenElement);
            headerMeta.parentId = parentHeaderMeta.uniqueId;
            parentHeaderMeta.hasChild = true;
        }

        lang.each(headers, function (header) {
            let level = getHeaderLevel(header);
            let text = getHeaderText(header);
            let uniqueId = getHeaderUniqueId(text);
            let meta = {
                text,
                uniqueId,
                level,
                hasChild: false
            };
            let linkElement = domConstruct.toDom(tmplLink(meta, templateHelper));
            let anchorElement = domConstruct.toDom(tmplAnchor(meta, templateHelper));
            meta.element = linkElement;
            meta.anchorElement = anchorElement;
            domConstruct.place(anchorElement, header, 'first'); // add anchor to header

            if (currentHeaderMeta) {
                if (currentHeaderMeta.level < level) { // NOTICE that "h2 < h1"
                    meta.parentId = currentHeaderMeta.uniqueId;
                    addToChildren(meta, currentHeaderMeta);
                } else {
                    let parentMeta = headerMetaById[currentHeaderMeta.parentId];
                    while (parentMeta) {
                        if (parentMeta.level >= level) {
                            parentMeta = headerMetaById[parentMeta.parentId];
                        } else {
                            break;
                        }
                    }
                    if (parentMeta) {
                        addToChildren(meta, parentMeta);
                    } else {
                        domConstruct.place(linkElement, tocElement);
                    }
                }
            } else {
                domConstruct.place(linkElement, tocElement);
            }
            headerMetaById[uniqueId] = meta;
            currentHeaderMeta = meta;
        });
        lang.forIn(headerMetaById, function (meta) {
            if (meta.hasChild) {
                domClass.add(meta.element, options.hasChildClassName);
            }
        });

        self._headerMetaById = headerMetaById;
        return self;
    },
    _bindEvents() {
        let self = this;
        return self;
    },
    scrollTo(uniqueId) {
        let self = this;
        let anchorSelector = sprintf('[data-unique="%s"]', uniqueId);
        try {
            let anchorNode = domQuery.one(anchorSelector, self._srcElement);
            if (anchorNode) {
                anchorNode.scrollIntoView(true);
            }
        } catch (e) {
        }
        return self;
    },
    placeAt(container, position) {
        let self = this;
        if (container) {
            container = domQuery.one(container);
        }
        container = container || body;
        position = position || '';
        domConstruct.place(self._outerDomNode, container, position);
        return self;
    },
    destroy() {
        let self = this;
        // remove all dom nodes
        // unbind all events
        return self;
    }
});

export default Toc;
