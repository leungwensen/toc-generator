/**
 * Created by liangwensen on 2/17/16.
 */
import declare from 'zero-oop/declare';
import domClass from 'zero-dom/class';
import domConstruct from 'zero-dom/construct';
import domData from 'zero-dom/data';
import domEvent from 'zero-dom/event';
import domQuery from 'zero-dom/query';
import domStyle from 'zero-dom/style';
import eventFn from 'zero-events/event';
import lang from 'zero-lang';
import sprintf from 'zero-fmt/sprintf';
import templateHelper from './templateHelper';
import tmplExpander from './template/expander';
import tmplLink from './template/link';
import tmplLinkList from './template/link-list';

import {
    DEFAULT_OPTIONS
} from './const';

const extend = lang.extend;
const body = document.body;

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

let Toc = declare({
    constructor(links, options) {
        let me = this;

        eventFn(me);
        me._options = extend({}, DEFAULT_OPTIONS, options);
        me._render(links);
        me._bindEvents();
        return me;
    },

    _render(links) {
        let me = this;
        let options = me._options;
        let tocElement = me._outerDomNode = domConstruct.toDom(tmplLinkList({}, templateHelper));
        let currentHeaderMeta;
        let headerMetaById = {};

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

        lang.each(links, function (meta) {
            let level = meta.level;
            let linkElement = domConstruct.toDom(tmplLink(meta, templateHelper));
            meta.element = linkElement;
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
            currentHeaderMeta = meta;
            headerMetaById[meta.uniqueId] = meta;
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
            var headerMeta = me._headerMetaById[uniqueId];
            me.expandOrCollapse(uniqueId);
            if (headerMeta.isExpanded) {
                me.trigger('expanded', headerMeta);
            } else {
                me.trigger('collapsed', headerMeta);
            }
        });

        domEvent.on(me._outerDomNode, 'click', '.' + options.textClassName, function (e) {
            let delegateTarget = e.delegateTarget;
            let uniqueId = domData.get(delegateTarget, 'unique');
            me.scrollTo(uniqueId);
            me.trigger('clicked', me._headerMetaById[uniqueId]);
        });

        return me;
    },

    _unbindEvents() {
        let me = this;
        me.trigger('unbind-events');
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

        // unbind all events
        me._unbindEvents();


        domConstruct.destroy(me._outerDomNode);
        return me;
    },
});

export default Toc;
