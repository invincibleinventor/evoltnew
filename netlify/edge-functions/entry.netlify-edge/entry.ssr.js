/**
 * @license
 * @builder.io/qwik 0.9.0
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
const EMPTY_ARRAY$1 = [];
const EMPTY_OBJ$1 = {};
const isSerializableObject = (v) => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || null === proto;
};
const isObject = (v) => v && "object" == typeof v;
const isArray = (v) => Array.isArray(v);
const isString = (v) => "string" == typeof v;
const isFunction = (v) => "function" == typeof v;
const QSlot = "q:slot";
const isPromise = (value) => value instanceof Promise;
const safeCall = (call, thenFn, rejectFn) => {
  try {
    const promise = call();
    return isPromise(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
  } catch (e) {
    return rejectFn(e);
  }
};
const then = (promise, thenFn) => isPromise(promise) ? promise.then(thenFn) : thenFn(promise);
const promiseAll = (promises) => promises.some(isPromise) ? Promise.all(promises) : promises;
const isNotNullable = (v) => null != v;
const delay = (timeout) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});
let _context;
const tryGetInvokeContext = () => {
  if (!_context) {
    const context = "undefined" != typeof document && document && document.__q_context__;
    if (!context) {
      return;
    }
    return isArray(context) ? document.__q_context__ = newInvokeContextFromTuple(context) : context;
  }
  return _context;
};
const getInvokeContext = () => {
  const ctx = tryGetInvokeContext();
  if (!ctx) {
    throw qError(QError_useMethodOutsideContext);
  }
  return ctx;
};
const useInvokeContext = () => {
  const ctx = getInvokeContext();
  if ("qRender" !== ctx.$event$) {
    throw qError(QError_useInvokeContext);
  }
  return ctx.$hostElement$, ctx.$waitOn$, ctx.$renderCtx$, ctx.$subscriber$, ctx;
};
const invoke = (context, fn, ...args) => {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context, returnValue = fn.apply(null, args);
  } finally {
    _context = previousContext;
  }
  return returnValue;
};
const waitAndRun = (ctx, callback) => {
  const waitOn = ctx.$waitOn$;
  if (0 === waitOn.length) {
    const result = callback();
    isPromise(result) && waitOn.push(result);
  } else {
    waitOn.push(Promise.all(waitOn).then(callback));
  }
};
const newInvokeContextFromTuple = (context) => {
  const element = context[0];
  return newInvokeContext(void 0, element, context[1], context[2]);
};
const newInvokeContext = (hostElement, element, event, url) => ({
  $seq$: 0,
  $hostElement$: hostElement,
  $element$: element,
  $event$: event,
  $url$: url,
  $qrl$: void 0,
  $props$: void 0,
  $renderCtx$: void 0,
  $subscriber$: void 0,
  $waitOn$: void 0
});
const getWrappingContainer = (el) => el.closest("[q\\:container]");
const isNode = (value) => value && "number" == typeof value.nodeType;
const isDocument = (value) => value && 9 === value.nodeType;
const isElement = (value) => 1 === value.nodeType;
const isQwikElement = (value) => isNode(value) && (1 === value.nodeType || 111 === value.nodeType);
const isVirtualElement = (value) => 111 === value.nodeType;
const isModule = (module) => isObject(module) && "Module" === module[Symbol.toStringTag];
let _platform = (() => {
  const moduleCache = /* @__PURE__ */ new Map();
  return {
    isServer: false,
    importSymbol(containerEl, url, symbolName) {
      const urlDoc = ((doc, containerEl2, url2) => {
        var _a;
        const baseURI = doc.baseURI;
        const base = new URL((_a = containerEl2.getAttribute("q:base")) != null ? _a : baseURI, baseURI);
        return new URL(url2, base);
      })(containerEl.ownerDocument, containerEl, url).toString();
      const urlCopy = new URL(urlDoc);
      urlCopy.hash = "", urlCopy.search = "";
      const importURL = urlCopy.href;
      const mod = moduleCache.get(importURL);
      return mod ? mod[symbolName] : import(importURL).then((mod2) => {
        return module = mod2, mod2 = Object.values(module).find(isModule) || module, moduleCache.set(importURL, mod2), mod2[symbolName];
        var module;
      });
    },
    raf: (fn) => new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve(fn());
      });
    }),
    nextTick: (fn) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(fn());
      });
    }),
    chunkForSymbol() {
    }
  };
})();
const setPlatform = (plt) => _platform = plt;
const getPlatform = () => _platform;
const isServer$1 = () => _platform.isServer;
const directSetAttribute = (el, prop, value) => el.setAttribute(prop, value);
const directGetAttribute = (el, prop) => el.getAttribute(prop);
const ON_PROP_REGEX = /^(on|window:|document:)/;
const isOnProp = (prop) => prop.endsWith("$") && ON_PROP_REGEX.test(prop);
const addQRLListener = (listenersMap, prop, input) => {
  let existingListeners = listenersMap[prop];
  existingListeners || (listenersMap[prop] = existingListeners = []);
  for (const qrl of input) {
    const hash = qrl.$hash$;
    let replaced = false;
    for (let i = 0; i < existingListeners.length; i++) {
      if (existingListeners[i].$hash$ === hash) {
        existingListeners.splice(i, 1, qrl), replaced = true;
        break;
      }
    }
    replaced || existingListeners.push(qrl);
  }
  return false;
};
const setEvent = (listenerMap, prop, input) => {
  prop.endsWith("$");
  const qrls = isArray(input) ? input.map(ensureQrl) : [ensureQrl(input)];
  return prop = normalizeOnProp(prop.slice(0, -1)), addQRLListener(listenerMap, prop, qrls), prop;
};
const ensureQrl = (value) => isQrl$1(value) ? value : $(value);
const getDomListeners = (ctx, containerEl) => {
  const attributes = ctx.$element$.attributes;
  const listeners = {};
  for (let i = 0; i < attributes.length; i++) {
    const { name, value } = attributes.item(i);
    if (name.startsWith("on:") || name.startsWith("on-window:") || name.startsWith("on-document:")) {
      let array = listeners[name];
      array || (listeners[name] = array = []);
      const urls = value.split("\n");
      for (const url of urls) {
        const qrl = parseQRL(url, containerEl);
        qrl.$capture$ && inflateQrl(qrl, ctx), array.push(qrl);
      }
    }
  }
  return listeners;
};
const useSequentialScope = () => {
  const ctx = useInvokeContext();
  const i = ctx.$seq$;
  const hostElement = ctx.$hostElement$;
  const elCtx = getContext(hostElement);
  const seq = elCtx.$seq$ ? elCtx.$seq$ : elCtx.$seq$ = [];
  return ctx.$seq$++, {
    get: seq[i],
    set: (value) => seq[i] = value,
    i,
    ctx
  };
};
const useOn = (event, eventQrl) => _useOn(`on-${event}`, eventQrl);
const _useOn = (eventName, eventQrl) => {
  const invokeCtx = useInvokeContext();
  const ctx = getContext(invokeCtx.$hostElement$);
  addQRLListener(ctx.li, normalizeOnProp(eventName), [eventQrl]);
};
const getDocument = (node) => "undefined" != typeof document ? document : 9 === node.nodeType ? node : node.ownerDocument;
const jsx = (type, props, key) => {
  const processed = null == key ? null : String(key);
  return new JSXNodeImpl(type, props, processed);
};
class JSXNodeImpl {
  constructor(type, props, key = null) {
    this.type = type, this.props = props, this.key = key;
  }
}
const isJSXNode = (n) => n instanceof JSXNodeImpl;
const Fragment = (props) => props.children;
const SkipRender = Symbol("skip render");
const SSRComment = () => null;
const Virtual = (props) => props.children;
const InternalSSRStream = () => null;
const fromCamelToKebabCase = (text) => text.replace(/([A-Z])/g, "-$1").toLowerCase();
const setAttribute = (ctx, el, prop, value) => {
  ctx ? ctx.$operations$.push({
    $operation$: _setAttribute,
    $args$: [el, prop, value]
  }) : _setAttribute(el, prop, value);
};
const _setAttribute = (el, prop, value) => {
  if (null == value || false === value) {
    el.removeAttribute(prop);
  } else {
    const str = true === value ? "" : String(value);
    directSetAttribute(el, prop, str);
  }
};
const setProperty = (ctx, node, key, value) => {
  ctx ? ctx.$operations$.push({
    $operation$: _setProperty,
    $args$: [node, key, value]
  }) : _setProperty(node, key, value);
};
const _setProperty = (node, key, value) => {
  try {
    node[key] = value;
  } catch (err) {
    logError(codeToText(QError_setProperty), {
      node,
      key,
      value
    }, err);
  }
};
const createElement = (doc, expectTag, isSvg) => isSvg ? doc.createElementNS(SVG_NS, expectTag) : doc.createElement(expectTag);
const insertBefore = (ctx, parent, newChild, refChild) => (ctx.$operations$.push({
  $operation$: directInsertBefore,
  $args$: [parent, newChild, refChild || null]
}), newChild);
const appendChild = (ctx, parent, newChild) => (ctx.$operations$.push({
  $operation$: directAppendChild,
  $args$: [parent, newChild]
}), newChild);
const appendHeadStyle = (ctx, styleTask) => {
  ctx.$containerState$.$styleIds$.add(styleTask.styleId), ctx.$postOperations$.push({
    $operation$: _appendHeadStyle,
    $args$: [ctx.$containerState$.$containerEl$, styleTask]
  });
};
const _setClasslist = (elm, toRemove, toAdd) => {
  const classList = elm.classList;
  classList.remove(...toRemove), classList.add(...toAdd);
};
const _appendHeadStyle = (containerEl, styleTask) => {
  const doc = getDocument(containerEl);
  const isDoc = doc.documentElement === containerEl;
  const headEl = doc.head;
  const style = doc.createElement("style");
  directSetAttribute(style, "q:style", styleTask.styleId), style.textContent = styleTask.content, isDoc && headEl ? directAppendChild(headEl, style) : directInsertBefore(containerEl, style, containerEl.firstChild);
};
const removeNode = (ctx, el) => {
  ctx.$operations$.push({
    $operation$: _removeNode,
    $args$: [el, ctx]
  });
};
const _removeNode = (el, staticCtx) => {
  const parent = el.parentElement;
  if (parent) {
    if (1 === el.nodeType || 111 === el.nodeType) {
      const subsManager = staticCtx.$containerState$.$subsManager$;
      cleanupTree(el, staticCtx, subsManager, true);
    }
    directRemoveChild(parent, el);
  }
};
const createTemplate = (doc, slotName) => {
  const template = createElement(doc, "q:template", false);
  return directSetAttribute(template, QSlot, slotName), directSetAttribute(template, "hidden", ""), directSetAttribute(template, "aria-hidden", "true"), template;
};
const executeDOMRender = (ctx) => {
  for (const op of ctx.$operations$) {
    op.$operation$.apply(void 0, op.$args$);
  }
  resolveSlotProjection(ctx);
};
const getKey = (el) => directGetAttribute(el, "q:key");
const setKey = (el, key) => {
  null !== key && directSetAttribute(el, "q:key", key);
};
const resolveSlotProjection = (ctx) => {
  const subsManager = ctx.$containerState$.$subsManager$;
  ctx.$rmSlots$.forEach((slotEl) => {
    const key = getKey(slotEl);
    const slotChildren = getChildren(slotEl, "root");
    if (slotChildren.length > 0) {
      const sref = slotEl.getAttribute("q:sref");
      const hostCtx = ctx.$roots$.find((r) => r.$id$ === sref);
      if (hostCtx) {
        const template = createTemplate(ctx.$doc$, key);
        const hostElm = hostCtx.$element$;
        for (const child of slotChildren) {
          directAppendChild(template, child);
        }
        directInsertBefore(hostElm, template, hostElm.firstChild);
      } else {
        cleanupTree(slotEl, ctx, subsManager, false);
      }
    }
  }), ctx.$addSlots$.forEach(([slotEl, hostElm]) => {
    const key = getKey(slotEl);
    const template = Array.from(hostElm.childNodes).find((node) => isSlotTemplate(node) && node.getAttribute(QSlot) === key);
    template && (getChildren(template, "root").forEach((child) => {
      directAppendChild(slotEl, child);
    }), template.remove());
  });
};
class VirtualElementImpl {
  constructor(open, close) {
    this.open = open, this.close = close, this._qc_ = null, this.nodeType = 111, this.localName = ":virtual", this.nodeName = ":virtual";
    const doc = this.ownerDocument = open.ownerDocument;
    this.template = createElement(doc, "template", false), this.attributes = ((str) => {
      if (!str) {
        return /* @__PURE__ */ new Map();
      }
      const attributes = str.split(" ");
      return new Map(attributes.map((attr) => {
        const index2 = attr.indexOf("=");
        return index2 >= 0 ? [attr.slice(0, index2), (s = attr.slice(index2 + 1), s.replace(/\+/g, " "))] : [attr, ""];
        var s;
      }));
    })(open.data.slice(3)), open.data.startsWith("qv "), open.__virtual = this;
  }
  insertBefore(node, ref) {
    const parent = this.parentElement;
    if (parent) {
      const ref2 = ref || this.close;
      parent.insertBefore(node, ref2);
    } else {
      this.template.insertBefore(node, ref);
    }
    return node;
  }
  remove() {
    const parent = this.parentElement;
    if (parent) {
      const ch = Array.from(this.childNodes);
      this.template.childElementCount, parent.removeChild(this.open), this.template.append(...ch), parent.removeChild(this.close);
    }
  }
  appendChild(node) {
    return this.insertBefore(node, null);
  }
  insertBeforeTo(newParent, child) {
    const ch = Array.from(this.childNodes);
    newParent.insertBefore(this.open, child);
    for (const c of ch) {
      newParent.insertBefore(c, child);
    }
    newParent.insertBefore(this.close, child), this.template.childElementCount;
  }
  appendTo(newParent) {
    this.insertBeforeTo(newParent, null);
  }
  removeChild(child) {
    this.parentElement ? this.parentElement.removeChild(child) : this.template.removeChild(child);
  }
  getAttribute(prop) {
    var _a;
    return (_a = this.attributes.get(prop)) != null ? _a : null;
  }
  hasAttribute(prop) {
    return this.attributes.has(prop);
  }
  setAttribute(prop, value) {
    this.attributes.set(prop, value), this.open.data = updateComment(this.attributes);
  }
  removeAttribute(prop) {
    this.attributes.delete(prop), this.open.data = updateComment(this.attributes);
  }
  matches(_) {
    return false;
  }
  compareDocumentPosition(other) {
    return this.open.compareDocumentPosition(other);
  }
  closest(query) {
    const parent = this.parentElement;
    return parent ? parent.closest(query) : null;
  }
  querySelectorAll(query) {
    const result = [];
    return getChildren(this, "elements").forEach((el) => {
      isQwikElement(el) && (el.matches(query) && result.push(el), result.concat(Array.from(el.querySelectorAll(query))));
    }), result;
  }
  querySelector(query) {
    for (const el of this.childNodes) {
      if (isElement(el)) {
        if (el.matches(query)) {
          return el;
        }
        const v = el.querySelector(query);
        if (null !== v) {
          return v;
        }
      }
    }
    return null;
  }
  get firstChild() {
    if (this.parentElement) {
      const first = this.open.nextSibling;
      return first === this.close ? null : first;
    }
    return this.template.firstChild;
  }
  get nextSibling() {
    return this.close.nextSibling;
  }
  get previousSibling() {
    return this.open.previousSibling;
  }
  get childNodes() {
    if (!this.parentElement) {
      return this.template.childNodes;
    }
    const nodes = [];
    let node = this.open;
    for (; (node = node.nextSibling) && node !== this.close; ) {
      nodes.push(node);
    }
    return nodes;
  }
  get isConnected() {
    return this.open.isConnected;
  }
  get parentElement() {
    return this.open.parentElement;
  }
}
const updateComment = (attributes) => `qv ${((map) => {
  const attributes2 = [];
  return map.forEach((value, key) => {
    var s;
    value ? attributes2.push(`${key}=${s = value, s.replace(/ /g, "+")}`) : attributes2.push(`${key}`);
  }), attributes2.join(" ");
})(attributes)}`;
const processVirtualNodes = (node) => {
  if (null == node) {
    return null;
  }
  if (isComment(node)) {
    const virtual = getVirtualElement(node);
    if (virtual) {
      return virtual;
    }
  }
  return node;
};
const getVirtualElement = (open) => {
  const virtual = open.__virtual;
  if (virtual) {
    return virtual;
  }
  if (open.data.startsWith("qv ")) {
    const close = findClose(open);
    return new VirtualElementImpl(open, close);
  }
  return null;
};
const findClose = (open) => {
  let node = open.nextSibling;
  let stack = 1;
  for (; node; ) {
    if (isComment(node)) {
      if (node.data.startsWith("qv ")) {
        stack++;
      } else if ("/qv" === node.data && (stack--, 0 === stack)) {
        return node;
      }
    }
    node = node.nextSibling;
  }
  throw new Error("close not found");
};
const isComment = (node) => 8 === node.nodeType;
const getRootNode = (node) => null == node ? null : isVirtualElement(node) ? node.open : node;
const createContext$1 = (name) => Object.freeze({
  id: fromCamelToKebabCase(name)
});
const useContextProvider = (context, newValue) => {
  const { get, set, ctx } = useSequentialScope();
  if (void 0 !== get) {
    return;
  }
  const hostElement = ctx.$hostElement$;
  const hostCtx = getContext(hostElement);
  let contexts = hostCtx.$contexts$;
  contexts || (hostCtx.$contexts$ = contexts = /* @__PURE__ */ new Map()), contexts.set(context.id, newValue), set(true);
};
const useContext = (context, defaultValue) => {
  const { get, set, ctx } = useSequentialScope();
  if (void 0 !== get) {
    return get;
  }
  const value = resolveContext(context, ctx.$hostElement$, ctx.$renderCtx$);
  if (void 0 !== value) {
    return set(value);
  }
  if (void 0 !== defaultValue) {
    return set(defaultValue);
  }
  throw qError(QError_notFoundContext, context.id);
};
const resolveContext = (context, hostElement, rctx) => {
  const contextID = context.id;
  if (rctx) {
    const contexts = rctx.$localStack$;
    for (let i = contexts.length - 1; i >= 0; i--) {
      const ctx = contexts[i];
      if (hostElement = ctx.$element$, ctx.$contexts$) {
        const found = ctx.$contexts$.get(contextID);
        if (found) {
          return found;
        }
      }
    }
  }
  if (hostElement.closest) {
    const value = queryContextFromDom(hostElement, contextID);
    if (void 0 !== value) {
      return value;
    }
  }
};
const queryContextFromDom = (hostElement, contextId) => {
  var _a;
  let element = hostElement;
  for (; element; ) {
    let node = element;
    let virtual;
    for (; node && (virtual = findVirtual(node)); ) {
      const contexts = (_a = tryGetContext(virtual)) == null ? void 0 : _a.$contexts$;
      if (contexts && contexts.has(contextId)) {
        return contexts.get(contextId);
      }
      node = virtual;
    }
    element = element.parentElement;
  }
};
const findVirtual = (el) => {
  let node = el;
  let stack = 1;
  for (; node = node.previousSibling; ) {
    if (isComment(node)) {
      if ("/qv" === node.data) {
        stack++;
      } else if (node.data.startsWith("qv ") && (stack--, 0 === stack)) {
        return getVirtualElement(node);
      }
    }
  }
  return null;
};
const ERROR_CONTEXT = createContext$1("qk-error");
const handleError = (err, hostElement, rctx) => {
  if (isServer$1()) {
    throw err;
  }
  {
    const errorStore = resolveContext(ERROR_CONTEXT, hostElement, rctx);
    if (void 0 === errorStore) {
      throw err;
    }
    errorStore.error = err;
  }
};
const executeComponent = (rctx, elCtx) => {
  elCtx.$dirty$ = false, elCtx.$mounted$ = true, elCtx.$slots$ = [];
  const hostElement = elCtx.$element$;
  const onRenderQRL = elCtx.$renderQrl$;
  const props = elCtx.$props$;
  const newCtx = pushRenderContext(rctx, elCtx);
  const invocatinContext = newInvokeContext(hostElement, void 0, "qRender");
  const waitOn = invocatinContext.$waitOn$ = [];
  newCtx.$cmpCtx$ = elCtx, invocatinContext.$subscriber$ = hostElement, invocatinContext.$renderCtx$ = rctx, onRenderQRL.$setContainer$(rctx.$static$.$containerState$.$containerEl$);
  const onRenderFn = onRenderQRL.getFn(invocatinContext);
  return safeCall(() => onRenderFn(props), (jsxNode) => (elCtx.$attachedListeners$ = false, waitOn.length > 0 ? Promise.all(waitOn).then(() => elCtx.$dirty$ ? executeComponent(rctx, elCtx) : {
    node: jsxNode,
    rctx: newCtx
  }) : elCtx.$dirty$ ? executeComponent(rctx, elCtx) : {
    node: jsxNode,
    rctx: newCtx
  }), (err) => (handleError(err, hostElement, rctx), {
    node: SkipRender,
    rctx: newCtx
  }));
};
const createRenderContext = (doc, containerState) => ({
  $static$: {
    $doc$: doc,
    $containerState$: containerState,
    $hostElements$: /* @__PURE__ */ new Set(),
    $operations$: [],
    $postOperations$: [],
    $roots$: [],
    $addSlots$: [],
    $rmSlots$: []
  },
  $cmpCtx$: void 0,
  $localStack$: []
});
const pushRenderContext = (ctx, elCtx) => ({
  $static$: ctx.$static$,
  $cmpCtx$: ctx.$cmpCtx$,
  $localStack$: ctx.$localStack$.concat(elCtx)
});
const serializeClass = (obj) => {
  if (isString(obj)) {
    return obj;
  }
  if (isObject(obj)) {
    if (isArray(obj)) {
      return obj.join(" ");
    }
    {
      let buffer = "";
      let previous = false;
      for (const key of Object.keys(obj)) {
        obj[key] && (previous && (buffer += " "), buffer += key, previous = true);
      }
      return buffer;
    }
  }
  return "";
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => value ? value.split(parseClassListRegex) : EMPTY_ARRAY$1;
const stringifyStyle = (obj) => {
  if (null == obj) {
    return "";
  }
  if ("object" == typeof obj) {
    if (isArray(obj)) {
      throw qError(QError_stringifyClassOrStyle, obj, "style");
    }
    {
      const chunks = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          value && chunks.push(fromCamelToKebabCase(key) + ":" + value);
        }
      }
      return chunks.join(";");
    }
  }
  return String(obj);
};
const getNextIndex = (ctx) => intToStr(ctx.$static$.$containerState$.$elementIndex$++);
const setQId = (rctx, ctx) => {
  const id = getNextIndex(rctx);
  ctx.$id$ = id, ctx.$element$.setAttribute("q:id", id);
};
const SKIPS_PROPS = [QSlot, "q:renderFn", "children"];
const serializeSStyle = (scopeIds) => {
  const value = scopeIds.join(" ");
  if (value.length > 0) {
    return value;
  }
};
const renderComponent = (rctx, ctx, flags) => {
  const justMounted = !ctx.$mounted$;
  const hostElement = ctx.$element$;
  const containerState = rctx.$static$.$containerState$;
  return containerState.$hostsStaging$.delete(hostElement), containerState.$subsManager$.$clearSub$(hostElement), then(executeComponent(rctx, ctx), (res) => {
    const staticCtx = rctx.$static$;
    const newCtx = res.rctx;
    const invocatinContext = newInvokeContext(hostElement);
    if (staticCtx.$hostElements$.add(hostElement), invocatinContext.$subscriber$ = hostElement, invocatinContext.$renderCtx$ = newCtx, justMounted) {
      if (ctx.$appendStyles$) {
        for (const style of ctx.$appendStyles$) {
          appendHeadStyle(staticCtx, style);
        }
      }
      if (ctx.$scopeIds$) {
        const value = serializeSStyle(ctx.$scopeIds$);
        value && hostElement.setAttribute("q:sstyle", value);
      }
    }
    const processedJSXNode = processData$1(res.node, invocatinContext);
    return then(processedJSXNode, (processedJSXNode2) => {
      const newVdom = wrapJSX(hostElement, processedJSXNode2);
      const oldVdom = getVdom(ctx);
      return then(visitJsxNode(newCtx, oldVdom, newVdom, flags), () => {
        ctx.$vdom$ = newVdom;
      });
    });
  });
};
const getVdom = (ctx) => (ctx.$vdom$ || (ctx.$vdom$ = domToVnode(ctx.$element$)), ctx.$vdom$);
class ProcessedJSXNodeImpl {
  constructor($type$, $props$, $children$, $key$) {
    this.$type$ = $type$, this.$props$ = $props$, this.$children$ = $children$, this.$key$ = $key$, this.$elm$ = null, this.$text$ = "";
  }
}
const wrapJSX = (element, input) => {
  const children = void 0 === input ? EMPTY_ARRAY$1 : isArray(input) ? input : [input];
  const node = new ProcessedJSXNodeImpl(":virtual", {}, children, null);
  return node.$elm$ = element, node;
};
const processData$1 = (node, invocationContext) => {
  if (null != node && "boolean" != typeof node) {
    if (isString(node) || "number" == typeof node) {
      const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ$1, EMPTY_ARRAY$1, null);
      return newNode.$text$ = String(node), newNode;
    }
    if (isJSXNode(node)) {
      return ((node2, invocationContext2) => {
        const key = null != node2.key ? String(node2.key) : null;
        const nodeType = node2.type;
        const props = node2.props;
        const originalChildren = props.children;
        let textType = "";
        if (isString(nodeType)) {
          textType = nodeType;
        } else {
          if (nodeType !== Virtual) {
            if (isFunction(nodeType)) {
              const res = invoke(invocationContext2, nodeType, props, node2.key);
              return processData$1(res, invocationContext2);
            }
            throw qError(QError_invalidJsxNodeType, nodeType);
          }
          textType = ":virtual";
        }
        let children = EMPTY_ARRAY$1;
        return null != originalChildren ? then(processData$1(originalChildren, invocationContext2), (result) => (void 0 !== result && (children = isArray(result) ? result : [result]), new ProcessedJSXNodeImpl(textType, props, children, key))) : new ProcessedJSXNodeImpl(textType, props, children, key);
      })(node, invocationContext);
    }
    if (isArray(node)) {
      const output = promiseAll(node.flatMap((n) => processData$1(n, invocationContext)));
      return then(output, (array) => array.flat(100).filter(isNotNullable));
    }
    return isPromise(node) ? node.then((node2) => processData$1(node2, invocationContext)) : node === SkipRender ? new ProcessedJSXNodeImpl(":skipRender", EMPTY_OBJ$1, EMPTY_ARRAY$1, null) : void logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
  }
};
const SVG_NS = "http://www.w3.org/2000/svg";
const CHILDREN_PLACEHOLDER = [];
const visitJsxNode = (ctx, oldVnode, newVnode, flags) => smartUpdateChildren(ctx, oldVnode, newVnode, "root", flags);
const smartUpdateChildren = (ctx, oldVnode, newVnode, mode, flags) => {
  oldVnode.$elm$;
  const ch = newVnode.$children$;
  if (1 === ch.length && ":skipRender" === ch[0].$type$) {
    return;
  }
  const elm = oldVnode.$elm$;
  oldVnode.$children$ === CHILDREN_PLACEHOLDER && "HEAD" === elm.nodeName && (mode = "head", flags |= 2);
  const oldCh = getVnodeChildren(oldVnode, mode);
  return oldCh.length > 0 && ch.length > 0 ? updateChildren(ctx, elm, oldCh, ch, flags) : ch.length > 0 ? addVnodes(ctx, elm, null, ch, 0, ch.length - 1, flags) : oldCh.length > 0 ? removeVnodes(ctx.$static$, oldCh, 0, oldCh.length - 1) : void 0;
};
const getVnodeChildren = (vnode, mode) => {
  const oldCh = vnode.$children$;
  const elm = vnode.$elm$;
  return oldCh === CHILDREN_PLACEHOLDER ? vnode.$children$ = getChildrenVnodes(elm, mode) : oldCh;
};
const updateChildren = (ctx, parentElm, oldCh, newCh, flags) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  const results = [];
  const staticCtx = ctx.$static$;
  for (; oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx; ) {
    if (null == oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (null == oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (null == newStartVnode) {
      newStartVnode = newCh[++newStartIdx];
    } else if (null == newEndVnode) {
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newStartVnode, flags)), oldStartVnode = oldCh[++oldStartIdx], newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newEndVnode, flags)), oldEndVnode = oldCh[--oldEndIdx], newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      oldStartVnode.$elm$, oldEndVnode.$elm$, results.push(patchVnode(ctx, oldStartVnode, newEndVnode, flags)), insertBefore(staticCtx, parentElm, oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling), oldStartVnode = oldCh[++oldStartIdx], newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      oldStartVnode.$elm$, oldEndVnode.$elm$, results.push(patchVnode(ctx, oldEndVnode, newStartVnode, flags)), insertBefore(staticCtx, parentElm, oldEndVnode.$elm$, oldStartVnode.$elm$), oldEndVnode = oldCh[--oldEndIdx], newStartVnode = newCh[++newStartIdx];
    } else {
      if (void 0 === oldKeyToIdx && (oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)), idxInOld = oldKeyToIdx[newStartVnode.$key$], void 0 === idxInOld) {
        const newElm = createElm(ctx, newStartVnode, flags);
        results.push(then(newElm, (newElm2) => {
          insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
        }));
      } else if (elmToMove = oldCh[idxInOld], isTagName(elmToMove, newStartVnode.$type$)) {
        results.push(patchVnode(ctx, elmToMove, newStartVnode, flags)), oldCh[idxInOld] = void 0, elmToMove.$elm$, insertBefore(staticCtx, parentElm, elmToMove.$elm$, oldStartVnode.$elm$);
      } else {
        const newElm = createElm(ctx, newStartVnode, flags);
        results.push(then(newElm, (newElm2) => {
          insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
        }));
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (newStartIdx <= newEndIdx) {
    const before = null == newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].$elm$;
    results.push(addVnodes(ctx, parentElm, before, newCh, newStartIdx, newEndIdx, flags));
  }
  let wait = promiseAll(results);
  return oldStartIdx <= oldEndIdx && (wait = then(wait, () => {
    removeVnodes(staticCtx, oldCh, oldStartIdx, oldEndIdx);
  })), wait;
};
const getCh = (elm, filter) => {
  const end = isVirtualElement(elm) ? elm.close : null;
  const nodes = [];
  let node = elm.firstChild;
  for (; (node = processVirtualNodes(node)) && (filter(node) && nodes.push(node), node = node.nextSibling, node !== end); ) {
  }
  return nodes;
};
const getChildren = (elm, mode) => {
  switch (mode) {
    case "root":
      return getCh(elm, isChildComponent);
    case "head":
      return getCh(elm, isHeadChildren);
    case "elements":
      return getCh(elm, isQwikElement);
  }
};
const getChildrenVnodes = (elm, mode) => getChildren(elm, mode).map(getVnodeFromEl);
const getVnodeFromEl = (el) => {
  var _a, _b;
  return isElement(el) ? (_b = (_a = tryGetContext(el)) == null ? void 0 : _a.$vdom$) != null ? _b : domToVnode(el) : domToVnode(el);
};
const domToVnode = (node) => {
  if (isQwikElement(node)) {
    const props = isVirtualElement(node) ? EMPTY_OBJ$1 : getProps(node);
    const t = new ProcessedJSXNodeImpl(node.localName, props, CHILDREN_PLACEHOLDER, getKey(node));
    return t.$elm$ = node, t;
  }
  if (3 === node.nodeType) {
    const t = new ProcessedJSXNodeImpl(node.nodeName, {}, CHILDREN_PLACEHOLDER, null);
    return t.$text$ = node.data, t.$elm$ = node, t;
  }
  throw new Error("invalid node");
};
const getProps = (node) => {
  const props = {};
  const attributes = node.attributes;
  const len = attributes.length;
  for (let i = 0; i < len; i++) {
    const attr = attributes.item(i);
    const name = attr.name;
    name.includes(":") || (props[name] = "class" === name ? parseDomClass(attr.value) : attr.value);
  }
  return props;
};
const parseDomClass = (value) => parseClassList(value).filter((c) => !c.startsWith("\u2B50\uFE0F")).join(" ");
const isHeadChildren = (node) => {
  const type = node.nodeType;
  return 1 === type ? node.hasAttribute("q:head") : 111 === type;
};
const isSlotTemplate = (node) => "Q:TEMPLATE" === node.nodeName;
const isChildComponent = (node) => {
  const type = node.nodeType;
  if (3 === type || 111 === type) {
    return true;
  }
  if (1 !== type) {
    return false;
  }
  const nodeName = node.nodeName;
  return "Q:TEMPLATE" !== nodeName && ("HEAD" !== nodeName || node.hasAttribute("q:head"));
};
const patchVnode = (rctx, oldVnode, newVnode, flags) => {
  oldVnode.$type$, newVnode.$type$;
  const elm = oldVnode.$elm$;
  const tag = newVnode.$type$;
  const staticCtx = rctx.$static$;
  const isVirtual = ":virtual" === tag;
  if (newVnode.$elm$ = elm, "#text" === tag) {
    return void (oldVnode.$text$ !== newVnode.$text$ && setProperty(staticCtx, elm, "data", newVnode.$text$));
  }
  let isSvg = !!(1 & flags);
  isSvg || "svg" !== tag || (flags |= 1, isSvg = true);
  const props = newVnode.$props$;
  const isComponent = isVirtual && "q:renderFn" in props;
  const elCtx = getContext(elm);
  if (!isComponent) {
    const listenerMap = updateProperties(elCtx, staticCtx, oldVnode.$props$, props, isSvg);
    const currentComponent = rctx.$cmpCtx$;
    if (currentComponent && !currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      for (const key of Object.keys(currentComponent.li)) {
        addQRLListener(listenerMap, key, currentComponent.li[key]), addGlobalListener(staticCtx, elm, key);
      }
    }
    for (const key of Object.keys(listenerMap)) {
      setAttribute(staticCtx, elm, key, serializeQRLs(listenerMap[key], elCtx));
    }
    if (isSvg && "foreignObject" === newVnode.$type$ && (flags &= -2, isSvg = false), isVirtual && "q:s" in props) {
      const currentComponent2 = rctx.$cmpCtx$;
      return currentComponent2.$slots$, void currentComponent2.$slots$.push(newVnode);
    }
    if (void 0 !== props[dangerouslySetInnerHTML]) {
      return;
    }
    if (isVirtual && "qonce" in props) {
      return;
    }
    return smartUpdateChildren(rctx, oldVnode, newVnode, "root", flags);
  }
  let needsRender = setComponentProps$1(elCtx, rctx, props);
  return needsRender || elCtx.$renderQrl$ || elCtx.$element$.hasAttribute("q:id") || (setQId(rctx, elCtx), elCtx.$renderQrl$ = props["q:renderFn"], elCtx.$renderQrl$, needsRender = true), needsRender ? then(renderComponent(rctx, elCtx, flags), () => renderContentProjection(rctx, elCtx, newVnode, flags)) : renderContentProjection(rctx, elCtx, newVnode, flags);
};
const renderContentProjection = (rctx, hostCtx, vnode, flags) => {
  const newChildren = vnode.$children$;
  const staticCtx = rctx.$static$;
  const splittedNewChidren = ((input) => {
    var _a;
    const output = {};
    for (const item of input) {
      const key = getSlotName(item);
      ((_a = output[key]) != null ? _a : output[key] = new ProcessedJSXNodeImpl(":virtual", {
        "q:s": ""
      }, [], key)).$children$.push(item);
    }
    return output;
  })(newChildren);
  const slotRctx = pushRenderContext(rctx, hostCtx);
  const slotMaps = getSlotMap(hostCtx);
  for (const key of Object.keys(slotMaps.slots)) {
    if (!splittedNewChidren[key]) {
      const slotEl = slotMaps.slots[key];
      const oldCh = getChildrenVnodes(slotEl, "root");
      if (oldCh.length > 0) {
        const slotCtx = tryGetContext(slotEl);
        slotCtx && slotCtx.$vdom$ && (slotCtx.$vdom$.$children$ = []), removeVnodes(staticCtx, oldCh, 0, oldCh.length - 1);
      }
    }
  }
  for (const key of Object.keys(slotMaps.templates)) {
    const templateEl = slotMaps.templates[key];
    templateEl && (splittedNewChidren[key] && !slotMaps.slots[key] || (removeNode(staticCtx, templateEl), slotMaps.templates[key] = void 0));
  }
  return promiseAll(Object.keys(splittedNewChidren).map((key) => {
    const newVdom = splittedNewChidren[key];
    const slotElm = getSlotElement(staticCtx, slotMaps, hostCtx.$element$, key);
    const slotCtx = getContext(slotElm);
    const oldVdom = getVdom(slotCtx);
    return slotCtx.$vdom$ = newVdom, newVdom.$elm$ = slotElm, smartUpdateChildren(slotRctx, oldVdom, newVdom, "root", flags);
  }));
};
const addVnodes = (ctx, parentElm, before, vnodes, startIdx, endIdx, flags) => {
  const promises = [];
  let hasPromise = false;
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    const elm = createElm(ctx, ch, flags);
    promises.push(elm), isPromise(elm) && (hasPromise = true);
  }
  if (hasPromise) {
    return Promise.all(promises).then((children) => insertChildren(ctx.$static$, parentElm, children, before));
  }
  insertChildren(ctx.$static$, parentElm, promises, before);
};
const insertChildren = (ctx, parentElm, children, before) => {
  for (const child of children) {
    insertBefore(ctx, parentElm, child, before);
  }
};
const removeVnodes = (ctx, nodes, startIdx, endIdx) => {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = nodes[startIdx];
    ch && (ch.$elm$, removeNode(ctx, ch.$elm$));
  }
};
const getSlotElement = (ctx, slotMaps, parentEl, slotName) => {
  const slotEl = slotMaps.slots[slotName];
  if (slotEl) {
    return slotEl;
  }
  const templateEl = slotMaps.templates[slotName];
  if (templateEl) {
    return templateEl;
  }
  const template = createTemplate(ctx.$doc$, slotName);
  return ((ctx2, parent, newChild) => {
    ctx2.$operations$.push({
      $operation$: directInsertBefore,
      $args$: [parent, newChild, parent.firstChild]
    });
  })(ctx, parentEl, template), slotMaps.templates[slotName] = template, template;
};
const getSlotName = (node) => {
  var _a;
  return (_a = node.$props$[QSlot]) != null ? _a : "";
};
const createElm = (rctx, vnode, flags) => {
  const tag = vnode.$type$;
  const doc = rctx.$static$.$doc$;
  if ("#text" === tag) {
    return vnode.$elm$ = ((doc2, text) => doc2.createTextNode(text))(doc, vnode.$text$);
  }
  let elm;
  let isHead = !!(2 & flags);
  let isSvg = !!(1 & flags);
  isSvg || "svg" !== tag || (flags |= 1, isSvg = true);
  const isVirtual = ":virtual" === tag;
  const props = vnode.$props$;
  const isComponent = "q:renderFn" in props;
  const staticCtx = rctx.$static$;
  isVirtual ? elm = ((doc2) => {
    const open = doc2.createComment("qv ");
    const close = doc2.createComment("/qv");
    return new VirtualElementImpl(open, close);
  })(doc) : "head" === tag ? (elm = doc.head, flags |= 2, isHead = true) : (elm = createElement(doc, tag, isSvg), flags &= -3), vnode.$elm$ = elm, isSvg && "foreignObject" === tag && (isSvg = false, flags &= -2);
  const elCtx = getContext(elm);
  if (isComponent) {
    setKey(elm, vnode.$key$);
    const renderQRL = props["q:renderFn"];
    return setComponentProps$1(elCtx, rctx, props), setQId(rctx, elCtx), elCtx.$renderQrl$ = renderQRL, then(renderComponent(rctx, elCtx, flags), () => {
      let children2 = vnode.$children$;
      if (0 === children2.length) {
        return elm;
      }
      1 === children2.length && ":skipRender" === children2[0].$type$ && (children2 = children2[0].$children$);
      const slotRctx = pushRenderContext(rctx, elCtx);
      const slotMap = getSlotMap(elCtx);
      const elements = children2.map((ch) => createElm(slotRctx, ch, flags));
      return then(promiseAll(elements), () => {
        for (const node of children2) {
          node.$elm$, appendChild(staticCtx, getSlotElement(staticCtx, slotMap, elm, getSlotName(node)), node.$elm$);
        }
        return elm;
      });
    });
  }
  const currentComponent = rctx.$cmpCtx$;
  const isSlot = isVirtual && "q:s" in props;
  const hasRef = !isVirtual && "ref" in props;
  const listenerMap = setProperties(staticCtx, elCtx, props, isSvg);
  if (currentComponent && !isVirtual) {
    const scopedIds = currentComponent.$scopeIds$;
    if (scopedIds && scopedIds.forEach((styleId) => {
      elm.classList.add(styleId);
    }), !currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      for (const eventName of Object.keys(currentComponent.li)) {
        addQRLListener(listenerMap, eventName, currentComponent.li[eventName]);
      }
    }
  }
  isSlot ? (currentComponent.$slots$, setKey(elm, vnode.$key$), directSetAttribute(elm, "q:sref", currentComponent.$id$), currentComponent.$slots$.push(vnode), staticCtx.$addSlots$.push([elm, currentComponent.$element$])) : setKey(elm, vnode.$key$);
  {
    const listeners = Object.keys(listenerMap);
    isHead && !isVirtual && directSetAttribute(elm, "q:head", ""), (listeners.length > 0 || hasRef) && setQId(rctx, elCtx);
    for (const key of listeners) {
      setAttribute(staticCtx, elm, key, serializeQRLs(listenerMap[key], elCtx));
    }
  }
  if (void 0 !== props[dangerouslySetInnerHTML]) {
    return elm;
  }
  let children = vnode.$children$;
  if (0 === children.length) {
    return elm;
  }
  1 === children.length && ":skipRender" === children[0].$type$ && (children = children[0].$children$);
  const promises = children.map((ch) => createElm(rctx, ch, flags));
  return then(promiseAll(promises), () => {
    for (const node of children) {
      node.$elm$, appendChild(rctx.$static$, elm, node.$elm$);
    }
    return elm;
  });
};
const getSlotMap = (ctx) => {
  var _a, _b;
  const slotsArray = ((ctx2) => ctx2.$slots$ || (ctx2.$element$.parentElement, ctx2.$slots$ = readDOMSlots(ctx2)))(ctx);
  const slots = {};
  const templates = {};
  const t = Array.from(ctx.$element$.childNodes).filter(isSlotTemplate);
  for (const vnode of slotsArray) {
    vnode.$elm$, slots[(_a = vnode.$key$) != null ? _a : ""] = vnode.$elm$;
  }
  for (const elm of t) {
    templates[(_b = directGetAttribute(elm, QSlot)) != null ? _b : ""] = elm;
  }
  return {
    slots,
    templates
  };
};
const readDOMSlots = (ctx) => ((el, prop, value) => {
  const walker = ((el2, prop2, value2) => el2.ownerDocument.createTreeWalker(el2, 128, {
    acceptNode(c) {
      const virtual = getVirtualElement(c);
      return virtual && directGetAttribute(virtual, "q:sref") === value2 ? 1 : 2;
    }
  }))(el, 0, value);
  const pars = [];
  let currentNode = null;
  for (; currentNode = walker.nextNode(); ) {
    pars.push(getVirtualElement(currentNode));
  }
  return pars;
})(ctx.$element$.parentElement, 0, ctx.$id$).map(domToVnode);
const checkBeforeAssign = (ctx, elm, prop, newValue) => (prop in elm && elm[prop] !== newValue && setProperty(ctx, elm, prop, newValue), true);
const dangerouslySetInnerHTML = "dangerouslySetInnerHTML";
const PROP_HANDLER_MAP = {
  style: (ctx, elm, _, newValue) => (setProperty(ctx, elm.style, "cssText", stringifyStyle(newValue)), true),
  class: (ctx, elm, _, newValue, oldValue) => {
    const oldClasses = parseClassList(oldValue);
    const newClasses = parseClassList(newValue);
    return ((ctx2, elm2, toRemove, toAdd) => {
      ctx2 ? ctx2.$operations$.push({
        $operation$: _setClasslist,
        $args$: [elm2, toRemove, toAdd]
      }) : _setClasslist(elm2, toRemove, toAdd);
    })(ctx, elm, oldClasses.filter((c) => c && !newClasses.includes(c)), newClasses.filter((c) => c && !oldClasses.includes(c))), true;
  },
  value: checkBeforeAssign,
  checked: checkBeforeAssign,
  [dangerouslySetInnerHTML]: (ctx, elm, _, newValue) => (dangerouslySetInnerHTML in elm ? setProperty(ctx, elm, dangerouslySetInnerHTML, newValue) : "innerHTML" in elm && setProperty(ctx, elm, "innerHTML", newValue), true),
  innerHTML: () => true
};
const updateProperties = (elCtx, staticCtx, oldProps, newProps, isSvg) => {
  const keys = getKeys(oldProps, newProps);
  const listenersMap = elCtx.li = {};
  if (0 === keys.length) {
    return listenersMap;
  }
  const elm = elCtx.$element$;
  for (let key of keys) {
    if ("children" === key) {
      continue;
    }
    let newValue = newProps[key];
    "className" === key && (newProps.class = newValue, key = "class"), "class" === key && (newProps.class = newValue = serializeClass(newValue));
    const oldValue = oldProps[key];
    if (oldValue === newValue) {
      continue;
    }
    if ("ref" === key) {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      setEvent(listenersMap, key, newValue);
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    exception && exception(staticCtx, elm, key, newValue, oldValue) || (isSvg || !(key in elm) ? setAttribute(staticCtx, elm, key, newValue) : setProperty(staticCtx, elm, key, newValue));
  }
  return listenersMap;
};
const getKeys = (oldProps, newProps) => {
  const keys = Object.keys(newProps);
  return keys.push(...Object.keys(oldProps).filter((p) => !keys.includes(p))), keys;
};
const addGlobalListener = (staticCtx, elm, prop) => {
  try {
    window.qwikevents && window.qwikevents.push(getEventName(prop));
  } catch (err) {
  }
};
const setProperties = (rctx, elCtx, newProps, isSvg) => {
  const elm = elCtx.$element$;
  const keys = Object.keys(newProps);
  const listenerMap = elCtx.li;
  if (0 === keys.length) {
    return listenerMap;
  }
  for (let key of keys) {
    if ("children" === key) {
      continue;
    }
    let newValue = newProps[key];
    if ("className" === key && (newProps.class = newValue, key = "class"), "class" === key && (newProps.class = newValue = serializeClass(newValue)), "ref" === key) {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      addGlobalListener(rctx, elm, setEvent(listenerMap, key, newValue));
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    exception && exception(rctx, elm, key, newValue, void 0) || (isSvg || !(key in elm) ? setAttribute(rctx, elm, key, newValue) : setProperty(rctx, elm, key, newValue));
  }
  return listenerMap;
};
const setComponentProps$1 = (ctx, rctx, expectProps) => {
  const keys = Object.keys(expectProps);
  if (0 === keys.length) {
    return false;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$static$.$containerState$);
  for (const key of keys) {
    SKIPS_PROPS.includes(key) || qwikProps.set(key, expectProps[key]);
  }
  return ctx.$dirty$;
};
const cleanupTree = (parent, rctx, subsManager, stopSlots) => {
  if (stopSlots && parent.hasAttribute("q:s")) {
    return void rctx.$rmSlots$.push(parent);
  }
  cleanupElement(parent, subsManager);
  const ch = getChildren(parent, "elements");
  for (const child of ch) {
    cleanupTree(child, rctx, subsManager, stopSlots);
  }
};
const cleanupElement = (el, subsManager) => {
  const ctx = tryGetContext(el);
  ctx && cleanupContext(ctx, subsManager);
};
const directAppendChild = (parent, child) => {
  isVirtualElement(child) ? child.appendTo(parent) : parent.appendChild(child);
};
const directRemoveChild = (parent, child) => {
  isVirtualElement(child) ? child.remove() : parent.removeChild(child);
};
const directInsertBefore = (parent, child, ref) => {
  isVirtualElement(child) ? child.insertBeforeTo(parent, getRootNode(ref)) : parent.insertBefore(child, getRootNode(ref));
};
const createKeyToOldIdx = (children, beginIdx, endIdx) => {
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i].$key$;
    null != key && (map[key] = i);
  }
  return map;
};
const sameVnode = (vnode1, vnode2) => vnode1.$type$ === vnode2.$type$ && vnode1.$key$ === vnode2.$key$;
const isTagName = (elm, tagName) => elm.$type$ === tagName;
const useLexicalScope = () => {
  const context = getInvokeContext();
  let qrl = context.$qrl$;
  if (qrl) {
    qrl.$captureRef$;
  } else {
    const el = context.$element$;
    const container = getWrappingContainer(el);
    const ctx = getContext(el);
    qrl = parseQRL(decodeURIComponent(String(context.$url$)), container), resumeIfNeeded(container), inflateQrl(qrl, ctx);
  }
  return qrl.$captureRef$;
};
const notifyWatch = (watch, containerState) => {
  watch.$flags$ & WatchFlagsIsDirty || (watch.$flags$ |= WatchFlagsIsDirty, void 0 !== containerState.$hostsRendering$ ? (containerState.$renderPromise$, containerState.$watchStaging$.add(watch)) : (containerState.$watchNext$.add(watch), scheduleFrame(containerState)));
};
const scheduleFrame = (containerState) => (void 0 === containerState.$renderPromise$ && (containerState.$renderPromise$ = getPlatform().nextTick(() => renderMarked(containerState))), containerState.$renderPromise$);
const _hW = () => {
  const [watch] = useLexicalScope();
  notifyWatch(watch, getContainerState(getWrappingContainer(watch.$el$)));
};
const renderMarked = async (containerState) => {
  const hostsRendering = containerState.$hostsRendering$ = new Set(containerState.$hostsNext$);
  containerState.$hostsNext$.clear(), await executeWatchesBefore(containerState), containerState.$hostsStaging$.forEach((host) => {
    hostsRendering.add(host);
  }), containerState.$hostsStaging$.clear();
  const doc = getDocument(containerState.$containerEl$);
  const renderingQueue = Array.from(hostsRendering);
  sortNodes(renderingQueue);
  const ctx = createRenderContext(doc, containerState);
  const staticCtx = ctx.$static$;
  for (const el of renderingQueue) {
    if (!staticCtx.$hostElements$.has(el)) {
      const elCtx = getContext(el);
      if (elCtx.$renderQrl$) {
        el.isConnected, staticCtx.$roots$.push(elCtx);
        try {
          await renderComponent(ctx, elCtx, getFlags(el.parentElement));
        } catch (err) {
          logError(err);
        }
      }
    }
  }
  return staticCtx.$operations$.push(...staticCtx.$postOperations$), 0 === staticCtx.$operations$.length ? void postRendering(containerState, staticCtx) : getPlatform().raf(() => {
    (({ $static$: ctx2 }) => {
      executeDOMRender(ctx2);
    })(ctx), postRendering(containerState, staticCtx);
  });
};
const getFlags = (el) => {
  let flags = 0;
  return el && (el.namespaceURI === SVG_NS && (flags |= 1), "HEAD" === el.tagName && (flags |= 2)), flags;
};
const postRendering = async (containerState, ctx) => {
  await executeWatchesAfter(containerState, (watch, stage) => 0 != (watch.$flags$ & WatchFlagsIsEffect) && (!stage || ctx.$hostElements$.has(watch.$el$))), containerState.$hostsStaging$.forEach((el) => {
    containerState.$hostsNext$.add(el);
  }), containerState.$hostsStaging$.clear(), containerState.$hostsRendering$ = void 0, containerState.$renderPromise$ = void 0, containerState.$hostsNext$.size + containerState.$watchNext$.size > 0 && scheduleFrame(containerState);
};
const executeWatchesBefore = async (containerState) => {
  const resourcesPromises = [];
  const containerEl = containerState.$containerEl$;
  const watchPromises = [];
  const isWatch = (watch) => 0 != (watch.$flags$ & WatchFlagsIsWatch);
  const isResourceWatch2 = (watch) => 0 != (watch.$flags$ & WatchFlagsIsResource);
  containerState.$watchNext$.forEach((watch) => {
    isWatch(watch) && (watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch)), isResourceWatch2(watch) && (resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch));
  });
  do {
    if (containerState.$watchStaging$.forEach((watch) => {
      isWatch(watch) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : isResourceWatch2(watch) ? resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : containerState.$watchNext$.add(watch);
    }), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches), await Promise.all(watches.map((watch) => runSubscriber(watch, containerState))), watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
  if (resourcesPromises.length > 0) {
    const resources = await Promise.all(resourcesPromises);
    sortWatches(resources), resources.forEach((watch) => runSubscriber(watch, containerState));
  }
};
const executeWatchesAfter = async (containerState, watchPred) => {
  const watchPromises = [];
  const containerEl = containerState.$containerEl$;
  containerState.$watchNext$.forEach((watch) => {
    watchPred(watch, false) && (watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch));
  });
  do {
    if (containerState.$watchStaging$.forEach((watch) => {
      watchPred(watch, true) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : containerState.$watchNext$.add(watch);
    }), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches), await Promise.all(watches.map((watch) => runSubscriber(watch, containerState))), watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
};
const sortNodes = (elements) => {
  elements.sort((a, b) => 2 & a.compareDocumentPosition(getRootNode(b)) ? 1 : -1);
};
const sortWatches = (watches) => {
  watches.sort((a, b) => a.$el$ === b.$el$ ? a.$index$ < b.$index$ ? -1 : 1 : 0 != (2 & a.$el$.compareDocumentPosition(getRootNode(b.$el$))) ? 1 : -1);
};
const CONTAINER_STATE = Symbol("ContainerState");
const getContainerState = (containerEl) => {
  let set = containerEl[CONTAINER_STATE];
  return set || (containerEl[CONTAINER_STATE] = set = createContainerState(containerEl)), set;
};
const createContainerState = (containerEl) => {
  const containerState = {
    $containerEl$: containerEl,
    $proxyMap$: /* @__PURE__ */ new WeakMap(),
    $subsManager$: null,
    $watchNext$: /* @__PURE__ */ new Set(),
    $watchStaging$: /* @__PURE__ */ new Set(),
    $hostsNext$: /* @__PURE__ */ new Set(),
    $hostsStaging$: /* @__PURE__ */ new Set(),
    $renderPromise$: void 0,
    $hostsRendering$: void 0,
    $envData$: {},
    $elementIndex$: 0,
    $styleIds$: /* @__PURE__ */ new Set(),
    $mutableProps$: false
  };
  return containerState.$subsManager$ = createSubscriptionManager(containerState), containerState;
};
const createSubscriptionManager = (containerState) => {
  const objToSubs = /* @__PURE__ */ new Map();
  const subsToObjs = /* @__PURE__ */ new Map();
  const tryGetLocal = (obj) => (getProxyTarget(obj), objToSubs.get(obj));
  const trackSubToObj = (subscriber, map) => {
    let set = subsToObjs.get(subscriber);
    set || subsToObjs.set(subscriber, set = /* @__PURE__ */ new Set()), set.add(map);
  };
  const manager = {
    $tryGetLocal$: tryGetLocal,
    $getLocal$: (obj, initialMap) => {
      let local = tryGetLocal(obj);
      if (local)
        ;
      else {
        const map = initialMap || /* @__PURE__ */ new Map();
        map.forEach((_, key) => {
          trackSubToObj(key, map);
        }), objToSubs.set(obj, local = {
          $subs$: map,
          $addSub$(subscriber, key) {
            if (null == key) {
              map.set(subscriber, null);
            } else {
              let sub = map.get(subscriber);
              void 0 === sub && map.set(subscriber, sub = /* @__PURE__ */ new Set()), sub && sub.add(key);
            }
            trackSubToObj(subscriber, map);
          },
          $notifySubs$(key) {
            map.forEach((value, subscriber) => {
              null !== value && key && !value.has(key) || ((subscriber2, containerState2) => {
                isQwikElement(subscriber2) ? ((hostElement, containerState3) => {
                  const server = isServer$1();
                  server || resumeIfNeeded(containerState3.$containerEl$);
                  const ctx = getContext(hostElement);
                  if (ctx.$renderQrl$, !ctx.$dirty$) {
                    if (ctx.$dirty$ = true, void 0 !== containerState3.$hostsRendering$) {
                      containerState3.$renderPromise$, containerState3.$hostsStaging$.add(hostElement);
                    } else {
                      if (server) {
                        return void logWarn();
                      }
                      containerState3.$hostsNext$.add(hostElement), scheduleFrame(containerState3);
                    }
                  }
                })(subscriber2, containerState2) : notifyWatch(subscriber2, containerState2);
              })(subscriber, containerState);
            });
          }
        });
      }
      return local;
    },
    $clearSub$: (sub) => {
      const subs = subsToObjs.get(sub);
      subs && (subs.forEach((s) => {
        s.delete(sub);
      }), subsToObjs.delete(sub), subs.clear());
    }
  };
  return manager;
};
const _pauseFromContexts = async (allContexts, containerState) => {
  const collector = createCollector(containerState);
  const listeners = [];
  for (const ctx of allContexts) {
    const el = ctx.$element$;
    const ctxLi = ctx.li;
    for (const key of Object.keys(ctxLi)) {
      for (const qrl of ctxLi[key]) {
        const captured = qrl.$captureRef$;
        if (captured) {
          for (const obj of captured) {
            collectValue(obj, collector, true);
          }
        }
        isElement(el) && listeners.push({
          key,
          qrl,
          el,
          eventName: getEventName(key)
        });
      }
    }
    ctx.$watches$ && collector.$watches$.push(...ctx.$watches$);
  }
  if (0 === listeners.length) {
    return {
      state: {
        ctx: {},
        objs: [],
        subs: []
      },
      objs: [],
      listeners: [],
      mode: "static"
    };
  }
  let promises;
  for (; (promises = collector.$promises$).length > 0; ) {
    collector.$promises$ = [], await Promise.allSettled(promises);
  }
  const canRender = collector.$elements$.length > 0;
  if (canRender) {
    for (const element of collector.$elements$) {
      collectElementData(tryGetContext(element), collector);
    }
    for (const ctx of allContexts) {
      if (ctx.$props$ && collectMutableProps(ctx.$element$, ctx.$props$, collector), ctx.$contexts$) {
        for (const item of ctx.$contexts$.values()) {
          collectValue(item, collector, false);
        }
      }
    }
  }
  for (; (promises = collector.$promises$).length > 0; ) {
    collector.$promises$ = [], await Promise.allSettled(promises);
  }
  const elementToIndex = /* @__PURE__ */ new Map();
  const objs = Array.from(collector.$objSet$.keys());
  const objToId = /* @__PURE__ */ new Map();
  const getElementID = (el) => {
    let id = elementToIndex.get(el);
    return void 0 === id && (id = ((el2) => {
      const ctx = tryGetContext(el2);
      return ctx ? ctx.$id$ : null;
    })(el), id ? id = "#" + id : console.warn("Missing ID", el), elementToIndex.set(el, id)), id;
  };
  const getObjId = (obj) => {
    let suffix = "";
    if (isMutable(obj) && (obj = obj.mut, suffix = "%"), isPromise(obj)) {
      const { value, resolved } = getPromiseValue(obj);
      obj = value, suffix += resolved ? "~" : "_";
    }
    if (isObject(obj)) {
      const target = getProxyTarget(obj);
      if (target) {
        suffix += "!", obj = target;
      } else if (isQwikElement(obj)) {
        const elID = getElementID(obj);
        return elID ? elID + suffix : null;
      }
    }
    const id = objToId.get(obj);
    return id ? id + suffix : null;
  };
  const mustGetObjId = (obj) => {
    const key = getObjId(obj);
    if (null === key) {
      throw qError(QError_missingObjectId, obj);
    }
    return key;
  };
  const subsMap = /* @__PURE__ */ new Map();
  objs.forEach((obj) => {
    const proxy = containerState.$proxyMap$.get(obj);
    const flags = getProxyFlags(proxy);
    if (void 0 === flags) {
      return;
    }
    const subsObj = [];
    flags > 0 && subsObj.push({
      subscriber: "$",
      data: flags
    }), getProxySubs(proxy).forEach((set, key) => {
      isNode(key) && isVirtualElement(key) && !collector.$elements$.includes(key) || subsObj.push({
        subscriber: key,
        data: set ? Array.from(set) : null
      });
    }), subsObj.length > 0 && subsMap.set(obj, subsObj);
  }), objs.sort((a, b) => (subsMap.has(a) ? 0 : 1) - (subsMap.has(b) ? 0 : 1));
  let count = 0;
  for (const obj of objs) {
    objToId.set(obj, intToStr(count)), count++;
  }
  if (collector.$noSerialize$.length > 0) {
    const undefinedID = objToId.get(void 0);
    for (const obj of collector.$noSerialize$) {
      objToId.set(obj, undefinedID);
    }
  }
  const subs = objs.map((obj) => {
    const sub = subsMap.get(obj);
    if (!sub) {
      return;
    }
    const subsObj = {};
    return sub.forEach(({ subscriber, data: data2 }) => {
      if ("$" === subscriber) {
        subsObj[subscriber] = data2;
      } else {
        const id = getObjId(subscriber);
        null !== id && (subsObj[id] = data2);
      }
    }), subsObj;
  }).filter(isNotNullable);
  const convertedObjs = objs.map((obj) => {
    if (null === obj) {
      return null;
    }
    const typeObj = typeof obj;
    switch (typeObj) {
      case "undefined":
        return UNDEFINED_PREFIX;
      case "string":
      case "number":
      case "boolean":
        return obj;
      default:
        const value = serializeValue(obj, getObjId, containerState);
        if (void 0 !== value) {
          return value;
        }
        if ("object" === typeObj) {
          if (isArray(obj)) {
            return obj.map(mustGetObjId);
          }
          if (isSerializableObject(obj)) {
            const output = {};
            for (const key of Object.keys(obj)) {
              output[key] = mustGetObjId(obj[key]);
            }
            return output;
          }
        }
    }
    throw qError(QError_verifySerializable, obj);
  });
  const meta = {};
  allContexts.forEach((ctx) => {
    const node = ctx.$element$;
    const ref = ctx.$refMap$;
    const props = ctx.$props$;
    const contexts = ctx.$contexts$;
    const watches = ctx.$watches$;
    const renderQrl = ctx.$renderQrl$;
    const seq = ctx.$seq$;
    const metaValue = {};
    const elementCaptured = isVirtualElement(node) && collector.$elements$.includes(node);
    let add = false;
    if (ref.length > 0) {
      const value = ref.map(mustGetObjId).join(" ");
      value && (metaValue.r = value, add = true);
    }
    if (canRender) {
      if (elementCaptured && props && (metaValue.h = mustGetObjId(props) + " " + mustGetObjId(renderQrl), add = true), watches && watches.length > 0) {
        const value = watches.map(getObjId).filter(isNotNullable).join(" ");
        value && (metaValue.w = value, add = true);
      }
      if (elementCaptured && seq && seq.length > 0) {
        const value = seq.map(mustGetObjId).join(" ");
        metaValue.s = value, add = true;
      }
      if (contexts) {
        const serializedContexts = [];
        contexts.forEach((value2, key) => {
          serializedContexts.push(`${key}=${mustGetObjId(value2)}`);
        });
        const value = serializedContexts.join(" ");
        value && (metaValue.c = value, add = true);
      }
    }
    if (add) {
      const elementID = getElementID(node);
      meta[elementID] = metaValue;
    }
  });
  for (const watch of collector.$watches$) {
    destroyWatch(watch);
  }
  return {
    state: {
      ctx: meta,
      objs: convertedObjs,
      subs
    },
    objs,
    listeners,
    mode: canRender ? "render" : "listeners"
  };
};
const getNodesInScope = (parent, predicate) => {
  predicate(parent);
  const walker = parent.ownerDocument.createTreeWalker(parent, 129, {
    acceptNode: (node) => isContainer(node) ? 2 : predicate(node) ? 1 : 3
  });
  const pars = [];
  let currentNode = null;
  for (; currentNode = walker.nextNode(); ) {
    pars.push(processVirtualNodes(currentNode));
  }
  return pars;
};
const reviveNestedObjects = (obj, getObject, parser) => {
  if (!parser.fill(obj) && obj && "object" == typeof obj) {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        "string" == typeof value ? obj[i] = getObject(value) : reviveNestedObjects(value, getObject, parser);
      }
    } else if (isSerializableObject(obj)) {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        "string" == typeof value ? obj[key] = getObject(value) : reviveNestedObjects(value, getObject, parser);
      }
    }
  }
};
const OBJECT_TRANSFORMS = {
  "!": (obj, containerState) => {
    var _a;
    return (_a = containerState.$proxyMap$.get(obj)) != null ? _a : getOrCreateProxy(obj, containerState);
  },
  "%": (obj) => mutable(obj),
  "~": (obj) => Promise.resolve(obj),
  _: (obj) => Promise.reject(obj)
};
const collectMutableProps = (el, props, collector) => {
  const subs = getProxySubs(props);
  subs && subs.has(el) && collectElement(el, collector);
};
const createCollector = (containerState) => ({
  $containerState$: containerState,
  $seen$: /* @__PURE__ */ new Set(),
  $objSet$: /* @__PURE__ */ new Set(),
  $noSerialize$: [],
  $elements$: [],
  $watches$: [],
  $promises$: []
});
const collectDeferElement = (el, collector) => {
  collector.$elements$.includes(el) || collector.$elements$.push(el);
};
const collectElement = (el, collector) => {
  if (collector.$elements$.includes(el)) {
    return;
  }
  const ctx = tryGetContext(el);
  ctx && (collector.$elements$.push(el), collectElementData(ctx, collector));
};
const collectElementData = (ctx, collector) => {
  if (ctx.$props$ && collectValue(ctx.$props$, collector, false), ctx.$renderQrl$ && collectValue(ctx.$renderQrl$, collector, false), ctx.$seq$) {
    for (const obj of ctx.$seq$) {
      collectValue(obj, collector, false);
    }
  }
  if (ctx.$watches$) {
    for (const obj of ctx.$watches$) {
      collectValue(obj, collector, false);
    }
  }
  if (ctx.$contexts$) {
    for (const obj of ctx.$contexts$.values()) {
      collectValue(obj, collector, false);
    }
  }
};
const PROMISE_VALUE = Symbol();
const getPromiseValue = (promise) => promise[PROMISE_VALUE];
const collectValue = (obj, collector, leaks) => {
  if (null !== obj) {
    const objType = typeof obj;
    const seen = collector.$seen$;
    switch (objType) {
      case "function":
        if (seen.has(obj)) {
          return;
        }
        if (seen.add(obj), !fastShouldSerialize(obj)) {
          return collector.$objSet$.add(void 0), void collector.$noSerialize$.push(obj);
        }
        if (isQrl$1(obj)) {
          if (collector.$objSet$.add(obj), obj.$captureRef$) {
            for (const item of obj.$captureRef$) {
              collectValue(item, collector, leaks);
            }
          }
          return;
        }
        break;
      case "object": {
        if (seen.has(obj)) {
          return;
        }
        if (seen.add(obj), !fastShouldSerialize(obj)) {
          return collector.$objSet$.add(void 0), void collector.$noSerialize$.push(obj);
        }
        if (isPromise(obj)) {
          return void collector.$promises$.push((promise = obj, promise.then((value) => {
            const v = {
              resolved: true,
              value
            };
            return promise[PROMISE_VALUE] = v, value;
          }, (value) => {
            const v = {
              resolved: false,
              value
            };
            return promise[PROMISE_VALUE] = v, value;
          })).then((value) => {
            collectValue(value, collector, leaks);
          }));
        }
        const target = getProxyTarget(obj);
        const input = obj;
        if (target) {
          if (leaks && ((proxy, collector2) => {
            const subs = getProxySubs(proxy);
            if (!collector2.$seen$.has(subs)) {
              collector2.$seen$.add(subs);
              for (const key of Array.from(subs.keys())) {
                isNode(key) && isVirtualElement(key) ? collectDeferElement(key, collector2) : collectValue(key, collector2, true);
              }
            }
          })(input, collector), obj = target, seen.has(obj)) {
            return;
          }
          if (seen.add(obj), isResourceReturn(obj)) {
            return collector.$objSet$.add(target), collectValue(obj.promise, collector, leaks), void collectValue(obj.resolved, collector, leaks);
          }
        } else if (isNode(obj)) {
          return;
        }
        if (isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            collectValue(input[i], collector, leaks);
          }
        } else {
          for (const key of Object.keys(obj)) {
            collectValue(input[key], collector, leaks);
          }
        }
        break;
      }
    }
  }
  var promise;
  collector.$objSet$.add(obj);
};
const isContainer = (el) => isElement(el) && el.hasAttribute("q:container");
const hasQId = (el) => {
  const node = processVirtualNodes(el);
  return !!isQwikElement(node) && node.hasAttribute("q:id");
};
const intToStr = (nu) => nu.toString(36);
const strToInt = (nu) => parseInt(nu, 36);
const getEventName = (attribute) => {
  const colonPos = attribute.indexOf(":");
  return attribute.slice(colonPos + 1).replace(/-./g, (x) => x[1].toUpperCase());
};
const WatchFlagsIsEffect = 1;
const WatchFlagsIsWatch = 2;
const WatchFlagsIsDirty = 4;
const WatchFlagsIsCleanup = 8;
const WatchFlagsIsResource = 16;
const useWatchQrl = (qrl, opts) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (get) {
    return;
  }
  const el = ctx.$hostElement$;
  const containerState = ctx.$renderCtx$.$static$.$containerState$;
  const watch = new Watch(WatchFlagsIsDirty | WatchFlagsIsWatch, i, el, qrl, void 0);
  const elCtx = getContext(el);
  set(true), qrl.$resolveLazy$(containerState.$containerEl$), elCtx.$watches$ || (elCtx.$watches$ = []), elCtx.$watches$.push(watch), waitAndRun(ctx, () => runSubscriber(watch, containerState, ctx.$renderCtx$)), isServer$1() && useRunWatch(watch, opts == null ? void 0 : opts.eagerness);
};
const isResourceWatch = (watch) => !!watch.$resource$;
const runSubscriber = (watch, containerState, rctx) => (watch.$flags$, isResourceWatch(watch) ? runResource(watch, containerState) : runWatch(watch, containerState, rctx));
const runResource = (watch, containerState, waitOn) => {
  watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
  const el = watch.$el$;
  const invokationContext = newInvokeContext(el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  const resource = watch.$resource$;
  const resourceTarget = unwrapProxy(resource);
  const opts = {
    track: (obj, prop) => {
      const target = getProxyTarget(obj);
      return target ? subsManager.$getLocal$(target).$addSub$(watch, prop) : logErrorAndStop(codeToText(QError_trackUseStore), obj), prop ? obj[prop] : obj;
    },
    cleanup(callback) {
      cleanups.push(callback);
    },
    previous: resourceTarget.resolved
  };
  let resolve;
  let reject;
  let done = false;
  const setState = (resolved, value) => !done && (done = true, resolved ? (done = true, resource.state = "resolved", resource.resolved = value, resource.error = void 0, resolve(value)) : (done = true, resource.state = "rejected", resource.resolved = void 0, resource.error = value, reject(value)), true);
  invoke(invokationContext, () => {
    resource.state = "pending", resource.resolved = void 0, resource.promise = new Promise((r, re) => {
      resolve = r, reject = re;
    });
  }), watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const promise = safeCall(() => then(waitOn, () => watchFn(opts)), (value) => {
    setState(true, value);
  }, (reason) => {
    setState(false, reason);
  });
  const timeout = resourceTarget.timeout;
  return timeout ? Promise.race([promise, delay(timeout).then(() => {
    setState(false, "timeout") && cleanupWatch(watch);
  })]) : promise;
};
const runWatch = (watch, containerState, rctx) => {
  watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
  const hostElement = watch.$el$;
  const invokationContext = newInvokeContext(hostElement, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const opts = {
    track: (obj, prop) => {
      const target = getProxyTarget(obj);
      return target ? subsManager.$getLocal$(target).$addSub$(watch, prop) : logErrorAndStop(codeToText(QError_trackUseStore), obj), prop ? obj[prop] : obj;
    },
    cleanup(callback) {
      cleanups.push(callback);
    }
  };
  return safeCall(() => watchFn(opts), (returnValue) => {
    isFunction(returnValue) && cleanups.push(returnValue);
  }, (reason) => {
    handleError(reason, hostElement, rctx);
  });
};
const cleanupWatch = (watch) => {
  const destroy = watch.$destroy$;
  if (destroy) {
    watch.$destroy$ = void 0;
    try {
      destroy();
    } catch (err) {
      logError(err);
    }
  }
};
const destroyWatch = (watch) => {
  watch.$flags$ & WatchFlagsIsCleanup ? (watch.$flags$ &= ~WatchFlagsIsCleanup, (0, watch.$qrl$)()) : cleanupWatch(watch);
};
const useRunWatch = (watch, eagerness) => {
  "load" === eagerness ? useOn("qinit", getWatchHandlerQrl(watch)) : "visible" === eagerness && useOn("qvisible", getWatchHandlerQrl(watch));
};
const getWatchHandlerQrl = (watch) => {
  const watchQrl = watch.$qrl$;
  return createQRL(watchQrl.$chunk$, "_hW", _hW, null, null, [watch], watchQrl.$symbol$);
};
class Watch {
  constructor($flags$, $index$, $el$, $qrl$, $resource$) {
    this.$flags$ = $flags$, this.$index$ = $index$, this.$el$ = $el$, this.$qrl$ = $qrl$, this.$resource$ = $resource$;
  }
}
const _createResourceReturn = (opts) => ({
  __brand: "resource",
  promise: void 0,
  resolved: void 0,
  error: void 0,
  state: "pending",
  timeout: opts == null ? void 0 : opts.timeout
});
const isResourceReturn = (obj) => isObject(obj) && "resource" === obj.__brand;
const UNDEFINED_PREFIX = "";
const QRLSerializer = {
  prefix: "",
  test: (v) => isQrl$1(v),
  serialize: (obj, getObjId, containerState) => stringifyQRL(obj, {
    $getObjId$: getObjId
  }),
  prepare: (data2, containerState) => parseQRL(data2, containerState.$containerEl$),
  fill: (qrl, getObject) => {
    qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), qrl.$capture$ = null);
  }
};
const WatchSerializer = {
  prefix: "",
  test: (v) => {
    return isObject(obj = v) && obj instanceof Watch;
    var obj;
  },
  serialize: (obj, getObjId) => ((watch, getObjId2) => {
    let value = `${intToStr(watch.$flags$)} ${intToStr(watch.$index$)} ${getObjId2(watch.$qrl$)} ${getObjId2(watch.$el$)}`;
    return isResourceWatch(watch) && (value += ` ${getObjId2(watch.$resource$)}`), value;
  })(obj, getObjId),
  prepare: (data2) => ((data3) => {
    const [flags, index2, qrl, el, resource] = data3.split(" ");
    return new Watch(strToInt(flags), strToInt(index2), el, qrl, resource);
  })(data2),
  fill: (watch, getObject) => {
    watch.$el$ = getObject(watch.$el$), watch.$qrl$ = getObject(watch.$qrl$), watch.$resource$ && (watch.$resource$ = getObject(watch.$resource$));
  }
};
const ResourceSerializer = {
  prefix: "",
  test: (v) => isResourceReturn(v),
  serialize: (obj, getObjId) => ((resource, getObjId2) => {
    const state = resource.state;
    return "resolved" === state ? `0 ${getObjId2(resource.resolved)}` : "pending" === state ? "1" : `2 ${getObjId2(resource.error)}`;
  })(obj, getObjId),
  prepare: (data2) => ((data3) => {
    const [first, id] = data3.split(" ");
    const result = _createResourceReturn(void 0);
    return result.promise = Promise.resolve(), "0" === first ? (result.state = "resolved", result.resolved = id) : "1" === first ? (result.state = "pending", result.promise = new Promise(() => {
    })) : "2" === first && (result.state = "rejected", result.error = id), result;
  })(data2),
  fill: (resource, getObject) => {
    if ("resolved" === resource.state) {
      resource.resolved = getObject(resource.resolved), resource.promise = Promise.resolve(resource.resolved);
    } else if ("rejected" === resource.state) {
      const p = Promise.reject(resource.error);
      p.catch(() => null), resource.error = getObject(resource.error), resource.promise = p;
    }
  }
};
const URLSerializer = {
  prefix: "",
  test: (v) => v instanceof URL,
  serialize: (obj) => obj.href,
  prepare: (data2) => new URL(data2),
  fill: void 0
};
const DateSerializer = {
  prefix: "",
  test: (v) => v instanceof Date,
  serialize: (obj) => obj.toISOString(),
  prepare: (data2) => new Date(data2),
  fill: void 0
};
const RegexSerializer = {
  prefix: "\x07",
  test: (v) => v instanceof RegExp,
  serialize: (obj) => `${obj.flags} ${obj.source}`,
  prepare: (data2) => {
    const space = data2.indexOf(" ");
    const source = data2.slice(space + 1);
    const flags = data2.slice(0, space);
    return new RegExp(source, flags);
  },
  fill: void 0
};
const ErrorSerializer = {
  prefix: "",
  test: (v) => v instanceof Error,
  serialize: (obj) => obj.message,
  prepare: (text) => {
    const err = new Error(text);
    return err.stack = void 0, err;
  },
  fill: void 0
};
const DocumentSerializer = {
  prefix: "",
  test: (v) => isDocument(v),
  serialize: void 0,
  prepare: (_, _c, doc) => doc,
  fill: void 0
};
const SERIALIZABLE_STATE = Symbol("serializable-data");
const ComponentSerializer = {
  prefix: "",
  test: (obj) => isQwikComponent(obj),
  serialize: (obj, getObjId, containerState) => {
    const [qrl] = obj[SERIALIZABLE_STATE];
    return stringifyQRL(qrl, {
      $getObjId$: getObjId
    });
  },
  prepare: (data2, containerState) => {
    const optionsIndex = data2.indexOf("{");
    const qrlString = -1 == optionsIndex ? data2 : data2.slice(0, optionsIndex);
    const qrl = parseQRL(qrlString, containerState.$containerEl$);
    return componentQrl(qrl);
  },
  fill: (component, getObject) => {
    const [qrl] = component[SERIALIZABLE_STATE];
    qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), qrl.$capture$ = null);
  }
};
const serializers = [QRLSerializer, WatchSerializer, ResourceSerializer, URLSerializer, DateSerializer, RegexSerializer, ErrorSerializer, DocumentSerializer, ComponentSerializer, {
  prefix: "",
  test: (obj) => "function" == typeof obj && void 0 !== obj.__qwik_serializable__,
  serialize: (obj) => obj.toString(),
  prepare: (data2) => {
    const fn = new Function("return " + data2)();
    return fn.__qwik_serializable__ = true, fn;
  },
  fill: void 0
}];
const serializeValue = (obj, getObjID, containerState) => {
  for (const s of serializers) {
    if (s.test(obj)) {
      let value = s.prefix;
      return s.serialize && (value += s.serialize(obj, getObjID, containerState)), value;
    }
  }
};
const getOrCreateProxy = (target, containerState, flags = 0) => containerState.$proxyMap$.get(target) || createProxy(target, containerState, flags, void 0);
const createProxy = (target, containerState, flags, subs) => {
  unwrapProxy(target), containerState.$proxyMap$.has(target);
  const manager = containerState.$subsManager$.$getLocal$(target, subs);
  const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager, flags));
  return containerState.$proxyMap$.set(target, proxy), proxy;
};
const QOjectTargetSymbol = Symbol();
const QOjectSubsSymbol = Symbol();
const QOjectFlagsSymbol = Symbol();
class ReadWriteProxyHandler {
  constructor($containerState$, $manager$, $flags$) {
    this.$containerState$ = $containerState$, this.$manager$ = $manager$, this.$flags$ = $flags$;
  }
  get(target, prop) {
    if ("symbol" == typeof prop) {
      return prop === QOjectTargetSymbol ? target : prop === QOjectFlagsSymbol ? this.$flags$ : prop === QOjectSubsSymbol ? this.$manager$.$subs$ : target[prop];
    }
    let subscriber;
    const invokeCtx = tryGetInvokeContext();
    const recursive = 0 != (1 & this.$flags$);
    const immutable = 0 != (2 & this.$flags$);
    invokeCtx && (subscriber = invokeCtx.$subscriber$);
    let value = target[prop];
    if (isMutable(value) ? value = value.mut : immutable && (subscriber = null), subscriber) {
      const isA = isArray(target);
      this.$manager$.$addSub$(subscriber, isA ? void 0 : prop);
    }
    return recursive ? wrap(value, this.$containerState$) : value;
  }
  set(target, prop, newValue) {
    if ("symbol" == typeof prop) {
      return target[prop] = newValue, true;
    }
    if (0 != (2 & this.$flags$)) {
      throw qError(QError_immutableProps);
    }
    const unwrappedNewValue = 0 != (1 & this.$flags$) ? unwrapProxy(newValue) : newValue;
    return isArray(target) ? (target[prop] = unwrappedNewValue, this.$manager$.$notifySubs$(), true) : (target[prop] !== unwrappedNewValue && (target[prop] = unwrappedNewValue, this.$manager$.$notifySubs$(prop)), true);
  }
  has(target, property) {
    return property === QOjectTargetSymbol || property === QOjectFlagsSymbol || Object.prototype.hasOwnProperty.call(target, property);
  }
  ownKeys(target) {
    let subscriber = null;
    const invokeCtx = tryGetInvokeContext();
    return invokeCtx && (subscriber = invokeCtx.$subscriber$), subscriber && this.$manager$.$addSub$(subscriber), Object.getOwnPropertyNames(target);
  }
}
const wrap = (value, containerState) => {
  if (isQrl$1(value)) {
    return value;
  }
  if (isObject(value)) {
    if (Object.isFrozen(value)) {
      return value;
    }
    const nakedValue = unwrapProxy(value);
    return nakedValue !== value || isNode(nakedValue) ? value : shouldSerialize(nakedValue) ? containerState.$proxyMap$.get(value) || getOrCreateProxy(value, containerState, 1) : value;
  }
  return value;
};
const noSerializeSet = /* @__PURE__ */ new WeakSet();
const shouldSerialize = (obj) => !isObject(obj) && !isFunction(obj) || !noSerializeSet.has(obj);
const fastShouldSerialize = (obj) => !noSerializeSet.has(obj);
const noSerialize = (input) => (null != input && noSerializeSet.add(input), input);
const mutable = (v) => new MutableImpl(v);
class MutableImpl {
  constructor(mut) {
    this.mut = mut;
  }
}
const isMutable = (v) => v instanceof MutableImpl;
const unwrapProxy = (proxy) => {
  var _a;
  return isObject(proxy) ? (_a = getProxyTarget(proxy)) != null ? _a : proxy : proxy;
};
const getProxyTarget = (obj) => obj[QOjectTargetSymbol];
const getProxySubs = (obj) => obj[QOjectSubsSymbol];
const getProxyFlags = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectFlagsSymbol];
  }
};
const resumeIfNeeded = (containerEl) => {
  "paused" === directGetAttribute(containerEl, "q:container") && (((containerEl2) => {
    if (!isContainer(containerEl2)) {
      return void logWarn();
    }
    const doc = getDocument(containerEl2);
    const script = ((parentElm) => {
      let child = parentElm.lastElementChild;
      for (; child; ) {
        if ("SCRIPT" === child.tagName && "qwik/json" === directGetAttribute(child, "type")) {
          return child;
        }
        child = child.previousElementSibling;
      }
    })(containerEl2 === doc.documentElement ? doc.body : containerEl2);
    if (!script) {
      return void logWarn();
    }
    script.remove();
    const containerState = getContainerState(containerEl2);
    ((containerEl3, containerState2) => {
      const head2 = containerEl3.ownerDocument.head;
      containerEl3.querySelectorAll("style[q\\:style]").forEach((el2) => {
        containerState2.$styleIds$.add(directGetAttribute(el2, "q:style")), head2.appendChild(el2);
      });
    })(containerEl2, containerState);
    const meta = JSON.parse((script.textContent || "{}").replace(/\\x3C(\/?script)/g, "<$1"));
    const elements = /* @__PURE__ */ new Map();
    const getObject = (id) => ((id2, elements2, objs, containerState2) => {
      if ("string" == typeof id2 && id2.length, id2.startsWith("#")) {
        return elements2.has(id2), elements2.get(id2);
      }
      const index2 = strToInt(id2);
      objs.length;
      let obj = objs[index2];
      for (let i = id2.length - 1; i >= 0; i--) {
        const code = id2[i];
        const transform = OBJECT_TRANSFORMS[code];
        if (!transform) {
          break;
        }
        obj = transform(obj, containerState2);
      }
      return obj;
    })(id, elements, meta.objs, containerState);
    let maxId = 0;
    getNodesInScope(containerEl2, hasQId).forEach((el2) => {
      const id = directGetAttribute(el2, "q:id");
      const ctx = getContext(el2);
      ctx.$id$ = id, isElement(el2) && (ctx.$vdom$ = domToVnode(el2)), elements.set("#" + id, el2), maxId = Math.max(maxId, strToInt(id));
    }), containerState.$elementIndex$ = ++maxId;
    const parser = ((getObject2, containerState2, doc2) => {
      const map = /* @__PURE__ */ new Map();
      return {
        prepare(data2) {
          for (const s of serializers) {
            const prefix = s.prefix;
            if (data2.startsWith(prefix)) {
              const value = s.prepare(data2.slice(prefix.length), containerState2, doc2);
              return s.fill && map.set(value, s), value;
            }
          }
          return data2;
        },
        fill(obj) {
          const serializer = map.get(obj);
          return !!serializer && (serializer.fill(obj, getObject2, containerState2), true);
        }
      };
    })(getObject, containerState, doc);
    ((objs, subs, getObject2, containerState2, parser2) => {
      for (let i = 0; i < objs.length; i++) {
        const value = objs[i];
        isString(value) && (objs[i] = value === UNDEFINED_PREFIX ? void 0 : parser2.prepare(value));
      }
      for (let i = 0; i < subs.length; i++) {
        const value = objs[i];
        const sub = subs[i];
        if (sub) {
          const converted = /* @__PURE__ */ new Map();
          let flags = 0;
          for (const key of Object.keys(sub)) {
            const v = sub[key];
            if ("$" === key) {
              flags = v;
              continue;
            }
            const el2 = getObject2(key);
            if (!el2) {
              continue;
            }
            const set = null === v ? null : new Set(v);
            converted.set(el2, set);
          }
          createProxy(value, containerState2, flags, converted);
        }
      }
    })(meta.objs, meta.subs, getObject, containerState, parser);
    for (const obj of meta.objs) {
      reviveNestedObjects(obj, getObject, parser);
    }
    for (const elementID of Object.keys(meta.ctx)) {
      elementID.startsWith("#");
      const ctxMeta = meta.ctx[elementID];
      const el2 = elements.get(elementID);
      const ctx = getContext(el2);
      const refMap = ctxMeta.r;
      const seq = ctxMeta.s;
      const host = ctxMeta.h;
      const contexts = ctxMeta.c;
      const watches = ctxMeta.w;
      if (refMap && (isElement(el2), ctx.$refMap$ = refMap.split(" ").map(getObject), ctx.li = getDomListeners(ctx, containerEl2)), seq && (ctx.$seq$ = seq.split(" ").map(getObject)), watches && (ctx.$watches$ = watches.split(" ").map(getObject)), contexts) {
        ctx.$contexts$ = /* @__PURE__ */ new Map();
        for (const part of contexts.split(" ")) {
          const [key, value] = part.split("=");
          ctx.$contexts$.set(key, getObject(value));
        }
      }
      if (host) {
        const [props, renderQrl] = host.split(" ");
        const styleIds = el2.getAttribute("q:sstyle");
        ctx.$scopeIds$ = styleIds ? styleIds.split(" ") : null, ctx.$mounted$ = true, ctx.$props$ = getObject(props), ctx.$renderQrl$ = getObject(renderQrl);
      }
    }
    var el;
    directSetAttribute(containerEl2, "q:container", "resumed"), (el = containerEl2) && "function" == typeof CustomEvent && el.dispatchEvent(new CustomEvent("qresume", {
      detail: void 0,
      bubbles: true,
      composed: true
    }));
  })(containerEl), appendQwikDevTools(containerEl));
};
const appendQwikDevTools = (containerEl) => {
  containerEl.qwik = {
    pause: () => (async (elmOrDoc, defaultParentJSON) => {
      const doc = getDocument(elmOrDoc);
      const documentElement = doc.documentElement;
      const containerEl2 = isDocument(elmOrDoc) ? documentElement : elmOrDoc;
      if ("paused" === directGetAttribute(containerEl2, "q:container")) {
        throw qError(QError_containerAlreadyPaused);
      }
      const parentJSON = containerEl2 === doc.documentElement ? doc.body : containerEl2;
      const data2 = await (async (containerEl3) => {
        const containerState = getContainerState(containerEl3);
        const contexts = getNodesInScope(containerEl3, hasQId).map(tryGetContext);
        return _pauseFromContexts(contexts, containerState);
      })(containerEl2);
      const script = doc.createElement("script");
      return directSetAttribute(script, "type", "qwik/json"), script.textContent = JSON.stringify(data2.state, void 0, void 0).replace(/<(\/?script)/g, "\\x3C$1"), parentJSON.appendChild(script), directSetAttribute(containerEl2, "q:container", "paused"), data2;
    })(containerEl),
    state: getContainerState(containerEl)
  };
};
const tryGetContext = (element) => element._qc_;
const getContext = (element) => {
  let ctx = tryGetContext(element);
  return ctx || (element._qc_ = ctx = {
    $dirty$: false,
    $mounted$: false,
    $attachedListeners$: false,
    $id$: "",
    $element$: element,
    $refMap$: [],
    li: {},
    $watches$: null,
    $seq$: null,
    $slots$: null,
    $scopeIds$: null,
    $appendStyles$: null,
    $props$: null,
    $vdom$: null,
    $renderQrl$: null,
    $contexts$: null
  }), ctx;
};
const cleanupContext = (ctx, subsManager) => {
  var _a;
  const el = ctx.$element$;
  (_a = ctx.$watches$) == null ? void 0 : _a.forEach((watch) => {
    subsManager.$clearSub$(watch), destroyWatch(watch);
  }), ctx.$renderQrl$ && subsManager.$clearSub$(el), ctx.$renderQrl$ = null, ctx.$seq$ = null, ctx.$watches$ = null, ctx.$dirty$ = false, el._qc_ = void 0;
};
const PREFIXES = ["on", "window:on", "document:on"];
const SCOPED = ["on", "on-window", "on-document"];
const normalizeOnProp = (prop) => {
  let scope = "on";
  for (let i = 0; i < PREFIXES.length; i++) {
    const prefix = PREFIXES[i];
    if (prop.startsWith(prefix)) {
      scope = SCOPED[i], prop = prop.slice(prefix.length);
      break;
    }
  }
  return scope + ":" + (prop.startsWith("-") ? fromCamelToKebabCase(prop.slice(1)) : prop.toLowerCase());
};
const createProps = (target, containerState) => createProxy(target, containerState, 2);
const getPropsMutator = (ctx, containerState) => {
  let props = ctx.$props$;
  props || (ctx.$props$ = props = createProps({}, containerState));
  const target = getProxyTarget(props);
  const manager = containerState.$subsManager$.$getLocal$(target);
  return {
    set(prop, value) {
      let oldValue = target[prop];
      isMutable(oldValue) && (oldValue = oldValue.mut), containerState.$mutableProps$ ? isMutable(value) ? (value = value.mut, target[prop] = value) : target[prop] = mutable(value) : (target[prop] = value, isMutable(value) && (value = value.mut, true)), oldValue !== value && manager.$notifySubs$(prop);
    }
  };
};
const inflateQrl = (qrl, elCtx) => (qrl.$capture$, qrl.$captureRef$ = qrl.$capture$.map((idx) => {
  const int = parseInt(idx, 10);
  const obj = elCtx.$refMap$[int];
  return elCtx.$refMap$.length, obj;
}));
const logError = (message, ...optionalParams) => {
  const err = message instanceof Error ? message : new Error(message);
  return "function" == typeof globalThis._handleError && message instanceof Error ? globalThis._handleError(message, optionalParams) : console.error("%cQWIK ERROR", "", err.message, ...printParams(optionalParams), err.stack), err;
};
const logErrorAndStop = (message, ...optionalParams) => logError(message, ...optionalParams);
const logWarn = (message, ...optionalParams) => {
};
const printParams = (optionalParams) => optionalParams;
const QError_stringifyClassOrStyle = 0;
const QError_verifySerializable = 3;
const QError_setProperty = 6;
const QError_notFoundContext = 13;
const QError_useMethodOutsideContext = 14;
const QError_immutableProps = 17;
const QError_useInvokeContext = 20;
const QError_containerAlreadyPaused = 21;
const QError_invalidJsxNodeType = 25;
const QError_trackUseStore = 26;
const QError_missingObjectId = 27;
const qError = (code, ...parts) => {
  const text = codeToText(code);
  return logErrorAndStop(text, ...parts);
};
const codeToText = (code) => `Code(${code})`;
const isQrl$1 = (value) => "function" == typeof value && "function" == typeof value.getSymbol;
const createQRL = (chunk, symbol, symbolRef, symbolFn, capture, captureRef, refSymbol) => {
  let _containerEl;
  const setContainer = (el) => {
    _containerEl || (_containerEl = el);
  };
  const resolve = async (containerEl) => {
    if (containerEl && setContainer(containerEl), symbolRef) {
      return symbolRef;
    }
    if (symbolFn) {
      return symbolRef = symbolFn().then((module) => symbolRef = module[symbol]);
    }
    {
      if (!_containerEl) {
        throw new Error(`QRL '${chunk}#${symbol || "default"}' does not have an attached container`);
      }
      const symbol2 = getPlatform().importSymbol(_containerEl, chunk, symbol);
      return symbolRef = then(symbol2, (ref) => symbolRef = ref);
    }
  };
  const resolveLazy = (containerEl) => symbolRef || resolve(containerEl);
  const invokeFn = (currentCtx, beforeFn) => (...args) => {
    const fn = resolveLazy();
    return then(fn, (fn2) => {
      if (isFunction(fn2)) {
        if (beforeFn && false === beforeFn()) {
          return;
        }
        const context = {
          ...createInvokationContext(currentCtx),
          $qrl$: QRL
        };
        return emitUsedSymbol(symbol, context.$element$), invoke(context, fn2, ...args);
      }
      throw qError(10);
    });
  };
  const createInvokationContext = (invoke2) => null == invoke2 ? newInvokeContext() : isArray(invoke2) ? newInvokeContextFromTuple(invoke2) : invoke2;
  const invokeQRL = async function(...args) {
    const fn = invokeFn();
    return await fn(...args);
  };
  const resolvedSymbol = refSymbol != null ? refSymbol : symbol;
  const hash = getSymbolHash$1(resolvedSymbol);
  const QRL = invokeQRL;
  const methods = {
    getSymbol: () => resolvedSymbol,
    getHash: () => hash,
    resolve,
    $resolveLazy$: resolveLazy,
    $setContainer$: setContainer,
    $chunk$: chunk,
    $symbol$: symbol,
    $refSymbol$: refSymbol,
    $hash$: hash,
    getFn: invokeFn,
    $capture$: capture,
    $captureRef$: captureRef
  };
  return Object.assign(invokeQRL, methods);
};
const getSymbolHash$1 = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  return index2 > -1 ? symbolName.slice(index2 + 1) : symbolName;
};
const emitUsedSymbol = (symbol, element) => {
  isServer$1() || "object" != typeof document || document.dispatchEvent(new CustomEvent("qsymbol", {
    bubbles: false,
    detail: {
      symbol,
      element,
      timestamp: performance.now()
    }
  }));
};
let runtimeSymbolId = 0;
const inlinedQrl = (symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY$1) => createQRL("/inlinedQRL", symbolName, symbol, null, null, lexicalScopeCapture, null);
const stringifyQRL = (qrl, opts = {}) => {
  var _a;
  let symbol = qrl.$symbol$;
  let chunk = qrl.$chunk$;
  const refSymbol = (_a = qrl.$refSymbol$) != null ? _a : symbol;
  const platform = getPlatform();
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol);
    result && (chunk = result[1], qrl.$refSymbol$ || (symbol = result[0]));
  }
  chunk.startsWith("./") && (chunk = chunk.slice(2));
  const parts = [chunk];
  symbol && "default" !== symbol && parts.push("#", symbol);
  const capture = qrl.$capture$;
  const captureRef = qrl.$captureRef$;
  if (captureRef && captureRef.length) {
    if (opts.$getObjId$) {
      const capture2 = captureRef.map(opts.$getObjId$);
      parts.push(`[${capture2.join(" ")}]`);
    } else if (opts.$addRefMap$) {
      const capture2 = captureRef.map(opts.$addRefMap$);
      parts.push(`[${capture2.join(" ")}]`);
    }
  } else {
    capture && capture.length > 0 && parts.push(`[${capture.join(" ")}]`);
  }
  return parts.join("");
};
const serializeQRLs = (existingQRLs, elCtx) => {
  var value;
  (function(value2) {
    return value2 && "number" == typeof value2.nodeType;
  })(value = elCtx.$element$) && value.nodeType;
  const opts = {
    $element$: elCtx.$element$,
    $addRefMap$: (obj) => addToArray(elCtx.$refMap$, obj)
  };
  return existingQRLs.map((qrl) => stringifyQRL(qrl, opts)).join("\n");
};
const parseQRL = (qrl, containerEl) => {
  const endIdx = qrl.length;
  const hashIdx = indexOf(qrl, 0, "#");
  const captureIdx = indexOf(qrl, hashIdx, "[");
  const chunkEndIdx = Math.min(hashIdx, captureIdx);
  const chunk = qrl.substring(0, chunkEndIdx);
  const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
  const symbolEndIdx = captureIdx;
  const symbol = symbolStartIdx == symbolEndIdx ? "default" : qrl.substring(symbolStartIdx, symbolEndIdx);
  const captureStartIdx = captureIdx;
  const captureEndIdx = endIdx;
  const capture = captureStartIdx === captureEndIdx ? EMPTY_ARRAY$1 : qrl.substring(captureStartIdx + 1, captureEndIdx - 1).split(" ");
  "/runtimeQRL" === chunk && logError(codeToText(2), qrl);
  const iQrl = createQRL(chunk, symbol, null, null, capture, null, null);
  return containerEl && iQrl.$setContainer$(containerEl), iQrl;
};
const indexOf = (text, startIdx, char) => {
  const endIdx = text.length;
  const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
  return -1 == charIdx ? endIdx : charIdx;
};
const addToArray = (array, obj) => {
  const index2 = array.indexOf(obj);
  return -1 === index2 ? (array.push(obj), array.length - 1) : index2;
};
const $ = (expression) => ((symbol, lexicalScopeCapture = EMPTY_ARRAY$1) => createQRL("/runtimeQRL", "s" + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture, null))(expression);
const componentQrl = (onRenderQrl) => {
  function QwikComponent(props, key) {
    const hash = onRenderQrl.$hash$;
    return jsx(Virtual, {
      "q:renderFn": onRenderQrl,
      ...props
    }, hash + ":" + (key || ""));
  }
  return QwikComponent[SERIALIZABLE_STATE] = [onRenderQrl], QwikComponent;
};
const isQwikComponent = (component) => "function" == typeof component && void 0 !== component[SERIALIZABLE_STATE];
const Slot = (props) => {
  var _a;
  const name = (_a = props.name) != null ? _a : "";
  return jsx(Virtual, {
    "q:s": ""
  }, name);
};
const renderSSR = async (node, opts) => {
  var _a;
  const root = opts.containerTagName;
  const containerEl = createContext(1).$element$;
  const containerState = createContainerState(containerEl);
  const rctx = createRenderContext({
    nodeType: 9
  }, containerState);
  const headNodes = (_a = opts.beforeContent) != null ? _a : [];
  const ssrCtx = {
    rctx,
    $contexts$: [],
    projectedChildren: void 0,
    projectedContext: void 0,
    hostCtx: void 0,
    invocationContext: void 0,
    headNodes: "html" === root ? headNodes : []
  };
  const containerAttributes = {
    ...opts.containerAttributes,
    "q:container": "paused",
    "q:version": "0.9.0",
    "q:render": "ssr",
    "q:base": opts.base,
    children: "html" === root ? [node] : [headNodes, node]
  };
  containerState.$envData$ = {
    url: opts.url,
    ...opts.envData
  }, node = jsx(root, containerAttributes), containerState.$hostsRendering$ = /* @__PURE__ */ new Set(), containerState.$renderPromise$ = Promise.resolve().then(() => renderRoot(node, ssrCtx, opts.stream, containerState, opts)), await containerState.$renderPromise$;
};
const renderRoot = async (node, ssrCtx, stream, containerState, opts) => {
  const beforeClose = opts.beforeClose;
  return await renderNode(node, ssrCtx, stream, 0, beforeClose ? (stream2) => {
    const result = beforeClose(ssrCtx.$contexts$, containerState);
    return processData(result, ssrCtx, stream2, 0, void 0);
  } : void 0), ssrCtx.rctx.$static$;
};
const renderNodeVirtual = (node, elCtx, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  var _a;
  const props = node.props;
  const renderQrl = props["q:renderFn"];
  if (renderQrl) {
    return elCtx.$renderQrl$ = renderQrl, renderSSRComponent(ssrCtx, stream, elCtx, node, flags, beforeClose);
  }
  let virtualComment = "<!--qv" + renderVirtualAttributes(props);
  const isSlot = "q:s" in props;
  const key = null != node.key ? String(node.key) : null;
  if (isSlot && ((_a = ssrCtx.hostCtx) == null ? void 0 : _a.$id$, virtualComment += " q:sref=" + ssrCtx.hostCtx.$id$), null != key && (virtualComment += " q:key=" + key), virtualComment += "-->", stream.write(virtualComment), extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = walkChildren(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    var _a2;
    if (!isSlot && !beforeClose) {
      return void stream.write(CLOSE_VIRTUAL);
    }
    let promise2;
    if (isSlot) {
      const content = (_a2 = ssrCtx.projectedChildren) == null ? void 0 : _a2[key];
      content && (ssrCtx.projectedChildren[key] = void 0, promise2 = processData(content, ssrCtx.projectedContext, stream, flags));
    }
    return beforeClose && (promise2 = then(promise2, () => beforeClose(stream))), then(promise2, () => {
      stream.write(CLOSE_VIRTUAL);
    });
  });
};
const CLOSE_VIRTUAL = "<!--/qv-->";
const renderVirtualAttributes = (attributes) => {
  let text = "";
  for (const prop of Object.keys(attributes)) {
    if ("children" === prop) {
      continue;
    }
    const value = attributes[prop];
    null != value && (text += " " + ("" === value ? prop : prop + "=" + value));
  }
  return text;
};
const renderNodeElementSync = (tagName, attributes, stream) => {
  if (stream.write("<" + tagName + ((attributes2) => {
    let text = "";
    for (const prop of Object.keys(attributes2)) {
      if ("dangerouslySetInnerHTML" === prop) {
        continue;
      }
      const value = attributes2[prop];
      null != value && (text += " " + ("" === value ? prop : prop + '="' + value + '"'));
    }
    return text;
  })(attributes) + ">"), !!emptyElements[tagName]) {
    return;
  }
  const innerHTML = attributes.dangerouslySetInnerHTML;
  null != innerHTML && stream.write(innerHTML), stream.write(`</${tagName}>`);
};
const renderSSRComponent = (ssrCtx, stream, elCtx, node, flags, beforeClose) => (setComponentProps(ssrCtx.rctx, elCtx, node.props), then(executeComponent(ssrCtx.rctx, elCtx), (res) => {
  const hostElement = elCtx.$element$;
  const newCtx = res.rctx;
  const invocationContext = newInvokeContext(hostElement, void 0);
  invocationContext.$subscriber$ = hostElement, invocationContext.$renderCtx$ = newCtx;
  const projectedContext = {
    ...ssrCtx,
    rctx: newCtx
  };
  const newSSrContext = {
    ...ssrCtx,
    projectedChildren: splitProjectedChildren(node.props.children, ssrCtx),
    projectedContext,
    rctx: newCtx,
    invocationContext
  };
  const extraNodes = [];
  if (elCtx.$appendStyles$) {
    const array = 4 & flags ? ssrCtx.headNodes : extraNodes;
    for (const style of elCtx.$appendStyles$) {
      array.push(jsx("style", {
        "q:style": style.styleId,
        dangerouslySetInnerHTML: style.content
      }));
    }
  }
  const newID = getNextIndex(ssrCtx.rctx);
  const scopeId = elCtx.$scopeIds$ ? serializeSStyle(elCtx.$scopeIds$) : void 0;
  const processedNode = jsx(node.type, {
    "q:sstyle": scopeId,
    "q:id": newID,
    children: res.node
  }, node.key);
  return elCtx.$id$ = newID, ssrCtx.$contexts$.push(elCtx), newSSrContext.hostCtx = elCtx, renderNodeVirtual(processedNode, elCtx, extraNodes, newSSrContext, stream, flags, (stream2) => beforeClose ? then(renderQTemplates(newSSrContext, stream2), () => beforeClose(stream2)) : renderQTemplates(newSSrContext, stream2));
}));
const renderQTemplates = (ssrContext, stream) => {
  const projectedChildren = ssrContext.projectedChildren;
  if (projectedChildren) {
    const nodes = Object.keys(projectedChildren).map((slotName) => {
      const value = projectedChildren[slotName];
      if (value) {
        return jsx("q:template", {
          [QSlot]: slotName,
          hidden: "",
          "aria-hidden": "true",
          children: value
        });
      }
    });
    return processData(nodes, ssrContext, stream, 0, void 0);
  }
};
const splitProjectedChildren = (children, ssrCtx) => {
  var _a;
  const flatChildren = flatVirtualChildren(children, ssrCtx);
  if (null === flatChildren) {
    return;
  }
  const slotMap = {};
  for (const child of flatChildren) {
    let slotName = "";
    isJSXNode(child) && (slotName = (_a = child.props[QSlot]) != null ? _a : "");
    let array = slotMap[slotName];
    array || (slotMap[slotName] = array = []), array.push(child);
  }
  return slotMap;
};
const createContext = (nodeType) => getContext({
  nodeType,
  _qc_: null
});
const renderNode = (node, ssrCtx, stream, flags, beforeClose) => {
  var _a;
  const tagName = node.type;
  if ("string" == typeof tagName) {
    const key = node.key;
    const props = node.props;
    const elCtx = createContext(1);
    const isHead = "head" === tagName;
    const hostCtx = ssrCtx.hostCtx;
    let openingElement = "<" + tagName + ((elCtx2, attributes) => {
      let text = "";
      for (const prop of Object.keys(attributes)) {
        if ("children" === prop || "key" === prop || "class" === prop || "className" === prop || "dangerouslySetInnerHTML" === prop) {
          continue;
        }
        const value = attributes[prop];
        if ("ref" === prop) {
          value.current = elCtx2.$element$;
          continue;
        }
        if (isOnProp(prop)) {
          setEvent(elCtx2.li, prop, value);
          continue;
        }
        const attrName = processPropKey(prop);
        const attrValue = processPropValue(attrName, value);
        null != attrValue && (text += " " + ("" === value ? attrName : attrName + '="' + escapeAttr(attrValue) + '"'));
      }
      return text;
    })(elCtx, props);
    let classStr = stringifyClass((_a = props.class) != null ? _a : props.className);
    if (hostCtx && (hostCtx.$scopeIds$ && (classStr = hostCtx.$scopeIds$.join(" ") + " " + classStr), !hostCtx.$attachedListeners$)) {
      hostCtx.$attachedListeners$ = true;
      for (const eventName of Object.keys(hostCtx.li)) {
        addQRLListener(elCtx.li, eventName, hostCtx.li[eventName]);
      }
    }
    isHead && (flags |= 1), classStr = classStr.trim(), classStr && (openingElement += ' class="' + classStr + '"');
    const listeners = Object.keys(elCtx.li);
    for (const key2 of listeners) {
      openingElement += " " + key2 + '="' + serializeQRLs(elCtx.li[key2], elCtx) + '"';
    }
    if (null != key && (openingElement += ' q:key="' + key + '"'), "ref" in props || listeners.length > 0) {
      const newID = getNextIndex(ssrCtx.rctx);
      openingElement += ' q:id="' + newID + '"', elCtx.$id$ = newID, ssrCtx.$contexts$.push(elCtx);
    }
    if (1 & flags && (openingElement += " q:head"), openingElement += ">", stream.write(openingElement), emptyElements[tagName]) {
      return;
    }
    const innerHTML = props.dangerouslySetInnerHTML;
    if (null != innerHTML) {
      return stream.write(String(innerHTML)), void stream.write(`</${tagName}>`);
    }
    isHead || (flags &= -2), "html" === tagName ? flags |= 4 : flags &= -5;
    const promise = processData(props.children, ssrCtx, stream, flags);
    return then(promise, () => {
      if (isHead) {
        for (const node2 of ssrCtx.headNodes) {
          renderNodeElementSync(node2.type, node2.props, stream);
        }
        ssrCtx.headNodes.length = 0;
      }
      if (beforeClose) {
        return then(beforeClose(stream), () => {
          stream.write(`</${tagName}>`);
        });
      }
      stream.write(`</${tagName}>`);
    });
  }
  if (tagName === Virtual) {
    const elCtx = createContext(111);
    return renderNodeVirtual(node, elCtx, void 0, ssrCtx, stream, flags, beforeClose);
  }
  if (tagName === SSRComment) {
    return void stream.write("<!--" + node.props.data + "-->");
  }
  if (tagName === InternalSSRStream) {
    return (async (node2, ssrCtx2, stream2, flags2) => {
      stream2.write("<!--qkssr-f-->");
      const generator = node2.props.children;
      let value;
      if (isFunction(generator)) {
        const v = generator({
          write(chunk) {
            stream2.write(chunk), stream2.write("<!--qkssr-f-->");
          }
        });
        if (isPromise(v)) {
          return v;
        }
        value = v;
      } else {
        value = generator;
      }
      for await (const chunk of value) {
        await processData(chunk, ssrCtx2, stream2, flags2, void 0), stream2.write("<!--qkssr-f-->");
      }
    })(node, ssrCtx, stream, flags);
  }
  const res = invoke(ssrCtx.invocationContext, tagName, node.props, node.key);
  return processData(res, ssrCtx, stream, flags, beforeClose);
};
const processData = (node, ssrCtx, stream, flags, beforeClose) => {
  if (null != node && "boolean" != typeof node) {
    if (isString(node) || "number" == typeof node) {
      stream.write(escapeHtml(String(node)));
    } else {
      if (isJSXNode(node)) {
        return renderNode(node, ssrCtx, stream, flags, beforeClose);
      }
      if (isArray(node)) {
        return walkChildren(node, ssrCtx, stream, flags);
      }
      if (isPromise(node)) {
        return stream.write("<!--qkssr-f-->"), node.then((node2) => processData(node2, ssrCtx, stream, flags, beforeClose));
      }
    }
  }
};
function walkChildren(children, ssrContext, stream, flags) {
  if (null == children) {
    return;
  }
  if (!isArray(children)) {
    return processData(children, ssrContext, stream, flags);
  }
  if (1 === children.length) {
    return processData(children[0], ssrContext, stream, flags);
  }
  if (0 === children.length) {
    return;
  }
  let currentIndex = 0;
  const buffers = [];
  return children.reduce((prevPromise, child, index2) => {
    const buffer = [];
    buffers.push(buffer);
    const rendered = processData(child, ssrContext, prevPromise ? {
      write(chunk) {
        currentIndex === index2 ? stream.write(chunk) : buffer.push(chunk);
      }
    } : stream, flags);
    return isPromise(rendered) || prevPromise ? then(rendered, () => then(prevPromise, () => {
      currentIndex++, buffers.length > currentIndex && buffers[currentIndex].forEach((chunk) => stream.write(chunk));
    })) : void currentIndex++;
  }, void 0);
}
const flatVirtualChildren = (children, ssrCtx) => {
  if (null == children) {
    return null;
  }
  const result = _flatVirtualChildren(children, ssrCtx);
  const nodes = isArray(result) ? result : [result];
  return 0 === nodes.length ? null : nodes;
};
const stringifyClass = (str) => {
  if (!str) {
    return "";
  }
  if ("string" == typeof str) {
    return str;
  }
  if (Array.isArray(str)) {
    return str.join(" ");
  }
  const output = [];
  for (const key in str) {
    Object.prototype.hasOwnProperty.call(str, key) && str[key] && output.push(key);
  }
  return output.join(" ");
};
const _flatVirtualChildren = (children, ssrCtx) => {
  if (null == children) {
    return null;
  }
  if (isArray(children)) {
    return children.flatMap((c) => _flatVirtualChildren(c, ssrCtx));
  }
  if (isJSXNode(children) && isFunction(children.type) && children.type !== SSRComment && children.type !== InternalSSRStream && children.type !== Virtual) {
    const res = invoke(ssrCtx.invocationContext, children.type, children.props, children.key);
    return flatVirtualChildren(res, ssrCtx);
  }
  return children;
};
const setComponentProps = (rctx, ctx, expectProps) => {
  const keys = Object.keys(expectProps);
  if (0 === keys.length) {
    return;
  }
  const target = {};
  ctx.$props$ = createProps(target, rctx.$static$.$containerState$);
  for (const key of keys) {
    "children" !== key && "q:renderFn" !== key && (target[key] = expectProps[key]);
  }
};
function processPropKey(prop) {
  return "htmlFor" === prop ? "for" : prop;
}
function processPropValue(prop, value) {
  return "style" === prop ? stringifyStyle(value) : false === value || null == value ? null : true === value ? "" : String(value);
}
const emptyElements = {
  area: true,
  base: true,
  basefont: true,
  bgsound: true,
  br: true,
  col: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
const ESCAPE_HTML = /[&<>]/g;
const ESCAPE_ATTRIBUTES = /[&"]/g;
const escapeHtml = (s) => s.replace(ESCAPE_HTML, (c) => {
  switch (c) {
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    default:
      return "";
  }
});
const escapeAttr = (s) => s.replace(ESCAPE_ATTRIBUTES, (c) => {
  switch (c) {
    case "&":
      return "&amp;";
    case '"':
      return "&quot;";
    default:
      return "";
  }
});
const useStore = (initialState, opts) => {
  var _a;
  const { get, set, ctx } = useSequentialScope();
  if (null != get) {
    return get;
  }
  const value = isFunction(initialState) ? initialState() : initialState;
  if (false === (opts == null ? void 0 : opts.reactive)) {
    return set(value), value;
  }
  {
    const containerState = ctx.$renderCtx$.$static$.$containerState$;
    const newStore = createProxy(value, containerState, ((_a = opts == null ? void 0 : opts.recursive) != null ? _a : false) ? 1 : 0, void 0);
    return set(newStore), newStore;
  }
};
function useEnvData(key, defaultValue) {
  var _a;
  return (_a = useInvokeContext().$renderCtx$.$static$.$containerState$.$envData$[key]) != null ? _a : defaultValue;
}
const useStylesQrl = (styles2) => {
  _useStyles(styles2, (str) => str, false);
};
const _useStyles = (styleQrl, transform, scoped) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (get) {
    return get;
  }
  const renderCtx = ctx.$renderCtx$;
  const styleId = (index2 = i, `${((text, hash = 0) => {
    if (0 === text.length) {
      return hash;
    }
    for (let i2 = 0; i2 < text.length; i2++) {
      hash = (hash << 5) - hash + text.charCodeAt(i2), hash |= 0;
    }
    return Number(Math.abs(hash)).toString(36);
  })(styleQrl.$hash$)}-${index2}`);
  var index2;
  const containerState = renderCtx.$static$.$containerState$;
  const elCtx = getContext(ctx.$hostElement$);
  if (set(styleId), elCtx.$appendStyles$ || (elCtx.$appendStyles$ = []), elCtx.$scopeIds$ || (elCtx.$scopeIds$ = []), scoped && elCtx.$scopeIds$.push(((styleId2) => "\u2B50\uFE0F" + styleId2)(styleId)), ((containerState2, styleId2) => containerState2.$styleIds$.has(styleId2))(containerState, styleId)) {
    return styleId;
  }
  containerState.$styleIds$.add(styleId);
  const value = styleQrl.$resolveLazy$(containerState.$containerEl$);
  const appendStyle = (styleText) => {
    elCtx.$appendStyles$, elCtx.$appendStyles$.push({
      styleId,
      content: transform(styleText, styleId)
    });
  };
  return isPromise(value) ? ctx.$waitOn$.push(value.then(appendStyle)) : appendStyle(value), styleId;
};
/**
 * @license
 * @builder.io/qwik/server 0.9.0
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
if (typeof global == "undefined") {
  const g = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {};
  g.global = g;
}
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
function createTimer() {
  if (typeof performance === "undefined") {
    return () => 0;
  }
  const start = performance.now();
  return () => {
    const end = performance.now();
    const delta = end - start;
    return delta / 1e6;
  };
}
function getBuildBase(opts) {
  let base = opts.base;
  if (typeof base === "string") {
    if (!base.endsWith("/")) {
      base += "/";
    }
    return base;
  }
  return "/build/";
}
function createPlatform(opts, resolvedManifest) {
  const mapper = resolvedManifest == null ? void 0 : resolvedManifest.mapper;
  const mapperFn = opts.symbolMapper ? opts.symbolMapper : (symbolName) => {
    if (mapper) {
      const hash = getSymbolHash(symbolName);
      const result = mapper[hash];
      if (!result) {
        console.error("Cannot resolve symbol", symbolName, "in", mapper);
      }
      return result;
    }
  };
  const serverPlatform = {
    isServer: true,
    async importSymbol(_element, qrl, symbolName) {
      let [modulePath] = String(qrl).split("#");
      if (!modulePath.endsWith(".js")) {
        modulePath += ".js";
      }
      const module = __require(modulePath);
      if (!(symbolName in module)) {
        throw new Error(`Q-ERROR: missing symbol '${symbolName}' in module '${modulePath}'.`);
      }
      const symbol = module[symbolName];
      return symbol;
    },
    raf: () => {
      console.error("server can not rerender");
      return Promise.resolve();
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbolName) {
      return mapperFn(symbolName, mapper);
    }
  };
  return serverPlatform;
}
async function setServerPlatform(opts, manifest2) {
  const platform = createPlatform(opts, manifest2);
  setPlatform(platform);
}
var getSymbolHash = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
var QWIK_LOADER_DEFAULT_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=window,a=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>l(t,e,n,o)))},i=(e,t)=>new CustomEvent(e,{detail:t}),s=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,a,l,d)=>{var u;n.hasAttribute("preventdefault:"+l)&&d.preventDefault();const b="on"+a+":"+l,v=null==(u=n._qc_)?void 0:u.li[b];if(v){for(const e of v)await e.getFn([n,d],(()=>n.isConnected))(d,n);return}const p=n.getAttribute(b);if(p)for(const a of p.split("\\n")){const l=c(n,a);if(l){const a=f(l),c=(r[l.pathname]||(w=await import(l.href.split("#")[0]),Object.values(w).find(e)||w))[a]||s(l+" does not export "+a),u=t[o];if(n.isConnected)try{t[o]=[n,d,l],await c(d,n)}finally{t[o]=u,t.dispatchEvent(i("qsymbol",{symbol:a,element:n}))}}}var w},f=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",d=async e=>{let t=e.target;for(a("-document",e.type,e);t&&t.getAttribute;)await l(t,"",e.type,e),t=e.bubbles&&!0!==e.cancelBubble?t.parentElement:null},u=e=>{a("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)){n=1,a("","qinit",i("qinit"));const e=t.querySelectorAll("[on\\\\:qvisible]");if(e.length>0){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),l(n.target,"","qvisible",i("qvisible",n)))}));e.forEach((e=>t.observe(e)))}}},v=new Set,p=e=>{for(const t of e)v.has(t)||(document.addEventListener(t,d,{capture:!0}),r.addEventListener(t,u),v.add(t))};if(!t.qR){const e=r.qwikevents;Array.isArray(e)&&p(e),r.qwikevents={push:(...e)=>p(e)},t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const win = window;\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                for (const q of qrls) {\n                    await q.getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (win[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                await handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                doc.dispatchEvent(createEvent("qsymbol", {\n                                    symbol: symbolName,\n                                    element: element\n                                }));\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = async ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                await dispatch(element, "", ev.type, ev);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", createEvent("qinit"));\n                const results = doc.querySelectorAll("[on\\\\:qvisible]");\n                if (results.length > 0) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const events =  new Set;\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    document.addEventListener(eventName, processDocumentEvent, {\n                        capture: !0\n                    });\n                    win.addEventListener(eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=window,a=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>l(t,e,n,o)))},i=(e,t)=>new CustomEvent(e,{detail:t}),s=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,a,l,d)=>{var u;n.hasAttribute("preventdefault:"+l)&&d.preventDefault();const b="on"+a+":"+l,v=null==(u=n._qc_)?void 0:u.li[b];if(v){for(const e of v)await e.getFn([n,d],(()=>n.isConnected))(d,n);return}const p=n.getAttribute(b);if(p)for(const a of p.split("\\n")){const l=c(n,a);if(l){const a=f(l),c=(r[l.pathname]||(w=await import(l.href.split("#")[0]),Object.values(w).find(e)||w))[a]||s(l+" does not export "+a),u=t[o];if(n.isConnected)try{t[o]=[n,d,l],await c(d,n)}finally{t[o]=u,t.dispatchEvent(i("qsymbol",{symbol:a,element:n}))}}}var w},f=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",d=async e=>{let t=e.target;for(a("-document",e.type,e);t&&t.getAttribute;)await l(t,"",e.type,e),t=e.bubbles&&!0!==e.cancelBubble?t.parentElement:null},u=e=>{a("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)){n=1,a("","qinit",i("qinit"));const e=t.querySelectorAll("[on\\\\:qvisible]");if(e.length>0){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),l(n.target,"","qvisible",i("qvisible",n)))}));e.forEach((e=>t.observe(e)))}}},v=new Set,p=e=>{for(const t of e)v.has(t)||(document.addEventListener(t,d,{capture:!0}),r.addEventListener(t,u),v.add(t))};if(!t.qR){const e=r.qwikevents;Array.isArray(e)&&p(e),r.qwikevents={push:(...e)=>p(e)},t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const win = window;\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                for (const q of qrls) {\n                    await q.getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (win[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                await handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                doc.dispatchEvent(createEvent("qsymbol", {\n                                    symbol: symbolName,\n                                    element: element\n                                }));\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = async ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                await dispatch(element, "", ev.type, ev);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", createEvent("qinit"));\n                const results = doc.querySelectorAll("[on\\\\:qvisible]");\n                if (results.length > 0) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const events = new Set;\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    document.addEventListener(eventName, processDocumentEvent, {\n                        capture: !0\n                    });\n                    win.addEventListener(eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
}
function getPrefetchResources(snapshotResult, opts, resolvedManifest) {
  if (!resolvedManifest) {
    return [];
  }
  const prefetchStrategy = opts.prefetchStrategy;
  const buildBase = getBuildBase(opts);
  if (prefetchStrategy !== null) {
    if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
      return getAutoPrefetch(snapshotResult, resolvedManifest, buildBase);
    }
    if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
      try {
        return prefetchStrategy.symbolsToPrefetch({ manifest: resolvedManifest.manifest });
      } catch (e) {
        console.error("getPrefetchUrls, symbolsToPrefetch()", e);
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, resolvedManifest, buildBase) {
  const prefetchResources = [];
  const listeners = snapshotResult == null ? void 0 : snapshotResult.listeners;
  const stateObjs = snapshotResult == null ? void 0 : snapshotResult.objs;
  const { mapper, manifest: manifest2 } = resolvedManifest;
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(listeners)) {
    for (const prioritizedSymbolName in mapper) {
      const hasSymbol = listeners.some((l) => {
        return l.qrl.getHash() === prioritizedSymbolName;
      });
      if (hasSymbol) {
        addBundle(manifest2, urls, prefetchResources, buildBase, mapper[prioritizedSymbolName][1]);
      }
    }
  }
  if (Array.isArray(stateObjs)) {
    for (const obj of stateObjs) {
      if (isQrl(obj)) {
        const qrlSymbolName = obj.getHash();
        const resolvedSymbol = mapper[qrlSymbolName];
        if (resolvedSymbol) {
          addBundle(manifest2, urls, prefetchResources, buildBase, resolvedSymbol[0]);
        }
      }
    }
  }
  return prefetchResources;
}
function addBundle(manifest2, urls, prefetchResources, buildBase, bundleFileName) {
  const url = buildBase + bundleFileName;
  if (!urls.has(url)) {
    urls.add(url);
    const bundle = manifest2.bundles[bundleFileName];
    if (bundle) {
      const prefetchResource = {
        url,
        imports: []
      };
      prefetchResources.push(prefetchResource);
      if (Array.isArray(bundle.imports)) {
        for (const importedFilename of bundle.imports) {
          addBundle(manifest2, urls, prefetchResource.imports, buildBase, importedFilename);
        }
      }
    }
  }
}
var isQrl = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};
var qDev = globalThis.qDev === true;
var EMPTY_ARRAY = [];
var EMPTY_OBJ = {};
if (qDev) {
  Object.freeze(EMPTY_ARRAY);
  Object.freeze(EMPTY_OBJ);
  Error.stackTraceLimit = 9999;
}
[
  "click",
  "dblclick",
  "contextmenu",
  "auxclick",
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerover",
  "pointerenter",
  "pointerleave",
  "pointerout",
  "pointercancel",
  "gotpointercapture",
  "lostpointercapture",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "wheel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "search",
  "invalid",
  "beforeinput",
  "select",
  "focusin",
  "focusout",
  "focus",
  "blur",
  "submit",
  "reset",
  "scroll"
].map((n) => `on${n.toLowerCase()}$`);
[
  "useWatch$",
  "useClientEffect$",
  "useEffect$",
  "component$",
  "useStyles$",
  "useStylesScoped$"
].map((n) => n.toLowerCase());
function getValidManifest(manifest2) {
  if (manifest2 != null && manifest2.mapping != null && typeof manifest2.mapping === "object" && manifest2.symbols != null && typeof manifest2.symbols === "object" && manifest2.bundles != null && typeof manifest2.bundles === "object") {
    return manifest2;
  }
  return void 0;
}
function workerFetchScript() {
  const fetch2 = `Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})`;
  const workerBody = `onmessage=(e)=>{${fetch2}}`;
  const blob = `new Blob(['${workerBody}'],{type:"text/javascript"})`;
  const url = `URL.createObjectURL(${blob})`;
  let s = `const w=new Worker(${url});`;
  s += `w.postMessage(u.map(u=>new URL(u,origin)+''));`;
  s += `w.onmessage=()=>{w.terminate()};`;
  return s;
}
function prefetchUrlsEventScript(prefetchResources) {
  const data2 = {
    bundles: flattenPrefetchResources(prefetchResources).map((u) => u.split("/").pop())
  };
  return `dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(data2)}}))`;
}
function flattenPrefetchResources(prefetchResources) {
  const urls = [];
  const addPrefetchResource = (prefetchResources2) => {
    if (Array.isArray(prefetchResources2)) {
      for (const prefetchResource of prefetchResources2) {
        if (!urls.includes(prefetchResource.url)) {
          urls.push(prefetchResource.url);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(prefetchResources);
  return urls;
}
function applyPrefetchImplementation(opts, prefetchResources) {
  const { prefetchStrategy } = opts;
  if (prefetchStrategy !== null) {
    const prefetchImpl = normalizePrefetchImplementation(prefetchStrategy == null ? void 0 : prefetchStrategy.implementation);
    const prefetchNodes = [];
    if (prefetchImpl.prefetchEvent === "always") {
      prefetchUrlsEvent(prefetchNodes, prefetchResources);
    }
    if (prefetchImpl.linkInsert === "html-append") {
      linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    }
    if (prefetchImpl.linkInsert === "js-append") {
      linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    } else if (prefetchImpl.workerFetchInsert === "always") {
      workerFetchImplementation(prefetchNodes, prefetchResources);
    }
    if (prefetchNodes.length > 0) {
      return jsx(Fragment, { children: prefetchNodes });
    }
  }
  return null;
}
function prefetchUrlsEvent(prefetchNodes, prefetchResources) {
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: prefetchUrlsEventScript(prefetchResources)
    })
  );
}
function linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const urls = flattenPrefetchResources(prefetchResources);
  const rel = prefetchImpl.linkRel || "prefetch";
  for (const url of urls) {
    const attributes = {};
    attributes["href"] = url;
    attributes["rel"] = rel;
    if (rel === "prefetch" || rel === "preload") {
      if (url.endsWith(".js")) {
        attributes["as"] = "script";
      }
    }
    prefetchNodes.push(jsx("link", attributes, void 0));
  }
}
function linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const rel = prefetchImpl.linkRel || "prefetch";
  let s = ``;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `let supportsLinkRel = true;`;
  }
  s += `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += `u.map((u,i)=>{`;
  s += `const l=document.createElement('link');`;
  s += `l.setAttribute("href",u);`;
  s += `l.setAttribute("rel","${rel}");`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(i===0){`;
    s += `try{`;
    s += `supportsLinkRel=l.relList.supports("${rel}");`;
    s += `}catch(e){}`;
    s += `}`;
  }
  s += `document.body.appendChild(l);`;
  s += `});`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(!supportsLinkRel){`;
    s += workerFetchScript();
    s += `}`;
  }
  if (prefetchImpl.workerFetchInsert === "always") {
    s += workerFetchScript();
  }
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function workerFetchImplementation(prefetchNodes, prefetchResources) {
  let s = `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += workerFetchScript();
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function normalizePrefetchImplementation(input) {
  if (typeof input === "string") {
    switch (input) {
      case "link-prefetch-html": {
        return {
          linkInsert: "html-append",
          linkRel: "prefetch",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-prefetch": {
        return {
          linkInsert: "js-append",
          linkRel: "prefetch",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-preload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "preload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-preload": {
        return {
          linkInsert: "js-append",
          linkRel: "preload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-modulepreload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "modulepreload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-modulepreload": {
        return {
          linkInsert: "js-append",
          linkRel: "modulepreload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
    }
    return {
      linkInsert: null,
      linkRel: null,
      workerFetchInsert: "always",
      prefetchEvent: null
    };
  }
  if (input && typeof input === "object") {
    return input;
  }
  const defaultImplementation = {
    linkInsert: null,
    linkRel: null,
    workerFetchInsert: "always",
    prefetchEvent: null
  };
  return defaultImplementation;
}
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(rootNode, opts) {
  var _a, _b, _c, _d, _e, _f;
  let stream = opts.stream;
  let bufferSize = 0;
  let totalSize = 0;
  let networkFlushes = 0;
  let firstFlushTime = 0;
  const inOrderStreaming = (_b = (_a = opts.streaming) == null ? void 0 : _a.inOrder) != null ? _b : {
    strategy: "auto",
    maximunInitialChunk: 5e4,
    maximunChunk: 3e4
  };
  const containerTagName = (_c = opts.containerTagName) != null ? _c : "html";
  const containerAttributes = (_d = opts.containerAttributes) != null ? _d : {};
  let buffer = "";
  const nativeStream = stream;
  const firstFlushTimer = createTimer();
  function flush() {
    if (buffer) {
      nativeStream.write(buffer);
      buffer = "";
      bufferSize = 0;
      networkFlushes++;
      if (networkFlushes === 1) {
        firstFlushTime = firstFlushTimer();
      }
    }
  }
  function enqueue(chunk) {
    bufferSize += chunk.length;
    totalSize += chunk.length;
    buffer += chunk;
  }
  switch (inOrderStreaming.strategy) {
    case "disabled":
      stream = {
        write: enqueue
      };
      break;
    case "direct":
      stream = nativeStream;
      break;
    case "auto":
      let count = 0;
      let forceFlush = false;
      const minimunChunkSize = (_e = inOrderStreaming.maximunChunk) != null ? _e : 0;
      const initialChunkSize = (_f = inOrderStreaming.maximunInitialChunk) != null ? _f : 0;
      stream = {
        write(chunk) {
          if (chunk === "<!--qkssr-f-->") {
            forceFlush || (forceFlush = true);
          } else if (chunk === "<!--qkssr-pu-->") {
            count++;
          } else if (chunk === "<!--qkssr-po-->") {
            count--;
          } else {
            enqueue(chunk);
          }
          const chunkSize = networkFlushes === 0 ? initialChunkSize : minimunChunkSize;
          if (count === 0 && (forceFlush || bufferSize >= chunkSize)) {
            forceFlush = false;
            flush();
          }
        }
      };
      break;
  }
  if (containerTagName === "html") {
    stream.write(DOCTYPE);
  } else {
    if (opts.qwikLoader) {
      if (opts.qwikLoader.include === void 0) {
        opts.qwikLoader.include = "never";
      }
      if (opts.qwikLoader.position === void 0) {
        opts.qwikLoader.position = "bottom";
      }
    } else {
      opts.qwikLoader = {
        include: "never"
      };
    }
  }
  if (!opts.manifest) {
    console.warn("Missing client manifest, loading symbols in the client might 404");
  }
  const buildBase = getBuildBase(opts);
  const resolvedManifest = resolveManifest(opts.manifest);
  await setServerPlatform(opts, resolvedManifest);
  let prefetchResources = [];
  let snapshotResult = null;
  const injections = resolvedManifest == null ? void 0 : resolvedManifest.manifest.injections;
  const beforeContent = injections ? injections.map((injection) => {
    var _a2;
    return jsx(injection.tag, (_a2 = injection.attributes) != null ? _a2 : EMPTY_OBJ);
  }) : void 0;
  const renderTimer = createTimer();
  const renderSymbols = [];
  let renderTime = 0;
  let snapshotTime = 0;
  await renderSSR(rootNode, {
    stream,
    containerTagName,
    containerAttributes,
    envData: opts.envData,
    base: buildBase,
    beforeContent,
    beforeClose: async (contexts, containerState) => {
      var _a2, _b2, _c2;
      renderTime = renderTimer();
      const snapshotTimer = createTimer();
      snapshotResult = await _pauseFromContexts(contexts, containerState);
      prefetchResources = getPrefetchResources(snapshotResult, opts, resolvedManifest);
      const jsonData = JSON.stringify(snapshotResult.state, void 0, qDev ? "  " : void 0);
      const children = [
        jsx("script", {
          type: "qwik/json",
          dangerouslySetInnerHTML: escapeText(jsonData)
        })
      ];
      if (prefetchResources.length > 0) {
        children.push(applyPrefetchImplementation(opts, prefetchResources));
      }
      const needLoader = !snapshotResult || snapshotResult.mode !== "static";
      const includeMode = (_b2 = (_a2 = opts.qwikLoader) == null ? void 0 : _a2.include) != null ? _b2 : "auto";
      const includeLoader = includeMode === "always" || includeMode === "auto" && needLoader;
      if (includeLoader) {
        const qwikLoaderScript = getQwikLoaderScript({
          events: (_c2 = opts.qwikLoader) == null ? void 0 : _c2.events,
          debug: opts.debug
        });
        children.push(
          jsx("script", {
            id: "qwikloader",
            dangerouslySetInnerHTML: qwikLoaderScript
          })
        );
      }
      const uniqueListeners = /* @__PURE__ */ new Set();
      snapshotResult.listeners.forEach((li) => {
        uniqueListeners.add(JSON.stringify(li.eventName));
      });
      const extraListeners = Array.from(uniqueListeners);
      if (extraListeners.length > 0) {
        let content = `window.qwikevents.push(${extraListeners.join(", ")})`;
        if (!includeLoader) {
          content = `window.qwikevents||=[];${content}`;
        }
        children.push(
          jsx("script", {
            dangerouslySetInnerHTML: content
          })
        );
      }
      collectRenderSymbols(renderSymbols, contexts);
      snapshotTime = snapshotTimer();
      return jsx(Fragment, { children });
    }
  });
  flush();
  const result = {
    prefetchResources: void 0,
    snapshotResult,
    flushes: networkFlushes,
    manifest: resolvedManifest == null ? void 0 : resolvedManifest.manifest,
    size: totalSize,
    timing: {
      render: renderTime,
      snapshot: snapshotTime,
      firstFlush: firstFlushTime
    },
    _symbols: renderSymbols
  };
  return result;
}
function resolveManifest(manifest2) {
  if (!manifest2) {
    return void 0;
  }
  if ("mapper" in manifest2) {
    return manifest2;
  }
  manifest2 = getValidManifest(manifest2);
  if (manifest2) {
    const mapper = {};
    Object.entries(manifest2.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return {
      mapper,
      manifest: manifest2
    };
  }
  return void 0;
}
var escapeText = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
function collectRenderSymbols(renderSymbols, elements) {
  var _a;
  for (const ctx of elements) {
    const symbol = (_a = ctx.$renderQrl$) == null ? void 0 : _a.getSymbol();
    if (symbol && !renderSymbols.includes(symbol)) {
      renderSymbols.push(symbol);
    }
  }
}
const manifest = { "symbols": { "s_TlrTEIpSGyw": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_div_onClick", "canonicalFilename": "s_tlrteipsgyw", "hash": "TlrTEIpSGyw", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_hA9UPaY8sNQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onClick", "canonicalFilename": "s_ha9upay8snq", "hash": "hA9UPaY8sNQ", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_p8802htc8lU": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_div_div_div_button_onClick", "canonicalFilename": "s_p8802htc8lu", "hash": "p8802htc8lU", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_sI2nNmZV8Kk": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_div_button_onClick", "canonicalFilename": "s_si2nnmzv8kk", "hash": "sI2nNmZV8Kk", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_skxgNVWVOT8": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onMouseOver", "canonicalFilename": "s_skxgnvwvot8", "hash": "skxgNVWVOT8", "ctxKind": "event", "ctxName": "onMouseOver$", "captures": false, "parent": "s_mYsiJcA4IBc" }, "s_uVE5iM9H73c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onQVisible", "canonicalFilename": "s_uve5im9h73c", "hash": "uVE5iM9H73c", "ctxKind": "event", "ctxName": "onQVisible$", "captures": false, "parent": "s_mYsiJcA4IBc" }, "s_AaAlzKH0KlQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component_useWatch", "canonicalFilename": "s_aaalzkh0klq", "hash": "AaAlzKH0KlQ", "ctxKind": "function", "ctxName": "useWatch$", "captures": true, "parent": "s_z1nvHyEppoI" }, "s_06hTRPZlBNE": { "origin": "root.tsx", "displayName": "root_component", "canonicalFilename": "s_06htrpzlbne", "hash": "06hTRPZlBNE", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_0e3es3vnWuk": { "origin": "routes/index@index.tsx", "displayName": "index_index_component", "canonicalFilename": "s_0e3es3vnwuk", "hash": "0e3es3vnWuk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_26hfKJ9I4hk": { "origin": "routes/profile/[proid]/index@profile.tsx", "displayName": "index_profile_component", "canonicalFilename": "s_26hfkj9i4hk", "hash": "26hfKJ9I4hk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_BtnGjf3PdHw": { "origin": "components/sidebar/sidebar.tsx", "displayName": "Sidebar_component", "canonicalFilename": "s_btngjf3pdhw", "hash": "BtnGjf3PdHw", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_NcbFhH0Rq0M": { "origin": "routes/layout-index.tsx", "displayName": "layout_index_component", "canonicalFilename": "s_ncbfhh0rq0m", "hash": "NcbFhH0Rq0M", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_Xo5tmaGPZOs": { "origin": "routes/posts/[postid]/index.tsx", "displayName": "_postid__component", "canonicalFilename": "s_xo5tmagpzos", "hash": "Xo5tmaGPZOs", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_aeoMBoP047Y": { "origin": "routes/profile/[proid]/layout-profile.tsx", "displayName": "layout_profile_component", "canonicalFilename": "s_aeombop047y", "hash": "aeoMBoP047Y", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_gm3f0H6v3fA": { "origin": "components/header/header.tsx", "displayName": "Header_component", "canonicalFilename": "s_gm3f0h6v3fa", "hash": "gm3f0H6v3fA", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_iYmIWuy4aaw": { "origin": "routes/search/index.tsx", "displayName": "search_component", "canonicalFilename": "s_iymiwuy4aaw", "hash": "iYmIWuy4aaw", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_j5h3enAr0HE": { "origin": "routes/clips/index.tsx", "displayName": "clips_component", "canonicalFilename": "s_j5h3enar0he", "hash": "j5h3enAr0HE", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_mYsiJcA4IBc": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component", "canonicalFilename": "s_mysijca4ibc", "hash": "mYsiJcA4IBc", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_n0b0sGHmkUY": { "origin": "routes/favs/index.tsx", "displayName": "favs_component", "canonicalFilename": "s_n0b0sghmkuy", "hash": "n0b0sGHmkUY", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_nd8yk3KO22c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "RouterOutlet_component", "canonicalFilename": "s_nd8yk3ko22c", "hash": "nd8yk3KO22c", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_tD1BXnbDybA": { "origin": "routes/settings/index.tsx", "displayName": "settings_component", "canonicalFilename": "s_td1bxnbdyba", "hash": "tD1BXnbDybA", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_uaqIf5ac0DY": { "origin": "routes/vids/index.tsx", "displayName": "vids_component", "canonicalFilename": "s_uaqif5ac0dy", "hash": "uaqIf5ac0DY", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_uwWhp2E5O4I": { "origin": "components/menu/menu.tsx", "displayName": "Menu_component", "canonicalFilename": "s_uwwhp2e5o4i", "hash": "uwWhp2E5O4I", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_yM0L9NCDGUk": { "origin": "routes/layout.tsx", "displayName": "layout_component", "canonicalFilename": "s_ym0l9ncdguk", "hash": "yM0L9NCDGUk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_z1nvHyEppoI": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component", "canonicalFilename": "s_z1nvhyeppoi", "hash": "z1nvHyEppoI", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_zgN7XgNXC7Q": { "origin": "components/head/head.tsx", "displayName": "Head_component", "canonicalFilename": "s_zgn7xgnxc7q", "hash": "zgN7XgNXC7Q", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_WZUT0oi3I0A": { "origin": "root.tsx", "displayName": "root_component_useStyles", "canonicalFilename": "s_wzut0oi3i0a", "hash": "WZUT0oi3I0A", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_06hTRPZlBNE" } }, "mapping": { "s_TlrTEIpSGyw": "q-6ccd647d.js", "s_hA9UPaY8sNQ": "q-6e2cc303.js", "s_p8802htc8lU": "q-6ccd647d.js", "s_sI2nNmZV8Kk": "q-6ccd647d.js", "s_skxgNVWVOT8": "q-6e2cc303.js", "s_uVE5iM9H73c": "q-6e2cc303.js", "s_AaAlzKH0KlQ": "q-a146121d.js", "s_06hTRPZlBNE": "q-2b4e9944.js", "s_0e3es3vnWuk": "q-6ccd647d.js", "s_26hfKJ9I4hk": "q-2610f2ed.js", "s_BtnGjf3PdHw": "q-fda31d44.js", "s_NcbFhH0Rq0M": "q-6a2595c8.js", "s_Xo5tmaGPZOs": "q-c5e4ad44.js", "s_aeoMBoP047Y": "q-65f6ec94.js", "s_gm3f0H6v3fA": "q-8fe71345.js", "s_iYmIWuy4aaw": "q-00b1c0b2.js", "s_j5h3enAr0HE": "q-e5ea369c.js", "s_mYsiJcA4IBc": "q-6e2cc303.js", "s_n0b0sGHmkUY": "q-178a082b.js", "s_nd8yk3KO22c": "q-625a5d2e.js", "s_tD1BXnbDybA": "q-ac67ece6.js", "s_uaqIf5ac0DY": "q-8cb5daef.js", "s_uwWhp2E5O4I": "q-6070bf01.js", "s_yM0L9NCDGUk": "q-e7858416.js", "s_z1nvHyEppoI": "q-a146121d.js", "s_zgN7XgNXC7Q": "q-200dc796.js", "s_WZUT0oi3I0A": "q-2b4e9944.js" }, "bundles": { "q-00b1c0b2.js": { "size": 128, "imports": ["q-a4dd51f5.js"], "origins": ["src/entry_search.js", "src/s_iymiwuy4aaw.js"], "symbols": ["s_iYmIWuy4aaw"] }, "q-0b3949de.js": { "size": 58, "imports": ["q-a4dd51f5.js"] }, "q-0e6a5856.js": { "size": 158, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-c5e4ad44.js"], "origins": ["src/routes/posts/[postid]/index.js"] }, "q-178a082b.js": { "size": 128, "imports": ["q-a4dd51f5.js"], "origins": ["src/entry_favs.js", "src/s_n0b0sghmkuy.js"], "symbols": ["s_n0b0sGHmkUY"] }, "q-1a30d5a6.js": { "size": 185, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-178a082b.js"], "origins": ["src/routes/favs/index.js"] }, "q-200dc796.js": { "size": 893, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "origins": ["src/entry_Head.js", "src/s_zgn7xgnxc7q.js"], "symbols": ["s_zgN7XgNXC7Q"] }, "q-2021c3b9.js": { "size": 186, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-e5ea369c.js"], "origins": ["src/routes/clips/index.js"] }, "q-2610f2ed.js": { "size": 178, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "origins": ["src/entry_index_profile.js", "src/s_26hfkj9i4hk.js"], "symbols": ["s_26hfKJ9I4hk"] }, "q-2b4e9944.js": { "size": 32229, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-200dc796.js", "q-61deeacf.js", "q-625a5d2e.js", "q-6e2cc303.js", "q-a146121d.js"], "origins": ["node_modules/@builder.io/qwik-city/index.qwik.mjs", "src/components/head/head.js", "src/entry_root.js", "src/modern.css?used", "src/s_06htrpzlbne.js", "src/s_wzut0oi3i0a.js"], "symbols": ["s_06hTRPZlBNE", "s_WZUT0oi3I0A"] }, "q-2d2cbfbc.js": { "size": 158, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-6a2595c8.js"], "origins": ["src/routes/layout-index.js"] }, "q-3906475e.js": { "size": 326, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-6070bf01.js", "q-8fe71345.js", "q-fda31d44.js"], "origins": ["src/components/header/header.js", "src/components/menu/menu.js", "src/components/sidebar/sidebar.js"] }, "q-3972aeac.js": { "size": 185, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-6ccd647d.js"], "origins": ["src/routes/index@index.js"] }, "q-576b246e.js": { "size": 185, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-8cb5daef.js"], "origins": ["src/routes/vids/index.js"] }, "q-6070bf01.js": { "size": 2894, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "origins": ["src/entry_Menu.js", "src/s_uwwhp2e5o4i.js"], "symbols": ["s_uwWhp2E5O4I"] }, "q-61deeacf.js": { "size": 978, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-0e6a5856.js", "q-1a30d5a6.js", "q-2021c3b9.js", "q-2d2cbfbc.js", "q-3972aeac.js", "q-576b246e.js", "q-7a83e723.js", "q-7b714472.js", "q-d640bea0.js", "q-dc060538.js", "q-fbcc2226.js"], "origins": ["@qwik-city-plan"] }, "q-625a5d2e.js": { "size": 269, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "origins": ["src/entry_RouterOutlet.js", "src/s_nd8yk3ko22c.js"], "symbols": ["s_nd8yk3KO22c"] }, "q-65f6ec94.js": { "size": 1559, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "origins": ["src/entry_layout_profile.js", "src/s_aeombop047y.js"], "symbols": ["s_aeoMBoP047Y"] }, "q-6a2595c8.js": { "size": 294, "imports": ["q-3906475e.js", "q-a4dd51f5.js"], "origins": ["src/entry_layout_index.js", "src/s_ncbfhh0rq0m.js"], "symbols": ["s_NcbFhH0Rq0M"] }, "q-6ccd647d.js": { "size": 3552, "imports": ["q-a4dd51f5.js"], "origins": ["src/components/stories/stories.js", "src/entry_index_index.js", "src/s_0e3es3vnwuk.js", "src/s_p8802htc8lu.js", "src/s_si2nnmzv8kk.js", "src/s_tlrteipsgyw.js"], "symbols": ["s_0e3es3vnWuk", "s_p8802htc8lU", "s_sI2nNmZV8Kk", "s_TlrTEIpSGyw"] }, "q-6e2cc303.js": { "size": 891, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "origins": ["src/entry_Link.js", "src/s_ha9upay8snq.js", "src/s_mysijca4ibc.js", "src/s_skxgnvwvot8.js", "src/s_uve5im9h73c.js"], "symbols": ["s_hA9UPaY8sNQ", "s_mYsiJcA4IBc", "s_skxgNVWVOT8", "s_uVE5iM9H73c"] }, "q-7a83e723.js": { "size": 187, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-00b1c0b2.js"], "origins": ["src/routes/search/index.js"] }, "q-7b714472.js": { "size": 712, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-2610f2ed.js"], "origins": ["src/routes/profile/[proid]/index@profile.js"] }, "q-8cb5daef.js": { "size": 128, "imports": ["q-a4dd51f5.js"], "origins": ["src/entry_vids.js", "src/s_uaqif5ac0dy.js"], "symbols": ["s_uaqIf5ac0DY"] }, "q-8fe71345.js": { "size": 104, "imports": ["q-a4dd51f5.js"], "origins": ["src/entry_Header.js", "src/s_gm3f0h6v3fa.js"], "symbols": ["s_gm3f0H6v3fA"] }, "q-a146121d.js": { "size": 1489, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "dynamicImports": ["q-61deeacf.js"], "origins": ["@builder.io/qwik/build", "src/entry_QwikCity.js", "src/s_aaalzkh0klq.js", "src/s_z1nvhyeppoi.js"], "symbols": ["s_AaAlzKH0KlQ", "s_z1nvHyEppoI"] }, "q-a4dd51f5.js": { "size": 33755, "dynamicImports": ["q-2b4e9944.js"], "origins": ["\0vite/preload-helper", "node_modules/@builder.io/qwik/core.min.mjs", "src/root.js"] }, "q-ac67ece6.js": { "size": 128, "imports": ["q-a4dd51f5.js"], "origins": ["src/entry_settings.js", "src/s_td1bxnbdyba.js"], "symbols": ["s_tD1BXnbDybA"] }, "q-c5e4ad44.js": { "size": 1587, "imports": ["q-2b4e9944.js", "q-a4dd51f5.js"], "origins": ["src/entry__postid_.js", "src/s_xo5tmagpzos.js"], "symbols": ["s_Xo5tmaGPZOs"] }, "q-d640bea0.js": { "size": 189, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-ac67ece6.js"], "origins": ["src/routes/settings/index.js"] }, "q-dc060538.js": { "size": 158, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-e7858416.js"], "origins": ["src/routes/layout.js"] }, "q-e5ea369c.js": { "size": 128, "imports": ["q-a4dd51f5.js"], "origins": ["src/entry_clips.js", "src/s_j5h3enar0he.js"], "symbols": ["s_j5h3enAr0HE"] }, "q-e7858416.js": { "size": 282, "imports": ["q-3906475e.js", "q-a4dd51f5.js"], "origins": ["src/entry_layout.js", "src/s_ym0l9ncdguk.js"], "symbols": ["s_yM0L9NCDGUk"] }, "q-fbcc2226.js": { "size": 714, "imports": ["q-a4dd51f5.js"], "dynamicImports": ["q-65f6ec94.js"], "origins": ["src/routes/profile/[proid]/layout-profile.js"] }, "q-fda31d44.js": { "size": 3494, "imports": ["q-a4dd51f5.js"], "origins": ["src/entry_Sidebar.js", "src/s_btngjf3pdhw.js"], "symbols": ["s_BtnGjf3PdHw"] } }, "injections": [{ "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-6d120a0c.css" } }], "version": "1", "options": { "target": "client", "buildMode": "production", "forceFullBuild": true, "entryStrategy": { "type": "smart" } }, "platform": { "qwik": "0.9.0", "vite": "", "rollup": "2.78.1", "env": "node", "os": "linux", "node": "18.8.0" } };
const isServer = true;
const isBrowser = false;
const ContentContext = /* @__PURE__ */ createContext$1("qc-c");
const ContentInternalContext = /* @__PURE__ */ createContext$1("qc-ic");
const DocumentHeadContext = /* @__PURE__ */ createContext$1("qc-h");
const RouteLocationContext = /* @__PURE__ */ createContext$1("qc-l");
const RouteNavigateContext = /* @__PURE__ */ createContext$1("qc-n");
const RouterOutlet = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const { contents } = useContext(ContentInternalContext);
  if (contents && contents.length > 0) {
    const contentsLen = contents.length;
    let cmp = null;
    for (let i = contentsLen - 1; i >= 0; i--)
      cmp = jsx(contents[i].default, {
        children: cmp
      });
    return cmp;
  }
  return SkipRender;
}, "RouterOutlet_component_nd8yk3KO22c"));
const MODULE_CACHE = /* @__PURE__ */ new WeakMap();
const loadRoute = async (routes2, menus2, cacheModules2, pathname) => {
  if (Array.isArray(routes2))
    for (const route of routes2) {
      const match = route[0].exec(pathname);
      if (match) {
        const loaders = route[1];
        const params = getRouteParams(route[2], match);
        const routeBundleNames = route[4];
        const mods = new Array(loaders.length);
        const pendingLoads = [];
        const menuLoader = getMenuLoader(menus2, pathname);
        let menu = void 0;
        loaders.forEach((moduleLoader, i) => {
          loadModule(moduleLoader, pendingLoads, (routeModule) => mods[i] = routeModule, cacheModules2);
        });
        loadModule(menuLoader, pendingLoads, (menuModule) => menu = menuModule == null ? void 0 : menuModule.default, cacheModules2);
        if (pendingLoads.length > 0)
          await Promise.all(pendingLoads);
        return [
          params,
          mods,
          menu,
          routeBundleNames
        ];
      }
    }
  return null;
};
const loadModule = (moduleLoader, pendingLoads, moduleSetter, cacheModules2) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE.get(moduleLoader);
    if (loadedModule)
      moduleSetter(loadedModule);
    else {
      const l = moduleLoader();
      if (typeof l.then === "function")
        pendingLoads.push(l.then((loadedModule2) => {
          if (cacheModules2 !== false)
            MODULE_CACHE.set(moduleLoader, loadedModule2);
          moduleSetter(loadedModule2);
        }));
      else if (l)
        moduleSetter(l);
    }
  }
};
const getMenuLoader = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find((m) => m[0] === pathname || pathname.startsWith(m[0] + (pathname.endsWith("/") ? "" : "/")));
    if (menu)
      return menu[1];
  }
  return void 0;
};
const getRouteParams = (paramNames, match) => {
  const params = {};
  if (paramNames)
    for (let i = 0; i < paramNames.length; i++)
      params[paramNames[i]] = match ? match[i + 1] : "";
  return params;
};
const resolveHead = (endpoint, routeLocation, contentModules) => {
  const head2 = createDocumentHead();
  const headProps = {
    data: endpoint ? endpoint.body : null,
    head: head2,
    ...routeLocation
  };
  for (let i = contentModules.length - 1; i >= 0; i--) {
    const contentModuleHead = contentModules[i] && contentModules[i].head;
    if (contentModuleHead) {
      if (typeof contentModuleHead === "function")
        resolveDocumentHead(head2, contentModuleHead(headProps));
      else if (typeof contentModuleHead === "object")
        resolveDocumentHead(head2, contentModuleHead);
    }
  }
  return headProps.head;
};
const resolveDocumentHead = (resolvedHead, updatedHead) => {
  if (typeof updatedHead.title === "string")
    resolvedHead.title = updatedHead.title;
  mergeArray(resolvedHead.meta, updatedHead.meta);
  mergeArray(resolvedHead.links, updatedHead.links);
  mergeArray(resolvedHead.styles, updatedHead.styles);
};
const mergeArray = (existingArr, newArr) => {
  if (Array.isArray(newArr))
    for (const newItem of newArr) {
      if (typeof newItem.key === "string") {
        const existingIndex = existingArr.findIndex((i) => i.key === newItem.key);
        if (existingIndex > -1) {
          existingArr[existingIndex] = newItem;
          continue;
        }
      }
      existingArr.push(newItem);
    }
};
const createDocumentHead = () => ({
  title: "",
  meta: [],
  links: [],
  styles: []
});
const useDocumentHead = () => useContext(DocumentHeadContext);
const useLocation = () => useContext(RouteLocationContext);
const useNavigate = () => useContext(RouteNavigateContext);
const useQwikCityEnv = () => noSerialize(useEnvData("qwikcity"));
const toPath = (url) => url.pathname + url.search + url.hash;
const toUrl = (url, baseUrl) => new URL(url, baseUrl.href);
const isSameOrigin = (a, b) => a.origin === b.origin;
const isSamePath = (a, b) => a.pathname + a.search === b.pathname + b.search;
const isSamePathname = (a, b) => a.pathname === b.pathname;
const isSameOriginDifferentPathname = (a, b) => isSameOrigin(a, b) && !isSamePath(a, b);
const getClientEndpointPath = (pathname) => pathname + (pathname.endsWith("/") ? "" : "/") + "q-data.json";
const getClientNavPath = (props, baseUrl) => {
  const href = props.href;
  if (typeof href === "string" && href.trim() !== "" && typeof props.target !== "string")
    try {
      const linkUrl = toUrl(href, baseUrl);
      const currentUrl = toUrl("", baseUrl);
      if (isSameOrigin(linkUrl, currentUrl))
        return toPath(linkUrl);
    } catch (e) {
      console.error(e);
    }
  return null;
};
const getPrefetchUrl = (props, clientNavPath, currentLoc) => {
  if (props.prefetch && clientNavPath) {
    const prefetchUrl = toUrl(clientNavPath, currentLoc);
    if (!isSamePathname(prefetchUrl, toUrl("", currentLoc)))
      return prefetchUrl + "";
  }
  return null;
};
const clientNavigate = (win, routeNavigate) => {
  const currentUrl = win.location;
  const newUrl = toUrl(routeNavigate.path, currentUrl);
  if (isSameOriginDifferentPathname(currentUrl, newUrl)) {
    handleScroll(win, currentUrl, newUrl);
    win.history.pushState("", "", toPath(newUrl));
  }
  if (!win[CLIENT_HISTORY_INITIALIZED]) {
    win[CLIENT_HISTORY_INITIALIZED] = 1;
    win.addEventListener("popstate", () => {
      const currentUrl2 = win.location;
      const previousUrl = toUrl(routeNavigate.path, currentUrl2);
      if (isSameOriginDifferentPathname(currentUrl2, previousUrl)) {
        handleScroll(win, previousUrl, currentUrl2);
        routeNavigate.path = toPath(currentUrl2);
      }
    });
  }
};
const handleScroll = async (win, previousUrl, newUrl) => {
  const doc = win.document;
  const newHash = newUrl.hash;
  if (isSamePath(previousUrl, newUrl)) {
    if (previousUrl.hash !== newHash) {
      await domWait();
      if (newHash)
        scrollToHashId(doc, newHash);
      else
        win.scrollTo(0, 0);
    }
  } else {
    if (newHash)
      for (let i = 0; i < 24; i++) {
        await domWait();
        if (scrollToHashId(doc, newHash))
          break;
      }
    else {
      await domWait();
      win.scrollTo(0, 0);
    }
  }
};
const domWait = () => new Promise((resolve) => setTimeout(resolve, 12));
const scrollToHashId = (doc, hash) => {
  const elmId = hash.slice(1);
  const elm = doc.getElementById(elmId);
  if (elm)
    elm.scrollIntoView();
  return elm;
};
const dispatchPrefetchEvent = (prefetchData) => dispatchEvent(new CustomEvent("qprefetch", {
  detail: prefetchData
}));
const CLIENT_HISTORY_INITIALIZED = /* @__PURE__ */ Symbol();
const loadClientData = async (href) => {
  const { cacheModules: cacheModules2 } = await Promise.resolve().then(() => _qwikCityPlan);
  const pagePathname = new URL(href).pathname;
  const endpointUrl = getClientEndpointPath(pagePathname);
  const now = Date.now();
  const expiration = cacheModules2 ? 6e5 : 15e3;
  const cachedClientPageIndex = cachedClientPages.findIndex((c) => c.u === endpointUrl);
  let cachedClientPageData = cachedClientPages[cachedClientPageIndex];
  dispatchPrefetchEvent({
    links: [
      pagePathname
    ]
  });
  if (!cachedClientPageData || cachedClientPageData.t + expiration < now) {
    cachedClientPageData = {
      u: endpointUrl,
      t: now,
      c: new Promise((resolve) => {
        fetch(endpointUrl).then((clientResponse) => {
          const contentType = clientResponse.headers.get("content-type") || "";
          if (clientResponse.ok && contentType.includes("json"))
            clientResponse.json().then((clientData) => {
              dispatchPrefetchEvent({
                bundles: clientData.prefetch,
                links: [
                  pagePathname
                ]
              });
              resolve(clientData);
            }, () => resolve(null));
          else
            resolve(null);
        }, () => resolve(null));
      })
    };
    for (let i = cachedClientPages.length - 1; i >= 0; i--)
      if (cachedClientPages[i].t + expiration < now)
        cachedClientPages.splice(i, 1);
    cachedClientPages.push(cachedClientPageData);
  }
  cachedClientPageData.c.catch((e) => console.error(e));
  return cachedClientPageData.c;
};
const cachedClientPages = [];
const QwikCity = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const env = useQwikCityEnv();
  if (!(env == null ? void 0 : env.params))
    throw new Error(`Missing Qwik City Env Data`);
  const urlEnv = useEnvData("url");
  if (!urlEnv)
    throw new Error(`Missing Qwik URL Env Data`);
  const url = new URL(urlEnv);
  const routeLocation = useStore({
    href: url.href,
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    params: env.params
  });
  const routeNavigate = useStore({
    path: toPath(url)
  });
  const documentHead = useStore(createDocumentHead);
  const content = useStore({
    headings: void 0,
    menu: void 0
  });
  const contentInternal = useStore({
    contents: void 0
  });
  useContextProvider(ContentContext, content);
  useContextProvider(ContentInternalContext, contentInternal);
  useContextProvider(DocumentHeadContext, documentHead);
  useContextProvider(RouteLocationContext, routeLocation);
  useContextProvider(RouteNavigateContext, routeNavigate);
  useWatchQrl(inlinedQrl(async ({ track }) => {
    const [content2, contentInternal2, documentHead2, env2, routeLocation2, routeNavigate2] = useLexicalScope();
    const { routes: routes2, menus: menus2, cacheModules: cacheModules2 } = await Promise.resolve().then(() => _qwikCityPlan);
    const path = track(routeNavigate2, "path");
    const url2 = new URL(path, routeLocation2.href);
    const pathname = url2.pathname;
    const loadRoutePromise = loadRoute(routes2, menus2, cacheModules2, pathname);
    const endpointResponse = isServer ? env2.response : loadClientData(url2.href);
    const loadedRoute = await loadRoutePromise;
    if (loadedRoute) {
      const [params, mods, menu] = loadedRoute;
      const contentModules = mods;
      const pageModule = contentModules[contentModules.length - 1];
      routeLocation2.href = url2.href;
      routeLocation2.pathname = pathname;
      routeLocation2.params = {
        ...params
      };
      routeLocation2.query = Object.fromEntries(url2.searchParams.entries());
      content2.headings = pageModule.headings;
      content2.menu = menu;
      contentInternal2.contents = noSerialize(contentModules);
      const clientPageData = await endpointResponse;
      const resolvedHead = resolveHead(clientPageData, routeLocation2, contentModules);
      documentHead2.links = resolvedHead.links;
      documentHead2.meta = resolvedHead.meta;
      documentHead2.styles = resolvedHead.styles;
      documentHead2.title = resolvedHead.title;
      if (isBrowser)
        clientNavigate(window, routeNavigate2);
    }
  }, "QwikCity_component_useWatch_AaAlzKH0KlQ", [
    content,
    contentInternal,
    documentHead,
    env,
    routeLocation,
    routeNavigate
  ]));
  return /* @__PURE__ */ jsx(Slot, {});
}, "QwikCity_component_z1nvHyEppoI"));
const Link = /* @__PURE__ */ componentQrl(inlinedQrl((props) => {
  const nav = useNavigate();
  const loc = useLocation();
  const originalHref = props.href;
  const linkProps = {
    ...props
  };
  const clientNavPath = getClientNavPath(linkProps, loc);
  const prefetchUrl = getPrefetchUrl(props, clientNavPath, loc);
  linkProps["preventdefault:click"] = !!clientNavPath;
  linkProps.href = clientNavPath || originalHref;
  return /* @__PURE__ */ jsx("a", {
    ...linkProps,
    onClick$: inlinedQrl(() => {
      const [clientNavPath2, linkProps2, nav2] = useLexicalScope();
      if (clientNavPath2)
        nav2.path = linkProps2.href;
    }, "Link_component_a_onClick_hA9UPaY8sNQ", [
      clientNavPath,
      linkProps,
      nav
    ]),
    "data-prefetch": prefetchUrl,
    onMouseOver$: inlinedQrl((_, elm) => prefetchLinkResources(elm), "Link_component_a_onMouseOver_skxgNVWVOT8"),
    onQVisible$: inlinedQrl((_, elm) => prefetchLinkResources(elm, true), "Link_component_a_onQVisible_uVE5iM9H73c"),
    children: /* @__PURE__ */ jsx(Slot, {})
  });
}, "Link_component_mYsiJcA4IBc"));
const prefetchLinkResources = (elm, isOnVisible) => {
  var _a;
  const prefetchUrl = (_a = elm == null ? void 0 : elm.dataset) == null ? void 0 : _a.prefetch;
  if (prefetchUrl) {
    if (!windowInnerWidth)
      windowInnerWidth = window.innerWidth;
    if (!isOnVisible || isOnVisible && windowInnerWidth < 520)
      loadClientData(prefetchUrl);
  }
};
let windowInnerWidth = 0;
const Head = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const head2 = useDocumentHead();
  const loc = useLocation();
  return /* @__PURE__ */ jsx("head", {
    children: [
      /* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }),
      /* @__PURE__ */ jsx("title", {
        children: head2.title ? `${head2.title} - Evolt` : `Evolt`
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "canonical",
        href: loc.href
      }),
      /* @__PURE__ */ jsx("link", {
        href: "https://rsms.me/inter/inter.css",
        rel: "stylesheet"
      }),
      /* @__PURE__ */ jsx("script", {
        src: "https://code.iconify.design/2/2.2.1/iconify.min.js"
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: ""
      }),
      /* @__PURE__ */ jsx("link", {
        href: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
        rel: "stylesheet"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }),
      head2.meta.map((m) => /* @__PURE__ */ jsx("meta", {
        ...m
      })),
      head2.links.map((l) => /* @__PURE__ */ jsx("link", {
        ...l
      }))
    ]
  });
}, "s_zgN7XgNXC7Q"));
const styles = '/*\n! tailwindcss v3.1.8 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type=\'button\'],\n[type=\'reset\'],\n[type=\'submit\'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.static {\n  position: static;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.sticky {\n  position: sticky;\n}\n.right-0 {\n  right: 0px;\n}\n.right-10 {\n  right: 2.5rem;\n}\n.bottom-24 {\n  bottom: 6rem;\n}\n.top-\\[9px\\] {\n  top: 9px;\n}\n.m-4 {\n  margin: 1rem;\n}\n.m-1 {\n  margin: 0.25rem;\n}\n.m-3 {\n  margin: 0.75rem;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.my-1 {\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n}\n.mx-2 {\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n}\n.mx-5 {\n  margin-left: 1.25rem;\n  margin-right: 1.25rem;\n}\n.mx-4 {\n  margin-left: 1rem;\n  margin-right: 1rem;\n}\n.mx-0 {\n  margin-left: 0px;\n  margin-right: 0px;\n}\n.mx-1 {\n  margin-left: 0.25rem;\n  margin-right: 0.25rem;\n}\n.my-auto {\n  margin-top: auto;\n  margin-bottom: auto;\n}\n.my-4 {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n}\n.my-\\[17px\\] {\n  margin-top: 17px;\n  margin-bottom: 17px;\n}\n.my-5 {\n  margin-top: 1.25rem;\n  margin-bottom: 1.25rem;\n}\n.ml-auto {\n  margin-left: auto;\n}\n.mt-0 {\n  margin-top: 0px;\n}\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\n.mr-6 {\n  margin-right: 1.5rem;\n}\n.mr-1 {\n  margin-right: 0.25rem;\n}\n.mr-\\[6px\\] {\n  margin-right: 6px;\n}\n.mb-\\[8px\\] {\n  margin-bottom: 8px;\n}\n.mt-\\[1\\.5px\\] {\n  margin-top: 1.5px;\n}\n.mt-\\[1px\\] {\n  margin-top: 1px;\n}\n.mb-\\[4px\\] {\n  margin-bottom: 4px;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-6 {\n  margin-top: 1.5rem;\n}\n.ml-1 {\n  margin-left: 0.25rem;\n}\n.mb-1 {\n  margin-bottom: 0.25rem;\n}\n.mt-auto {\n  margin-top: auto;\n}\n.mr-auto {\n  margin-right: auto;\n}\n.mb-0 {\n  margin-bottom: 0px;\n}\n.mb-\\[13px\\] {\n  margin-bottom: 13px;\n}\n.mt-7 {\n  margin-top: 1.75rem;\n}\n.mt-3 {\n  margin-top: 0.75rem;\n}\n.inline-block {\n  display: inline-block;\n}\n.flex {\n  display: flex;\n}\n.hidden {\n  display: none;\n}\n.h-screen {\n  height: 100vh;\n}\n.h-\\[18px\\] {\n  height: 18px;\n}\n.h-32 {\n  height: 8rem;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-8 {\n  height: 2rem;\n}\n.h-full {\n  height: 100%;\n}\n.h-4 {\n  height: 1rem;\n}\n.h-\\[14px\\] {\n  height: 14px;\n}\n.h-10 {\n  height: 2.5rem;\n}\n.h-auto {\n  height: auto;\n}\n.h-20 {\n  height: 5rem;\n}\n.h-36 {\n  height: 9rem;\n}\n.h-44 {\n  height: 11rem;\n}\n.h-max {\n  height: -moz-max-content;\n  height: max-content;\n}\n.max-h-full {\n  max-height: 100%;\n}\n.w-screen {\n  width: 100vw;\n}\n.w-\\[18px\\] {\n  width: 18px;\n}\n.w-72 {\n  width: 18rem;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-44 {\n  width: 11rem;\n}\n.w-8 {\n  width: 2rem;\n}\n.w-full {\n  width: 100%;\n}\n.w-max {\n  width: -moz-max-content;\n  width: max-content;\n}\n.w-4 {\n  width: 1rem;\n}\n.w-\\[14px\\] {\n  width: 14px;\n}\n.w-10 {\n  width: 2.5rem;\n}\n.w-20 {\n  width: 5rem;\n}\n.w-28 {\n  width: 7rem;\n}\n.w-auto {\n  width: auto;\n}\n.max-w-\\[350px\\] {\n  max-width: 350px;\n}\n.flex-shrink-0 {\n  flex-shrink: 0;\n}\n.flex-grow {\n  flex-grow: 1;\n}\n.grow {\n  flex-grow: 1;\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.flex-row {\n  flex-direction: row;\n}\n.flex-row-reverse {\n  flex-direction: row-reverse;\n}\n.flex-col {\n  flex-direction: column;\n}\n.content-center {\n  align-content: center;\n}\n.items-center {\n  align-items: center;\n}\n.space-x-5 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(1.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-\\[10px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(10px * var(--tw-space-x-reverse));\n  margin-left: calc(10px * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1rem * var(--tw-space-x-reverse));\n  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-\\[18px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(18px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(18px * var(--tw-space-y-reverse));\n}\n.space-x-\\[8px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(8px * var(--tw-space-x-reverse));\n  margin-left: calc(8px * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-\\[1\\.5px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1.5px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1.5px * var(--tw-space-y-reverse));\n}\n.space-x-8 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(2rem * var(--tw-space-x-reverse));\n  margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-\\[22px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(22px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(22px * var(--tw-space-y-reverse));\n}\n.space-y-\\[0px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0px * var(--tw-space-y-reverse));\n}\n.space-x-\\[12px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(12px * var(--tw-space-x-reverse));\n  margin-left: calc(12px * calc(1 - var(--tw-space-x-reverse)));\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.overflow-x-auto {\n  overflow-x: auto;\n}\n.overflow-y-hidden {\n  overflow-y: hidden;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-sm {\n  border-radius: 0.125rem;\n}\n.rounded-\\[5px\\] {\n  border-radius: 5px;\n}\n.border {\n  border-width: 1px;\n}\n.border-t {\n  border-top-width: 1px;\n}\n.border-b {\n  border-bottom-width: 1px;\n}\n.border-none {\n  border-style: none;\n}\n.border-neutral-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(64 64 64 / var(--tw-border-opacity));\n}\n.border-neutral-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(82 82 82 / var(--tw-border-opacity));\n}\n.border-\\[rgba\\(0\\2c 0\\2c 0\\2c 0\\)\\] {\n  border-color: rgba(0,0,0,0);\n}\n.border-neutral-800 {\n  --tw-border-opacity: 1;\n  border-color: rgb(38 38 38 / var(--tw-border-opacity));\n}\n.border-t-neutral-900 {\n  --tw-border-opacity: 1;\n  border-top-color: rgb(23 23 23 / var(--tw-border-opacity));\n}\n.border-b-\\[\\#121212\\] {\n  --tw-border-opacity: 1;\n  border-bottom-color: rgb(18 18 18 / var(--tw-border-opacity));\n}\n.bg-\\[\\#0d0d0d\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(13 13 13 / var(--tw-bg-opacity));\n}\n.bg-blue-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 64 175 / var(--tw-bg-opacity));\n}\n.bg-transparent {\n  background-color: transparent;\n}\n.bg-black {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n}\n.bg-blue-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 58 138 / var(--tw-bg-opacity));\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-\\[\\#121212\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(18 18 18 / var(--tw-bg-opacity));\n}\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity));\n}\n.bg-opacity-10 {\n  --tw-bg-opacity: 0.1;\n}\n.bg-opacity-30 {\n  --tw-bg-opacity: 0.3;\n}\n.bg-opacity-\\[5\\%\\] {\n  --tw-bg-opacity: 5%;\n}\n.bg-opacity-\\[3\\%\\] {\n  --tw-bg-opacity: 3%;\n}\n.bg-opacity-\\[2\\%\\] {\n  --tw-bg-opacity: 2%;\n}\n.bg-cover {\n  background-size: cover;\n}\n.p-5 {\n  padding: 1.25rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-6 {\n  padding: 1.5rem;\n}\n.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\n.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n.py-\\[8px\\] {\n  padding-top: 8px;\n  padding-bottom: 8px;\n}\n.px-0 {\n  padding-left: 0px;\n  padding-right: 0px;\n}\n.py-\\[14px\\] {\n  padding-top: 14px;\n  padding-bottom: 14px;\n}\n.py-5 {\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n.px-\\[16px\\] {\n  padding-left: 16px;\n  padding-right: 16px;\n}\n.px-\\[10px\\] {\n  padding-left: 10px;\n  padding-right: 10px;\n}\n.py-\\[6px\\] {\n  padding-top: 6px;\n  padding-bottom: 6px;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-\\[10px\\] {\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n.px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.px-8 {\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n.py-0 {\n  padding-top: 0px;\n  padding-bottom: 0px;\n}\n.pr-\\[44px\\] {\n  padding-right: 44px;\n}\n.pb-\\[2px\\] {\n  padding-bottom: 2px;\n}\n.pt-\\[16px\\] {\n  padding-top: 16px;\n}\n.pt-1 {\n  padding-top: 0.25rem;\n}\n.pt-4 {\n  padding-top: 1rem;\n}\n.pl-1 {\n  padding-left: 0.25rem;\n}\n.pt-0 {\n  padding-top: 0px;\n}\n.pt-5 {\n  padding-top: 1.25rem;\n}\n.pt-\\[1px\\] {\n  padding-top: 1px;\n}\n.pt-\\[18\\.5px\\] {\n  padding-top: 18.5px;\n}\n.pl-\\[6px\\] {\n  padding-left: 6px;\n}\n.pl-\\[1px\\] {\n  padding-left: 1px;\n}\n.pt-\\[12px\\] {\n  padding-top: 12px;\n}\n.text-left {\n  text-align: left;\n}\n.text-center {\n  text-align: center;\n}\n.font-sans {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n.text-\\[12px\\] {\n  font-size: 12px;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.text-\\[13\\.5px\\] {\n  font-size: 13.5px;\n}\n.text-\\[9\\.5px\\] {\n  font-size: 9.5px;\n}\n.text-\\[14\\.5px\\] {\n  font-size: 14.5px;\n}\n.text-\\[13px\\] {\n  font-size: 13px;\n}\n.text-\\[10px\\] {\n  font-size: 10px;\n}\n.text-\\[12\\.75px\\] {\n  font-size: 12.75px;\n}\n.text-\\[15px\\] {\n  font-size: 15px;\n}\n.text-\\[11px\\] {\n  font-size: 11px;\n}\n.text-\\[20px\\] {\n  font-size: 20px;\n}\n.text-\\[14px\\] {\n  font-size: 14px;\n}\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-semibold {\n  font-weight: 600;\n}\n.font-bold {\n  font-weight: 700;\n}\n.leading-5 {\n  line-height: 1.25rem;\n}\n.leading-relaxed {\n  line-height: 1.625;\n}\n.text-neutral-400 {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-neutral-300 {\n  --tw-text-opacity: 1;\n  color: rgb(212 212 212 / var(--tw-text-opacity));\n}\n.text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgb(59 130 246 / var(--tw-text-opacity));\n}\n.text-neutral-500 {\n  --tw-text-opacity: 1;\n  color: rgb(115 115 115 / var(--tw-text-opacity));\n}\n.text-\\[\\#7b7b7b\\] {\n  --tw-text-opacity: 1;\n  color: rgb(123 123 123 / var(--tw-text-opacity));\n}\n.text-blue-400 {\n  --tw-text-opacity: 1;\n  color: rgb(96 165 250 / var(--tw-text-opacity));\n}\n.underline {\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\n.opacity-100 {\n  opacity: 1;\n}\n.opacity-90 {\n  opacity: 0.9;\n}\n.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n.font-jost {\n  font-family: "Jost";\n}\n\n@font-face {\n  font-family:"SF-Pro";\n  src: url("/fonts/SF-Pro.ttf") format("truetype");\n}\n\n\n.font-pacifico{\n  font-family: \'Pacifico\', cursive;\n\n}\n\n\n\n\n.selected-sidebar-text {\n  font-weight: 500;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\n.unselected-sidebar-text {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n\n.selected-sidebar-bg {\n  border-radius: 0.375rem;\n  --tw-bg-opacity: 1;\n  background-color: rgb(38 38 38 / var(--tw-bg-opacity));\n}\n\n@media (min-width: 1024px) {\n\n  .selected-sidebar-bg {\n    border-radius: 5px;\n  }\n}\n\n/*bg-white bg-opacity-[3.5%] rounded-md*/\n.unselected-sidebar-bg {\n  border-radius: 0px;\n  background-color: transparent;\n}\n\n.menucont {\n  position: fixed;\n  bottom: 0px;\n  display: flex;\n  width: 100vw;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.3;\n  padding: 0px;\n}\n\n@media (min-width: 768px) {\n\n  .menucont {\n    position: static;\n    width: -moz-max-content;\n    width: max-content;\n    flex-direction: column;\n  }\n}\n\n.sidebarwrapper {\n  margin-left: 0px;\n  margin-right: 0px;\n  display: none;\n  height: auto;\n  flex-direction: column;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.3;\n}\n\n@media (min-width: 768px) {\n\n  .sidebarwrapper {\n    display: flex;\n    padding-top: 12px;\n    padding-bottom: 12px;\n  }\n}\n  \n.colorpicker{\n  background-color: #242424;\n}\n.sidebardivs {\n  margin: 0.5rem;\n  margin-top: 0px;\n  margin-bottom: 0px;\n  margin-bottom: 0.5rem;\n  display: flex;\n  flex-direction: column;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  padding-top: 0px;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.sidebarprofile {\n  margin: 0.5rem;\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n  margin-bottom: 0px;\n  display: flex;\n  flex-direction: column;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0px;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n\n.quicktext {\n  display: none;\n}\n\n  .postcont {\n  border-bottom-width: 1px;\n  --tw-border-opacity: 1;\n  border-bottom-color: rgb(38 38 38 / var(--tw-border-opacity));\n  padding-left: 1rem;\n  padding-right: 1.5rem;\n}\n\n.quickcont {\n  margin-bottom: 0px;\n  margin-top: 16px;\n  display: flex;\n  flex-direction: row;\n  align-content: center;\n  align-items: center;\n  border-radius: 0.125rem;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n  .profiletext {\n  margin-top: 0.25rem;\n  padding-left: 0px;\n  font-size: 14px;\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(212 212 212 / var(--tw-text-opacity));\n  font-family: "Inter";\n}\n  \n  .logtext {\n  margin-top: auto;\n  margin-bottom: auto;\n  margin-right: 0px;\n  margin-left: auto;\n  font-size: 14px;\n  font-weight: 500;\n  --tw-text-opacity: 1;\n  color: rgb(248 113 113 / var(--tw-text-opacity));\n  font-family: "Inter";\n}\n\n.msgcont {\n  display: none;\n}\n\n.sidebarmessage {\n  margin: 0.5rem;\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n  display: flex;\n  flex-direction: column;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-bottom: 0.75rem;\n  padding-top: 0.25rem;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.bgcol {\n  display: flex;\n  height: 100vh;\n  width: 100vw;\n  flex-direction: column;\n  --tw-bg-opacity: 1;\n  background-color: rgb(23 23 23 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 100%;\n}\n\n.menumain {\n  display: flex;\n  height: auto;\n  width: 100%;\n  flex-direction: row;\n  justify-content: center;\n}\n\n.menumain > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0px * var(--tw-space-y-reverse));\n}\n\n.menumain {\n  border-radius: 0px;\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n  border-bottom-color: rgb(31 41 55 / var(--tw-border-opacity));\n  border-left-color: rgb(31 41 55 / var(--tw-border-opacity));\n  --tw-border-opacity: 1;\n  border-left-color: rgb(23 23 23 / var(--tw-border-opacity));\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n\n@media (min-width: 768px) {\n\n  .menumain {\n    height: 100vh;\n    width: -moz-max-content;\n    width: max-content;\n    flex-direction: column;\n    justify-content: flex-start;\n  }\n\n  .menumain > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n  }\n\n  .menumain {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n}\n\n@media (min-width: 1024px) {\n\n  .menumain {\n    width: 13rem;\n  }\n\n  .menumain > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n  }\n}\n\n.selected-sidebar-icon {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\n.unselected-sidebar-icon {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.tab-item-animate {\n  position: absolute;\n  top: 6px;\n  left: 6px;\n  width: calc(100% - 12px);\n  height: 32px;\n  transform-origin: 0 0;\n  transition: transform 0.25s;\n}\n\n.tabs .tabs-item:first-child.active ~ .tab-item-animate {\n  transform: translateX(0) scaleX(0.333);\n}\n\n.tabs .tabs-item:nth-child(2).active ~ .tab-item-animate {\n  transform: translateX(33.333%) scaleX(0.333);\n}\n.tabs .tabs-item:nth-child(3).active ~ .tab-item-animate {\n  transform: translateX(calc(33.333% * 2)) scaleX(0.333);\n}\n\n\n.tag-selected {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(0 0 0 / var(--tw-border-opacity));\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.9;\n  --tw-text-opacity: 1;\n  color: rgb(23 23 23 / var(--tw-text-opacity));\n}\n\n.tag-unselected {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(82 82 82 / var(--tw-border-opacity));\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.2;\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.font-sf{\n  font-family:"SF-Pro";\n}\n\n.font-inter {\n  font-family: "Inter";\n}\n.code {\n  font-family: "Source Code Pro", monospace;\n  display: block;\n  background-color: white;\n  color: #000000;\n  padding: 1em;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n}\n\n.sidenav {\n  height: 100%; /* 100% Full-height */\n  width: 0; /* 0 width - change this with JavaScript */\n  position: fixed; /* Stay in place */\n  z-index: 1; /* Stay on top */\n  top: 0; /* Stay at the top */\n  left: 0;\n  overflow-x: hidden; /* Disable horizontal scroll */\n  padding-top: 60px; /* Place content 60px from the top */\n  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */\n}\n\n/* The navigation menu links */\n.sidenav a {\n  display: block;\n}\n#midcont {\n  overflow-y: scroll;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n}\n#midcont::-webkit-scrollbar { /* WebKit */\n  width: 0;\n  height: 0;\n}\n.truncate{\ntext-overflow: ellipsis;\n\n/* Needed to make it work */\noverflow: hidden;\nwhite-space: nowrap;\n\n}\n\ndiv.fadeMe {\n  \n  background: rgba(0,0,0,0.7); \n  width:      100%;\n  height:     100%; \n  z-index:    10;\n  top:        0; \n  left:       0; \n  position:   fixed; \n}\n.bg-stickytitle{\n  background-color: #0d0d0d;\n}\n\n#publishtextarea{\n  -webkit-text-size-adjust: none;\n     -moz-text-size-adjust: none;\n          text-size-adjust: none;\n\n}\n\n#posttext{\n  -webkit-text-size-adjust: none;\n     -moz-text-size-adjust: none;\n          text-size-adjust: none;\n\n}\n\n.style13{\n  font-size: 14px;\n}\n\n #publishtextarea:focus {\n  outline: 0;\n}\n#popup{\n  z-index: 20;\n}\n\n#tags {\n  overflow-x: scroll;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n}\n#tags::-webkit-scrollbar { /* WebKit */\n  width: 0;\n  height: 0;\n}\n\n#myInputField {\n  border:1px solid #ddd;\n  padding: 10px;\n  font-size: 14px;\n}\n.coverdiv{\nbackground-image:\n    linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(0, 0, 0, 0.73)),\n}\n\n.tag {\n  padding-top: 2px;\n  padding-bottom: 2px;\n  --tw-text-opacity: 1;\n  color: rgb(59 130 246 / var(--tw-text-opacity));\n}\n\n[contenteditable=true]:empty:before{\n  content: attr(placeholder);\n  pointer-events: none;\n  color: #a3a3a3;\n  display: block; /* For Firefox */\n}\n\n\n\n.tag span[data-role="remove"] {\n  margin-left: 3px;\n  margin-right: 3px;\n  cursor: pointer;\n}\n\n.tag span[data-role="remove"]:after {\n  content: "x";\n  padding: 0px 2px;\n}\n\n\nselect {\n  margin: 0px;\n  margin-top: 0.5rem;\n  display: block;\n  width: 100%;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  border-radius: 0.25rem;\n  border-width: 1px;\n  border-style: solid;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n  background-clip: padding-box;\n  background-repeat: no-repeat;\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 150ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n\nselect:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(37 99 235 / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\ntable {\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 2.5rem;\n  margin-bottom: 2.5rem;\n  width: 66.666667%;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(229 229 229 / var(--tw-border-opacity));\n  font-family: "Inter";\n}\n\nth {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity));\n  padding: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  text-align: left;\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\ntd {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(229 229 229 / var(--tw-border-opacity));\n  padding: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n/* Position and style the close button (top right corner) */\n.sidenav .closebtn {\n  position: absolute;\n  top: 0;\n  right: 25px;\n  font-size: 28px;\n  margin-left: 50px;\n}\n@media screen and (max-height: 450px) {\n  .sidenav {\n    padding-top: 15px;\n  }\n  .sidenav a {\n    font-size: 18px;\n  }\n}\n.placeholder\\:text-sm::-moz-placeholder {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.placeholder\\:text-sm::placeholder {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.placeholder\\:text-xs::-moz-placeholder {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.placeholder\\:text-xs::placeholder {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.placeholder\\:text-neutral-400::-moz-placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.placeholder\\:text-neutral-400::placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.placeholder\\:text-neutral-500::-moz-placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(115 115 115 / var(--tw-text-opacity));\n}\n.placeholder\\:text-neutral-500::placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(115 115 115 / var(--tw-text-opacity));\n}\n@media (min-width: 640px) {\n\n  .sm\\:mt-\\[10px\\] {\n    margin-top: 10px;\n  }\n\n  .sm\\:w-3\\/4 {\n    width: 75%;\n  }\n\n  .sm\\:px-2 {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n  }\n\n  .sm\\:py-4 {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n}\n@media (min-width: 768px) {\n\n  .md\\:absolute {\n    position: absolute;\n  }\n\n  .md\\:left-0 {\n    left: 0px;\n  }\n\n  .md\\:right-0 {\n    right: 0px;\n  }\n\n  .md\\:top-\\[11px\\] {\n    top: 11px;\n  }\n\n  .md\\:m-0 {\n    margin: 0px;\n  }\n\n  .md\\:m-5 {\n    margin: 1.25rem;\n  }\n\n  .md\\:mx-auto {\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  .md\\:mx-5 {\n    margin-left: 1.25rem;\n    margin-right: 1.25rem;\n  }\n\n  .md\\:mx-2 {\n    margin-left: 0.5rem;\n    margin-right: 0.5rem;\n  }\n\n  .md\\:mx-0 {\n    margin-left: 0px;\n    margin-right: 0px;\n  }\n\n  .md\\:mr-0 {\n    margin-right: 0px;\n  }\n\n  .md\\:ml-0 {\n    margin-left: 0px;\n  }\n\n  .md\\:ml-auto {\n    margin-left: auto;\n  }\n\n  .md\\:mr-2 {\n    margin-right: 0.5rem;\n  }\n\n  .md\\:mt-auto {\n    margin-top: auto;\n  }\n\n  .md\\:mb-\\[10px\\] {\n    margin-bottom: 10px;\n  }\n\n  .md\\:mt-\\[1px\\] {\n    margin-top: 1px;\n  }\n\n  .md\\:mt-\\[0px\\] {\n    margin-top: 0px;\n  }\n\n  .md\\:mb-3 {\n    margin-bottom: 0.75rem;\n  }\n\n  .md\\:inline-flex {\n    display: inline-flex;\n  }\n\n  .md\\:hidden {\n    display: none;\n  }\n\n  .md\\:h-4 {\n    height: 1rem;\n  }\n\n  .md\\:w-96 {\n    width: 24rem;\n  }\n\n  .md\\:w-4 {\n    width: 1rem;\n  }\n\n  .md\\:w-\\[450px\\] {\n    width: 450px;\n  }\n\n  .md\\:w-\\[100\\%\\] {\n    width: 100%;\n  }\n\n  .md\\:flex-row {\n    flex-direction: row;\n  }\n\n  .md\\:space-y-4 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n  }\n\n  .md\\:rounded-md {\n    border-radius: 0.375rem;\n  }\n\n  .md\\:rounded-xl {\n    border-radius: 0.75rem;\n  }\n\n  .md\\:bg-opacity-0 {\n    --tw-bg-opacity: 0;\n  }\n\n  .md\\:py-4 {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n\n  .md\\:px-7 {\n    padding-left: 1.75rem;\n    padding-right: 1.75rem;\n  }\n\n  .md\\:px-5 {\n    padding-left: 1.25rem;\n    padding-right: 1.25rem;\n  }\n\n  .md\\:px-2 {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n  }\n\n  .md\\:py-10 {\n    padding-top: 2.5rem;\n    padding-bottom: 2.5rem;\n  }\n\n  .md\\:pr-0 {\n    padding-right: 0px;\n  }\n\n  .md\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .md\\:text-\\[10\\.5px\\] {\n    font-size: 10.5px;\n  }\n\n  .md\\:text-\\[15\\.9px\\] {\n    font-size: 15.9px;\n  }\n\n  .md\\:text-\\[13\\.5px\\] {\n    font-size: 13.5px;\n  }\n\n  .md\\:text-\\[12px\\] {\n    font-size: 12px;\n  }\n\n  .md\\:text-\\[20\\.75px\\] {\n    font-size: 20.75px;\n  }\n\n  .md\\:text-\\[14\\.5px\\] {\n    font-size: 14.5px;\n  }\n\n  .md\\:leading-normal {\n    line-height: 1.5;\n  }\n\n  .md\\:opacity-90 {\n    opacity: 0.9;\n  }\n\n  .placeholder\\:md\\:text-sm::-moz-placeholder {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .placeholder\\:md\\:text-sm::placeholder {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n@media (min-width: 1024px) {\n\n  .lg\\:mx-0 {\n    margin-left: 0px;\n    margin-right: 0px;\n  }\n\n  .lg\\:ml-auto {\n    margin-left: auto;\n  }\n\n  .lg\\:mr-2 {\n    margin-right: 0.5rem;\n  }\n\n  .lg\\:mt-3 {\n    margin-top: 0.75rem;\n  }\n\n  .lg\\:mb-5 {\n    margin-bottom: 1.25rem;\n  }\n\n  .lg\\:mb-\\[10px\\] {\n    margin-bottom: 10px;\n  }\n\n  .lg\\:block {\n    display: block;\n  }\n\n  .lg\\:inline-block {\n    display: inline-block;\n  }\n\n  .lg\\:inline-flex {\n    display: inline-flex;\n  }\n\n  .lg\\:h-4 {\n    height: 1rem;\n  }\n\n  .lg\\:h-\\[203px\\] {\n    height: 203px;\n  }\n\n  .lg\\:w-4 {\n    width: 1rem;\n  }\n\n  .lg\\:max-w-\\[430px\\] {\n    max-width: 430px;\n  }\n\n  .lg\\:rounded-xl {\n    border-radius: 0.75rem;\n  }\n\n  .lg\\:px-6 {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n\n  .lg\\:py-\\[8px\\] {\n    padding-top: 8px;\n    padding-bottom: 8px;\n  }\n\n  .lg\\:py-4 {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n\n  .lg\\:text-\\[16\\.5px\\] {\n    font-size: 16.5px;\n  }\n\n  .lg\\:text-\\[15px\\] {\n    font-size: 15px;\n  }\n\n  .lg\\:text-\\[20\\.75px\\] {\n    font-size: 20.75px;\n  }\n\n  .lg\\:text-\\[14\\.5px\\] {\n    font-size: 14.5px;\n  }\n\n  .lg\\:leading-relaxed {\n    line-height: 1.625;\n  }\n\n  .lg\\:shadow-lg {\n    --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n    --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  }\n}\n@media (min-width: 1280px) {\n\n  .xl\\:absolute {\n    position: absolute;\n  }\n\n  .xl\\:relative {\n    position: relative;\n  }\n\n  .xl\\:left-10 {\n    left: 2.5rem;\n  }\n\n  .xl\\:top-\\[120px\\] {\n    top: 120px;\n  }\n\n  .xl\\:right-0 {\n    right: 0px;\n  }\n\n  .xl\\:top-\\[20px\\] {\n    top: 20px;\n  }\n\n  .xl\\:left-\\[125px\\] {\n    left: 125px;\n  }\n\n  .xl\\:right-\\[90px\\] {\n    right: 90px;\n  }\n\n  .xl\\:top-\\[25px\\] {\n    top: 25px;\n  }\n\n  .xl\\:mx-0 {\n    margin-left: 0px;\n    margin-right: 0px;\n  }\n\n  .xl\\:my-0 {\n    margin-top: 0px;\n    margin-bottom: 0px;\n  }\n\n  .xl\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  .xl\\:mt-\\[0px\\] {\n    margin-top: 0px;\n  }\n\n  .xl\\:block {\n    display: block;\n  }\n\n  .xl\\:h-\\[100px\\] {\n    height: 100px;\n  }\n\n  .xl\\:w-\\[100px\\] {\n    width: 100px;\n  }\n\n  .xl\\:w-full {\n    width: 100%;\n  }\n\n  .xl\\:rounded-md {\n    border-radius: 0.375rem;\n  }\n\n  .xl\\:px-0 {\n    padding-left: 0px;\n    padding-right: 0px;\n  }\n\n  .xl\\:text-left {\n    text-align: left;\n  }\n\n  .xl\\:text-lg {\n    font-size: 1.125rem;\n    line-height: 1.75rem;\n  }\n\n  .xl\\:text-\\[12\\.5px\\] {\n    font-size: 12.5px;\n  }\n\n  .xl\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n';
const Root = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles, "s_WZUT0oi3I0A"));
  return /* @__PURE__ */ jsx(QwikCity, {
    children: [
      /* @__PURE__ */ jsx(Head, {}),
      /* @__PURE__ */ jsx("body", {
        lang: "en",
        class: "relative w-screen h-screen",
        children: /* @__PURE__ */ jsx(RouterOutlet, {})
      })
    ]
  });
}, "s_06hTRPZlBNE"));
function entry_ssr(opts) {
  return renderToStream(/* @__PURE__ */ jsx(Root, {}), {
    manifest,
    ...opts
  });
}
const Header = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "w-screen"
  });
}, "s_gm3f0H6v3fA"));
const Menu = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const loc = useLocation();
  return /* @__PURE__ */ jsx("div", {
    class: "menucont",
    children: /* @__PURE__ */ jsx("div", {
      class: "menumain ",
      children: [
        /* @__PURE__ */ jsx(Link, {
          id: "central",
          href: "/",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2 md:mx-2 mx-1 py-3 lg:py-[8px] ${loc.pathname === "/" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
          children: [
            /* @__PURE__ */ jsx("span", {
              class: "iconify lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto",
              "data-icon": "tabler:home"
            }),
            /* @__PURE__ */ jsx("span", {
              class: "hidden lg:inline-flex font-inter text-[13.5px] my-auto ",
              children: "Home"
            })
          ]
        }),
        /* @__PURE__ */ jsx(Link, {
          id: "search",
          href: "/search",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-1 md:mx-2  py-3 lg:py-[8px] ${loc.pathname === "/search" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
          children: [
            /* @__PURE__ */ jsx("span", {
              class: "iconify lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto",
              "data-icon": "tabler:search"
            }),
            /* @__PURE__ */ jsx("span", {
              class: "hidden lg:inline-flex font-inter text-[13.5px] my-auto ",
              children: "Search"
            })
          ]
        }),
        /* @__PURE__ */ jsx(Link, {
          id: "clips",
          href: "/clips",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-1 md:mx-2  py-3 lg:py-[8px] ${loc.pathname === "/clips" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
          children: [
            /* @__PURE__ */ jsx("span", {
              class: "iconify lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto",
              "data-icon": "tabler:video"
            }),
            /* @__PURE__ */ jsx("span", {
              class: "hidden lg:inline-flex font-inter text-[13.5px] my-auto ",
              children: "Clips"
            })
          ]
        }),
        /* @__PURE__ */ jsx(Link, {
          id: "favourites",
          href: "/favs",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2  mx-1 md:mx-2  py-3 lg:py-[8px] ${loc.pathname === "/favs" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
          children: [
            /* @__PURE__ */ jsx("span", {
              class: "iconify lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto",
              "data-icon": "ant-design:heart"
            }),
            /* @__PURE__ */ jsx("span", {
              class: "hidden lg:inline-flex font-inter text-[13.5px] my-auto ",
              children: "Favourites"
            })
          ]
        }),
        /* @__PURE__ */ jsx(Link, {
          id: "settings",
          href: "/settings",
          class: mutable(`flex  md:mt-auto ml-auto flex-row-reverse items-center content-center space-x-3 px-2  mx-1 mr-[6px] md:mx-2  py-3 lg:py-[8px] ${loc.pathname === "/settings" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
          children: [
            /* @__PURE__ */ jsx("span", {
              class: "iconify lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto",
              "data-icon": "ant-design:setting"
            }),
            /* @__PURE__ */ jsx("span", {
              class: "hidden lg:inline-flex font-inter text-[13.5px] my-auto ",
              children: "Settings"
            })
          ]
        })
      ]
    })
  });
}, "s_uwWhp2E5O4I"));
const Sidebar = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "sidebarwrapper",
    children: [
      /* @__PURE__ */ jsx("div", {
        class: " sidebarprofile",
        children: /* @__PURE__ */ jsx("div", {
          class: "py-[10px] pt-0 flex flex-col items-center content-center ",
          children: [
            /* @__PURE__ */ jsx("div", {
              class: "flex flex-row w-full items-center content-center",
              children: [
                /* @__PURE__ */ jsx("span", {
                  class: "profiletext",
                  children: "Profile"
                }),
                /* @__PURE__ */ jsx("div", {
                  class: "logtext",
                  children: "Logout"
                })
              ]
            }),
            /* @__PURE__ */ jsx("div", {
              class: "flex flex-col mt-6",
              children: [
                /* @__PURE__ */ jsx("img", {
                  class: "w-20 h-20 rounded-full mx-auto",
                  src: "https://picsum.photos/200/300"
                }),
                /* @__PURE__ */ jsx("div", {
                  class: "font-inter font-semibold pt-5 text-md mx-auto text-neutral-300 my-auto",
                  children: "Admin Acct"
                }),
                /* @__PURE__ */ jsx("div", {
                  class: "font-inter font-medium pt-[1px] text-[12.75px] mx-auto text-neutral-500 my-auto",
                  children: "@admin"
                }),
                /* @__PURE__ */ jsx("div", {
                  class: "font-inter font-medium pt-[18.5px] text-sm mx-auto text-neutral-400 my-auto",
                  children: "I am the admin of this app"
                })
              ]
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx("div", {
        class: "sidebardivs",
        children: [
          /* @__PURE__ */ jsx("span", {
            class: "quicktext",
            children: "Quick Actions"
          }),
          /* @__PURE__ */ jsx("div", {
            class: "quickcont",
            children: /* @__PURE__ */ jsx("div", {
              class: "flex flex-row space-x-4 mx-auto items-center content-center",
              children: [
                /* @__PURE__ */ jsx("button", {
                  class: "py-2 px-5 bg-white bg-opacity-[2%] rounded-md",
                  children: /* @__PURE__ */ jsx("span", {
                    class: "iconify text-neutral-300 w-4 h-4",
                    "data-icon": "ep:message"
                  })
                }),
                /* @__PURE__ */ jsx("button", {
                  class: "py-2 px-5 hidden lg:block bg-white bg-opacity-[2%] rounded-md",
                  children: /* @__PURE__ */ jsx("span", {
                    class: "iconify text-neutral-300 w-4 h-4",
                    "data-icon": "ep:edit"
                  })
                }),
                /* @__PURE__ */ jsx("button", {
                  class: "py-2 px-5 bg-white bg-opacity-[2%] rounded-md",
                  children: /* @__PURE__ */ jsx("span", {
                    class: "iconify text-neutral-300 w-4 h-4",
                    "data-icon": "ep:setting"
                  })
                }),
                /* @__PURE__ */ jsx("button", {
                  class: "py-2 px-5 bg-white bg-opacity-[2%] rounded-md",
                  children: /* @__PURE__ */ jsx("span", {
                    class: "iconify text-neutral-300 w-4 h-4",
                    "data-icon": "ep:user"
                  })
                })
              ]
            })
          })
        ]
      }),
      /* @__PURE__ */ jsx("div", {
        class: "sidebarmessage",
        children: [
          /* @__PURE__ */ jsx("div", {
            class: "msgcont",
            children: [
              /* @__PURE__ */ jsx("span", {
                class: "pl-[6px] mt-1 text-[15px] font-medium text-neutral-300 font-sf",
                children: "Messages"
              }),
              /* @__PURE__ */ jsx("span", {
                class: "iconify w-5 h-5 ml-auto mr-1 text-neutral-400 my-auto",
                "data-icon": "ep:edit"
              })
            ]
          }),
          /* @__PURE__ */ jsx("div", {
            class: "flex flex-col my-1 py-1 space-y-[22px] px-1",
            children: [
              /* @__PURE__ */ jsx("div", {
                class: "flex flex-row space-x-[10px]",
                children: [
                  /* @__PURE__ */ jsx("img", {
                    class: "w-10 border border-[rgba(0,0,0,0)] flex-shrink-0 h-10 mx-2 mr-1 rounded-md",
                    src: "https://picsum.photos/100/100"
                  }),
                  /* @__PURE__ */ jsx("div", {
                    class: "flex flex-col my-auto space-y-[0px] relative w-full",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        class: "text-[13px] font-bold font-sf text-neutral-400",
                        children: " Bon Jovi "
                      }),
                      /* @__PURE__ */ jsx("span", {
                        class: "text-[11px] font-sf text-neutral-500 pl-[1px]",
                        children: " Active Yesterday "
                      })
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsx("div", {
                class: "flex flex-row space-x-[10px]",
                children: [
                  /* @__PURE__ */ jsx("img", {
                    class: "w-10 border border-[rgba(0,0,0,0)] flex-shrink-0 h-10 mx-2 mr-1 rounded-md",
                    src: "https://picsum.photos/100/300"
                  }),
                  /* @__PURE__ */ jsx("div", {
                    class: "flex flex-col my-auto space-y-[0px] relative w-full",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        class: "text-[13px] font-bold font-sf text-neutral-400",
                        children: " Test User "
                      }),
                      /* @__PURE__ */ jsx("span", {
                        class: "text-[11px] font-sf text-neutral-500 pl-[1px]",
                        children: " Online "
                      })
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsx("div", {
                class: "flex flex-row space-x-[10px]",
                children: [
                  /* @__PURE__ */ jsx("img", {
                    class: "w-10 flex-shrink-0 border border-[rgba(0,0,0,0)] h-10 mx-2 mr-1 rounded-md",
                    src: "https://picsum.photos/100/200"
                  }),
                  /* @__PURE__ */ jsx("div", {
                    class: "flex flex-col my-auto space-y-[0px] relative w-full",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        class: "text-[13px] font-bold font-sf text-neutral-400",
                        children: " Trial User "
                      }),
                      /* @__PURE__ */ jsx("span", {
                        class: "text-[11px] font-sf text-neutral-500 pl-[1px]",
                        children: " Active 3m Ago "
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}, "s_BtnGjf3PdHw"));
const layout = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "bgcol",
    children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", {
        class: "flex flex-row w-screen flex-grow overflow-hidden ",
        children: [
          /* @__PURE__ */ jsx(Menu, {}),
          /* @__PURE__ */ jsx(Slot, {}),
          /* @__PURE__ */ jsx(Sidebar, {})
        ]
      })
    ]
  });
}, "s_yM0L9NCDGUk"));
const Layout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout
}, Symbol.toStringTag, { value: "Module" }));
const layoutIndex = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "bgcol",
    children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", {
        class: "flex flex-row md:flex-row w-screen flex-grow overflow-hidden ",
        children: [
          /* @__PURE__ */ jsx(Menu, {}),
          /* @__PURE__ */ jsx(Slot, {}),
          /* @__PURE__ */ jsx(Sidebar, {})
        ]
      })
    ]
  });
}, "s_NcbFhH0Rq0M"));
const Layoutindex_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layoutIndex
}, Symbol.toStringTag, { value: "Module" }));
const data$1 = {
  taylor: {
    name: "A Taylor Swift",
    username: "@Taylor_Swift",
    about: "I make music that i write",
    cover: "https://iheart-blog.s3.amazonaws.com/banner/originals/0_a_aaaTSwiftBanner.jpg",
    profile: "https://gracemcgettigan.files.wordpress.com/2015/01/tay.jpg",
    followers: "129M"
  },
  sean: {
    name: "A Sean Paul",
    username: "@Sean_Paul",
    about: "Sean Paul is a Jamaicam singer/songwriter known for his pop classics",
    cover: "https://i.pinimg.com/originals/30/58/6a/30586a6e4209906100fa2f470cd0a819.jpg",
    profile: "https://wallpapercave.com/wp/wp5979216.jpg",
    followers: "69M"
  }
};
const layoutProfile = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const location = useLocation();
  location.params.proid;
  location.params.proid;
  return /* @__PURE__ */ jsx("div", {
    class: " flex flex-grow flex-col bg-white bg-opacity-10 md:bg-opacity-0 py-0 md:space-y-4",
    children: /* @__PURE__ */ jsx("div", {
      class: "xl:relative md:m-5 m-3",
      children: [
        /* @__PURE__ */ jsx("div", {
          class: `h-44 lg:h-[203px] rounded-lg bg-cover `,
          style: `background-image:
linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 10%, rgba(0, 0, 0, .6) 40%, rgba(0, 0, 0, .8) 65%, rgba(0, 0, 0, 1) 100%),
url('');

background-size: cover;

`
        }),
        /* @__PURE__ */ jsx("div", {
          class: "xl:absolute w-full xl:left-10 xl:top-[120px] xl:right-0 mx-auto mt-7 xl:mt-0 flex flex-col",
          children: [
            /* @__PURE__ */ jsx("img", {
              class: "xl:w-[100px] xl:h-[100px] shadow-xl border border-neutral-800 w-20 mx-auto xl:mx-0 h-20 rounded-full"
            }),
            /* @__PURE__ */ jsx("div", {
              class: "flex-grow flex flex-col xl:block",
              children: [
                /* @__PURE__ */ jsx("div", {
                  class: "flex flex-row xl:top-[20px] xl:left-[125px] mx-auto xl:mx-0 xl:absolute none mt-3 xl:mt-0",
                  children: /* @__PURE__ */ jsx("div", {
                    class: " flex flex-col mx-auto xl:mx-0",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        class: "xl:text-lg mx-auto xl:mx-0 text-lg font-semibold font-sf text-neutral-300"
                      }),
                      /* @__PURE__ */ jsx("span", {
                        class: "xl:text-[12.5px] mt-1 xl:mt-[0px] text-center xl:text-left leading-relaxed xl:px-0 xl:w-full sm:w-3/4 leading-5 xl:mx-0 mx-auto px-8 text-[12px] font-sf text-neutral-400"
                      })
                    ]
                  })
                }),
                /* @__PURE__ */ jsx("button", {
                  class: "xl:absolute xl:right-[90px] shadow-lg xl:top-[25px] px-8 mx-auto xl:mx-0 h-max text-xs xl:text-sm text-white font-semibold bg-blue-600 overflow-y-hidden py-2 xl:my-0 my-5 xl:rounded-md",
                  children: "Follow"
                })
              ]
            })
          ]
        })
      ]
    })
  });
}, "s_aeoMBoP047Y"));
const ProfileProidLayoutprofile_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  data: data$1,
  default: layoutProfile
}, Symbol.toStringTag, { value: "Module" }));
function StoriesView(props) {
  return /* @__PURE__ */ jsx("div", {
    style: `background-image:
linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 10%, rgba(0, 0, 0, .6) 40%, rgba(0, 0, 0, .8) 65%, rgba(0, 0, 0, 1) 100%),
url('${props.url}');

background-size: cover;

`,
    class: " flex flex-col h-36 w-28 p-2 rounded-md",
    children: [
      /* @__PURE__ */ jsx("img", {
        class: "rounded-full w-8 h-8 m-1 flex-shrink-0 ",
        src: props.poster
      }),
      /* @__PURE__ */ jsx("span", {
        class: "text-neutral-300 text-xs ml-1 mb-1 font-inter font-semibold mt-auto text-left",
        children: props.name
      })
    ]
  });
}
const index_index = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  var publishpopup = useStore({
    state: false
  });
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("div", {
      class: "flex flex-col flex-grow ",
      children: [
        /* @__PURE__ */ jsx("div", {
          id: "publish",
          onClick$: inlinedQrl((event) => {
            const [publishpopup2] = useLexicalScope();
            return event.currentTarget == event.target ? (event.stopPropagation(), !publishpopup2.state ? publishpopup2.state = !publishpopup2.state : 0) : 0;
          }, "s_TlrTEIpSGyw", [
            publishpopup
          ]),
          class: `${!publishpopup.state ? "hidden" : "flex"}  fadeMe  items-center content-center flex flex-row`,
          children: /* @__PURE__ */ jsx("div", {
            id: "popup",
            class: "z-1000 bg-[#0d0d0d] rounded-lg mx-auto",
            children: [
              /* @__PURE__ */ jsx("div", {
                class: "py-3 px-3 flex flex-row",
                children: [
                  /* @__PURE__ */ jsx("button", {
                    onClick$: inlinedQrl(() => {
                      const [publishpopup2] = useLexicalScope();
                      return publishpopup2.state = !publishpopup2.state;
                    }, "s_p8802htc8lU", [
                      publishpopup
                    ]),
                    children: /* @__PURE__ */ jsx("span", {
                      class: "iconify my-1 mx-2 w-[18px] h-[18px] font-sf text-neutral-400 ",
                      "data-icon": "clarity:window-close-line"
                    })
                  }),
                  /* @__PURE__ */ jsx("button", {
                    class: "px-6 ml-auto py-[8px] right-0 ml-auto text-white font-inter font-medium text-[12px] rounded-md bg-blue-800",
                    children: "Publish"
                  })
                ]
              }),
              /* @__PURE__ */ jsx("textarea", {
                id: "publishtextarea",
                class: " outline-none bg-transparent w-72 md:w-96 h-32 mx-5 rounded-md font-sf placeholder:text-neutral-400 text-white md:text-md text-sm placeholder:text-md md:text-md placeholder:text-sm mt-0 px-0 mb-3 border-none",
                placeholder: "What's Poppin? @User"
              }),
              /* @__PURE__ */ jsx("div", {
                class: "py-[14px] border-t border-t-neutral-900 px-6 flex flex-row items-center content-center space-x-5",
                children: [
                  /* @__PURE__ */ jsx("span", {
                    class: "iconify ml-auto w-[18px] h-[18px] font-sf text-neutral-400 ",
                    "data-icon": "ci:image"
                  }),
                  /* @__PURE__ */ jsx("span", {
                    class: "iconify w-[18px] h-[18px] font-sf text-neutral-400 ",
                    "data-icon": "ci:youtube"
                  }),
                  /* @__PURE__ */ jsx("span", {
                    class: "iconify w-[18px] h-[18px] font-sf text-neutral-400 ",
                    "data-icon": "fluent:gif-16-filled"
                  })
                ]
              })
            ]
          })
        }),
        /* @__PURE__ */ jsx("div", {
          id: "midcont",
          class: " flex flex-grow flex-col bg-black bg-opacity-10 md:bg-opacity-0 md:rounded-md ",
          children: [
            /* @__PURE__ */ jsx("button", {
              onClick$: inlinedQrl(() => {
                const [publishpopup2] = useLexicalScope();
                return publishpopup2.state = !publishpopup2.state;
              }, "s_sI2nNmZV8Kk", [
                publishpopup
              ]),
              class: "fixed flex flex-row space-x-[10px] items-center content-center right-10 bottom-24 md:right-15 md:bottom-15 lg:bottom:20 text-white font-semibold font-inter md:text-md text-sm md:py-4 md:px-7 bg-blue-900 rounded-full",
              children: [
                /* @__PURE__ */ jsx("span", {
                  class: "md:m-0 m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4",
                  "data-icon": "ep:plus"
                }),
                /* @__PURE__ */ jsx("span", {
                  class: "hidden md:inline-flex",
                  children: "New Post"
                })
              ]
            }),
            /* @__PURE__ */ jsx("div", {
              class: "flex flex-row p-5 space-x-4 overflow-y-hidden overflow-x-auto",
              children: [
                /* @__PURE__ */ jsx(StoriesView, {
                  poster: "https://picsum.photos/100/200",
                  name: "John Doe",
                  url: "https://picsum.photos/300/400"
                }),
                /* @__PURE__ */ jsx(StoriesView, {
                  poster: "https://picsum.photos/200/300",
                  name: "Jack Steyn",
                  url: "https://picsum.photos/100/400"
                }),
                /* @__PURE__ */ jsx(StoriesView, {
                  poster: "https://picsum.photos/200/200",
                  name: "Amy Bruce",
                  url: "https://picsum.photos/200/400"
                })
              ]
            })
          ]
        })
      ]
    })
  });
}, "s_0e3es3vnWuk"));
const head$5 = {
  title: "Home"
};
const Indexindex = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index_index,
  head: head$5
}, Symbol.toStringTag, { value: "Module" }));
const index$5 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "h-screen flex flex-col flex-grow"
  });
}, "s_j5h3enAr0HE"));
const head$4 = {
  title: "Clips"
};
const Clips = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$5,
  head: head$4
}, Symbol.toStringTag, { value: "Module" }));
const index$4 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "h-screen flex flex-col flex-grow"
  });
}, "s_n0b0sGHmkUY"));
const head$3 = {
  title: "Favs"
};
const Favs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$4,
  head: head$3
}, Symbol.toStringTag, { value: "Module" }));
const index$3 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "h-screen flex flex-col flex-grow"
  });
}, "s_iYmIWuy4aaw"));
const head$2 = {
  title: "Search"
};
const Search = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$3,
  head: head$2
}, Symbol.toStringTag, { value: "Module" }));
const index$2 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "h-screen flex flex-col flex-grow"
  });
}, "s_tD1BXnbDybA"));
const head$1 = {
  title: "Settings"
};
const Settings = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$2,
  head: head$1
}, Symbol.toStringTag, { value: "Module" }));
const index$1 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "h-screen flex flex-col flex-grow"
  });
}, "s_uaqIf5ac0DY"));
const head = {
  title: "Vids"
};
const Vids = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$1,
  head
}, Symbol.toStringTag, { value: "Module" }));
const index = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const location = useLocation();
  location.params.proid;
  location.params.proid;
  location.params.proid;
  return /* @__PURE__ */ jsx("div", {
    id: "midcont",
    class: "h-screen flex flex-col flex-grow md:py-10 p-6 px-8",
    children: [
      /* @__PURE__ */ jsx("div", {
        class: "flex flex-row items-center content-center ",
        children: [
          /* @__PURE__ */ jsx("div", {
            class: "flex flex-row items-center content-center space-x-[12px] mr-auto",
            children: [
              /* @__PURE__ */ jsx("img", {
                class: "w-5 h-5 rounded-full",
                src: "https://picsum.photos/500/600",
                children: " "
              }),
              /* @__PURE__ */ jsx("h1", {
                class: "text-[12px] md:text-[12px] font-inter text-neutral-300 opacity-90 ",
                children: [
                  /* @__PURE__ */ jsx("span", {
                    class: "hidden md:inline-flex",
                    children: "Posted by"
                  }),
                  " TeamEvolt"
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsx("h1", {
            class: "text-[12px] md:text-[12px] font-inter text-neutral-400 ",
            children: "September 19 2022"
          })
        ]
      }),
      /* @__PURE__ */ jsx("h1", {
        class: "text-[20px] md:text-[20.75px] lg:text-[20.75px] my-4 mb-0 font-inter font-semibold text-neutral-300 ",
        children: "Did you expect to see a dynamically rendered post here?"
      }),
      /* @__PURE__ */ jsx("h1", {
        class: "text-[14px] md:text-[14.5px] lg:text-[14.5px] sm:mt-[10px] lg:mt-3 lg:mb-5 my-[17px] mb-[13px] lg:mb-[10px] md:mb-3 font-inter leading-relaxed text-neutral-400 ",
        children: "Well I did too, and do you know why it isn't the case? Well the guy that had to do backend is high right now. He hasn't been replying to my messages whenever i question him of when he thinks of doing. You understand my situation don't you? I dont care if you don't too"
      }),
      /* @__PURE__ */ jsx("div", {
        class: `  py-3 pt-[12px] ${`flex`}  `,
        children: [
          "    ",
          /* @__PURE__ */ jsx("img", {
            class: "w-auto rounded-[5px] mx-auto md:mx-0 h-auto",
            src: "https://picsum.photos/500/600"
          })
        ]
      })
    ]
  });
}, "s_Xo5tmaGPZOs"));
const PostsPostid = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index
}, Symbol.toStringTag, { value: "Module" }));
const data = {
  taylor: {
    name: "Taylor Swift",
    username: "@Taylor_Swift",
    about: "I make music that i write",
    cover: "https://iheart-blog.s3.amazonaws.com/banner/originals/0_a_aaaTSwiftBanner.jpg",
    profile: "https://gracemcgettigan.files.wordpress.com/2015/01/tay.jpg",
    followers: "129M"
  },
  sean: {
    name: "A Sean Paul",
    username: "@Sean_Paul",
    about: "Sean Paul is a Jamaicam singer/songwriter known for his pop classics",
    cover: "https://i.pinimg.com/originals/30/58/6a/30586a6e4209906100fa2f470cd0a819.jpg",
    profile: "https://wallpapercave.com/wp/wp5979216.jpg",
    followers: "69M"
  }
};
const index_profile = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const location = useLocation();
  location.params.proid;
  location.params.proid;
  return /* @__PURE__ */ jsx(Fragment, {});
}, "s_26hfKJ9I4hk"));
const ProfileProidIndexprofile = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  data,
  default: index_profile
}, Symbol.toStringTag, { value: "Module" }));
const Layout = () => Layout_;
const Layoutindex = () => Layoutindex_;
const ProfileProidLayoutprofile = () => ProfileProidLayoutprofile_;
const routes = [
  [/^\/$/, [Layoutindex, () => Indexindex], void 0, "/", ["q-2d2cbfbc.js", "q-3972aeac.js"]],
  [/^\/clips\/?$/, [Layout, () => Clips], void 0, "/clips", ["q-dc060538.js", "q-2021c3b9.js"]],
  [/^\/favs\/?$/, [Layout, () => Favs], void 0, "/favs", ["q-dc060538.js", "q-1a30d5a6.js"]],
  [/^\/search\/?$/, [Layout, () => Search], void 0, "/search", ["q-dc060538.js", "q-7a83e723.js"]],
  [/^\/settings\/?$/, [Layout, () => Settings], void 0, "/settings", ["q-dc060538.js", "q-d640bea0.js"]],
  [/^\/vids\/?$/, [Layout, () => Vids], void 0, "/vids", ["q-dc060538.js", "q-576b246e.js"]],
  [/^\/posts\/([^/]+?)\/?$/, [Layout, () => PostsPostid], ["postid"], "/posts/[postid]", ["q-dc060538.js", "q-0e6a5856.js"]],
  [/^\/profile\/([^/]+?)\/?$/, [Layout, ProfileProidLayoutprofile, () => ProfileProidIndexprofile], ["proid"], "/profile/[proid]", ["q-dc060538.js", "q-fbcc2226.js", "q-7b714472.js"]]
];
const menus = [];
const trailingSlash = false;
const basePathname = "/";
const cacheModules = true;
const _qwikCityPlan = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  routes,
  menus,
  trailingSlash,
  basePathname,
  cacheModules
}, Symbol.toStringTag, { value: "Module" }));
export {
  entry_ssr as default
};
