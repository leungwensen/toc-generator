# toc-generator

table of content generator.

## install

```
npm install toc-generator --save-dev
```

## usage

```javascript
import tg from 'toc-generator';

let toc = new tg.Toc(article, options);
/*
 article: optional, default is document.body
 options: optional, default is {
    anchorIdPrefix: 'toc-',
 }
 */
 
toc.placeAt(container, position);
/*
 container: optional, default is document.body
 position: optional, validate value is one of ['before', 'after', 'replace', 'only', 'first', 'last'], default is 'last'
 */
 
toc.scrollTo('id');
/*
 will scroll to anchor with the id 'id'
 */
 
toc.destroy();
/*
 will remove all anchors from article, and remove domNode of toc itself.
 */
```
