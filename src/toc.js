/**
 * Created by liangwensen on 2/17/16.
 */
import eventFn from 'zero-events/event';
import declare from 'zero-oop/declare';
import domClass from 'zero-dom/class';
import domConstruct from 'zero-dom/construct';
import domData from 'zero-dom/data';
import domEvent from 'zero-dom/event';
import domQuery from 'zero-dom/query';
import domStyle from 'zero-dom/style';
import sprintf from 'zero-fmt/sprintf';
import lang from 'zero-lang';
import htmlUtils from 'zero-text/html';

import {
    getHeaderLevel,
    getHeaderSelector,
    getHeaderText
} from './utils';

import tmplAnchor from './template/anchor';
import tmplExpander from './template/expander';
import tmplLink from './template/link';
import tmplLinkList from './template/link-list';

const DEFAULT_OPTIONS = {
    anchorIdPrefix: 'toc-',
    expanderClassName: 'link-expander',
    expanderExpandedText: '&blacktriangledown;',
    expanderText: '&blacktriangleright;',
    hasChildClassName: 'has-child',
    maxDepth: 3,
    textClassName: 'link-text',
    uniqueIdSeparator: '-',
    uniqueIdSuffix: '1',
};

const extend = lang.extend;
const body = document.body;
const templateHelper = extend({}, htmlUtils, lang);

function addHeaderExpander(header, options) {
    if (!header._expanderElement) {
        domConstruct.place(tmplExpander({
            uniqueId: header.uniqueId,
            className: options.expanderClassName,
        }), header.element, 'first');
        header._expanderElement = domQuery.one('.' + options.expanderClassName, header.element);
    }
}

function toggleHeaderExpanderText(header, options, isExpanded) {
    header._expanderElement.innerHTML = isExpanded ? options.expanderExpandedText : options.expanderText;
}

function locationCallback(e) {
    let delegateTarget = e.delegateTarget;
    let uniqueId = domData.get(delegateTarget, 'unique');
    lang.global.location = '#' + uniqueId;
}

let Toc = declare({
    constructor(element, options) {
        let me = this;
        if (element) {
            element = domQuery.one(element);
        }

        eventFn(me);
        me._srcElement = element || body;
        me._options = extend({}, DEFAULT_OPTIONS, options);
        me._parse()
            ._bindEvents();
        return me;
    },

    _parse() {
        let me = this;
        let options = me._options;
        let tocElement = me._outerDomNode = domConstruct.toDom(tmplLinkList({}, templateHelper));

        let headers = domQuery.all(getHeaderSelector(options.maxDepth), me._srcElement);
        let currentHeaderMeta;
        let headerMetaById = {};

        function getHeaderUniqueId(text) {
            let id = text
                .replace(/\s+/g, options.uniqueIdSeparator)
                .replace(/\\/g, options.uniqueIdSeparator)
                .replace(/\//g, options.uniqueIdSeparator);
            if (!lang.hasKey(headerMetaById, id)) {
                return id;
            }

            return getHeaderUniqueId(id + options.uniqueIdSuffix);
        }

        function addToChildren(headerMeta, parentHeaderMeta) {
            let childrenElement = domQuery.one('ul', parentHeaderMeta.element);
            if (!childrenElement) {
                childrenElement = domConstruct.toDom(tmplLinkList({}, templateHelper));
                domConstruct.place(childrenElement, parentHeaderMeta.element);
            }

            domConstruct.place(headerMeta.element, childrenElement);
            headerMeta.parentId = parentHeaderMeta.uniqueId;
            parentHeaderMeta.children.push(headerMeta.uniqueId);
            parentHeaderMeta.childrenElement = childrenElement;
            addHeaderExpander(parentHeaderMeta, options);
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
            if (meta.children.length) {
                domClass.add(meta.element, options.hasChildClassName);
            }
        });

        me._headerMetaById = headerMetaById;
        return me;
    },

    _bindEvents() {
        let me = this;
        let options = me._options;
        domEvent.on(me._outerDomNode, 'click', '.' + options.expanderClassName, function (e) {
            let delegateTarget = e.delegateTarget;
            let uniqueId = domData.get(delegateTarget, 'unique');
            me.expandOrCollapse(uniqueId);
        });

        domEvent.on(me._outerDomNode, 'click', '.' + options.textClassName, function (e) {
            let delegateTarget = e.delegateTarget;
            let uniqueId = domData.get(delegateTarget, 'unique');
            me.scrollTo(uniqueId);
            me.trigger('scrolled-to', me._headerMetaById[uniqueId]);
        });

        domEvent.on(me._srcElement, 'click', '.toc-anchor', locationCallback);

        return me;
    },

    _unbindEvents() {
        let me = this;
        domEvent.off(me._srcElement, 'click', locationCallback);
        return me;
    },

    expand(id) {
        let me = this;
        let header = me._headerMetaById[id];
        if (header && header.childrenElement) {
            domStyle.show(header.childrenElement);
            toggleHeaderExpanderText(header, me._options, true);
            header.isExpanded = true;
        }

        return me;
    },

    collapse(id) {
        let me = this;
        let header = me._headerMetaById[id];
        if (header && header.childrenElement) {
            domStyle.hide(header.childrenElement);
            toggleHeaderExpanderText(header, me._options);
            header.isExpanded = false;
        }

        return me;
    },

    expandOrCollapse(id) {
        let me = this;
        let header = me._headerMetaById[id];
        if (header) {
            me[header.isExpanded ? 'collapse' : 'expand'](id);
        }

        return me;
    },

    scrollTo(uniqueId) {
        let me = this;
        let anchorSelector = sprintf('[data-unique="%s"]', uniqueId);
        try {
            let anchorNode = domQuery.one(anchorSelector, me._srcElement);
            if (anchorNode) {
                anchorNode.scrollIntoView(true);
            }
        } catch (e) {
        }

        return me;
    },

    placeAt(container, position) {
        let me = this;
        if (container) {
            container = domQuery.one(container);
        }

        container = container || body;
        position = position || '';
        domConstruct.place(me._outerDomNode, container, position);
        return me;
    },

    destroy() {
        let me = this;
        let options = me._options;

        // unbind all events
        me._unbindEvents();

        // remove all dom nodes
        lang.each(domQuery.all('.toc-anchor', me._srcElement), function (anchor) {
            domConstruct.destroy(anchor);
        });

        domConstruct.destroy(me._outerDomNode);
        return me;
    },
});

export default Toc;
