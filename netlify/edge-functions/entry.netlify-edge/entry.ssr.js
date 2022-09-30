/**
 * @license
 * @builder.io/qwik 0.0.108
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
const qDev$1 = globalThis.qDev === true;
const qSerialize = globalThis.qSerialize !== false;
const qDynamicPlatform = globalThis.qDynamicPlatform !== false;
const qTest = globalThis.qTest === true;
const seal = (obj) => {
  if (qDev$1) {
    Object.seal(obj);
  }
};
const EMPTY_ARRAY$1 = [];
const EMPTY_OBJ$1 = {};
if (qDev$1) {
  Object.freeze(EMPTY_ARRAY$1);
  Object.freeze(EMPTY_OBJ$1);
  Error.stackTraceLimit = 9999;
}
function isElement$1(value) {
  return isNode$1(value) && value.nodeType === 1;
}
function isNode$1(value) {
  return value && typeof value.nodeType === "number";
}
function assertDefined(value, text, ...parts) {
  if (qDev$1) {
    if (value != null)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
function assertEqual(value1, value2, text, ...parts) {
  if (qDev$1) {
    if (value1 === value2)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
function assertTrue(value1, text, ...parts) {
  if (qDev$1) {
    if (value1 === true)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
const isSerializableObject = (v) => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};
const isObject = (v) => {
  return v && typeof v === "object";
};
const isArray = (v) => {
  return Array.isArray(v);
};
const isString = (v) => {
  return typeof v === "string";
};
const isFunction = (v) => {
  return typeof v === "function";
};
const OnRenderProp = "q:renderFn";
const ComponentStylesPrefixContent = "\u2B50\uFE0F";
const QSlot = "q:slot";
const QSlotRef = "q:sref";
const QSlotS = "q:s";
const QStyle = "q:style";
const QScopedStyle = "q:sstyle";
const QContainerAttr = "q:container";
const QContainerSelector = "[q\\:container]";
const RenderEvent = "qRender";
const ELEMENT_ID = "q:id";
const ELEMENT_ID_PREFIX = "#";
const getDocument = (node) => {
  if (typeof document !== "undefined") {
    return document;
  }
  if (node.nodeType === 9) {
    return node;
  }
  const doc = node.ownerDocument;
  assertDefined(doc, "doc must be defined");
  return doc;
};
let _context;
const tryGetInvokeContext = () => {
  if (!_context) {
    const context = typeof document !== "undefined" && document && document.__q_context__;
    if (!context) {
      return void 0;
    }
    if (isArray(context)) {
      return document.__q_context__ = newInvokeContextFromTuple(context);
    }
    return context;
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
  if (ctx.$event$ !== RenderEvent) {
    throw qError(QError_useInvokeContext);
  }
  assertDefined(ctx.$hostElement$, `invoke: $hostElement$ must be defined`, ctx);
  assertDefined(ctx.$waitOn$, `invoke: $waitOn$ must be defined`, ctx);
  assertDefined(ctx.$renderCtx$, `invoke: $renderCtx$ must be defined`, ctx);
  assertDefined(ctx.$doc$, `invoke: $doc$ must be defined`, ctx);
  assertDefined(ctx.$subscriber$, `invoke: $subscriber$ must be defined`, ctx);
  return ctx;
};
const invoke = (context, fn, ...args) => {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context;
    returnValue = fn.apply(null, args);
  } finally {
    _context = previousContext;
  }
  return returnValue;
};
const waitAndRun = (ctx, callback) => {
  const previousWait = ctx.$waitOn$.slice();
  ctx.$waitOn$.push(Promise.allSettled(previousWait).then(callback));
};
const newInvokeContextFromTuple = (context) => {
  const element = context[0];
  return newInvokeContext(getDocument(element), void 0, element, context[1], context[2]);
};
const newInvokeContext = (doc, hostElement, element, event, url) => {
  const ctx = {
    $seq$: 0,
    $doc$: doc,
    $hostElement$: hostElement,
    $element$: element,
    $event$: event,
    $url$: url,
    $qrl$: void 0,
    $props$: void 0,
    $renderCtx$: void 0,
    $subscriber$: void 0,
    $waitOn$: void 0
  };
  seal(ctx);
  return ctx;
};
const getWrappingContainer = (el) => {
  return el.closest(QContainerSelector);
};
const isNode = (value) => {
  return value && typeof value.nodeType === "number";
};
const isDocument = (value) => {
  return value && value.nodeType === 9;
};
const isElement = (value) => {
  return value.nodeType === 1;
};
const isQwikElement = (value) => {
  return isNode(value) && (value.nodeType === 1 || value.nodeType === 111);
};
const isVirtualElement = (value) => {
  return value.nodeType === 111;
};
const isText = (value) => {
  return value.nodeType === 3;
};
function assertQwikElement(el) {
  if (qDev$1) {
    if (!isQwikElement(el)) {
      throw new Error("Not a Qwik Element");
    }
  }
}
const isPromise = (value) => {
  return value instanceof Promise;
};
const safeCall = (call, thenFn, rejectFn) => {
  try {
    const promise = call();
    if (isPromise(promise)) {
      return promise.then(thenFn, rejectFn);
    } else {
      return thenFn(promise);
    }
  } catch (e) {
    return rejectFn(e);
  }
};
const then = (promise, thenFn) => {
  return isPromise(promise) ? promise.then(thenFn) : thenFn(promise);
};
const promiseAll = (promises) => {
  const hasPromise = promises.some(isPromise);
  if (hasPromise) {
    return Promise.all(promises);
  }
  return promises;
};
const isNotNullable = (v) => {
  return v != null;
};
const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const createPlatform$1 = (doc) => {
  const moduleCache = /* @__PURE__ */ new Map();
  return {
    isServer: false,
    importSymbol(containerEl, url, symbolName) {
      const urlDoc = toUrl$1(doc, containerEl, url).toString();
      const urlCopy = new URL(urlDoc);
      urlCopy.hash = "";
      urlCopy.search = "";
      const importURL = urlCopy.href;
      const mod = moduleCache.get(importURL);
      if (mod) {
        return mod[symbolName];
      }
      return import(
        /* @vite-ignore */
        importURL
      ).then((mod2) => {
        mod2 = findModule(mod2);
        moduleCache.set(importURL, mod2);
        return mod2[symbolName];
      });
    },
    raf: (fn) => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve(fn());
        });
      });
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol() {
      return void 0;
    }
  };
};
const findModule = (module) => {
  return Object.values(module).find(isModule) || module;
};
const isModule = (module) => {
  return isObject(module) && module[Symbol.toStringTag] === "Module";
};
const toUrl$1 = (doc, containerEl, url) => {
  var _a;
  const baseURI = doc.baseURI;
  const base = new URL((_a = containerEl.getAttribute("q:base")) != null ? _a : baseURI, baseURI);
  return new URL(url, base);
};
const setPlatform = (doc, plt) => doc[DocumentPlatform] = plt;
const getPlatform = (docOrNode) => {
  const doc = getDocument(docOrNode);
  return doc[DocumentPlatform] || (doc[DocumentPlatform] = createPlatform$1(doc));
};
const isServer$1 = (ctx) => {
  var _a, _b;
  if (qDynamicPlatform) {
    return (_b = (_a = ctx.$renderCtx$) == null ? void 0 : _a.$static$.$containerState$.$platform$.isServer) != null ? _b : getPlatform(ctx.$doc$).isServer;
  }
  return false;
};
const DocumentPlatform = ":platform:";
const directSetAttribute = (el, prop, value) => {
  return el.setAttribute(prop, value);
};
const directGetAttribute = (el, prop) => {
  return el.getAttribute(prop);
};
const ON_PROP_REGEX = /^(on|window:|document:)/;
const isOnProp = (prop) => {
  return ON_PROP_REGEX.test(prop);
};
const addQRLListener = (listenersMap, prop, input) => {
  let existingListeners = listenersMap[prop];
  if (!existingListeners) {
    listenersMap[prop] = existingListeners = [];
  }
  for (const qrl of input) {
    const hash = qrl.$hash$;
    let replaced = false;
    for (let i = 0; i < existingListeners.length; i++) {
      const existing = existingListeners[i];
      if (existing.$hash$ === hash) {
        existingListeners.splice(i, 1, qrl);
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      existingListeners.push(qrl);
    }
  }
  return false;
};
const setEvent = (listenerMap, prop, input) => {
  assertTrue(prop.endsWith("$"), "render: event property does not end with $", prop);
  const qrls = isArray(input) ? input.map(ensureQrl) : [ensureQrl(input)];
  prop = normalizeOnProp(prop.slice(0, -1));
  addQRLListener(listenerMap, prop, qrls);
  return prop;
};
const ensureQrl = (value) => {
  return isQrl$1(value) ? value : $(value);
};
const getDomListeners = (ctx, containerEl) => {
  const attributes = ctx.$element$.attributes;
  const listeners = {};
  for (let i = 0; i < attributes.length; i++) {
    const { name, value } = attributes.item(i);
    if (name.startsWith("on:") || name.startsWith("on-window:") || name.startsWith("on-document:")) {
      let array = listeners[name];
      if (!array) {
        listeners[name] = array = [];
      }
      const urls = value.split("\n");
      for (const url of urls) {
        const qrl = parseQRL(url, containerEl);
        if (qrl.$capture$) {
          inflateQrl(qrl, ctx);
        }
        array.push(qrl);
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
  ctx.$seq$++;
  const set = (value) => {
    if (qDev$1) {
      verifySerializable(value);
    }
    return seq[i] = value;
  };
  return {
    get: seq[i],
    set,
    i,
    ctx
  };
};
const useOn = (event, eventQrl) => _useOn(`on-${event}`, eventQrl);
const _useOn = (eventName, eventQrl) => {
  const invokeCtx = useInvokeContext();
  const ctx = getContext(invokeCtx.$hostElement$);
  assertQrl(eventQrl);
  addQRLListener(ctx.li, normalizeOnProp(eventName), [eventQrl]);
};
const emitEvent = (el, eventName, detail, bubbles) => {
  if (el && typeof CustomEvent === "function") {
    el.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: bubbles
    }));
  }
};
const jsx = (type, props, key) => {
  if (qDev$1) {
    if (!isString(type) && !isFunction(type)) {
      throw qError(QError_invalidJsxNodeType, type);
    }
  }
  const processed = key == null ? null : String(key);
  return new JSXNodeImpl(type, props, processed);
};
const SKIP_RENDER_TYPE = ":skipRender";
class JSXNodeImpl {
  constructor(type, props, key = null) {
    this.type = type;
    this.props = props;
    this.key = key;
    seal(this);
  }
}
const isJSXNode = (n) => {
  if (qDev$1) {
    if (n instanceof JSXNodeImpl) {
      return true;
    }
    if (isObject(n) && "key" in n && "props" in n && "type" in n) {
      logWarn(`Duplicate implementations of "JSXNode" found`);
      return true;
    }
    return false;
  } else {
    return n instanceof JSXNodeImpl;
  }
};
const Fragment = (props) => props.children;
const QOnce = "qonce";
const SkipRender = Symbol("skip render");
const SSRComment = () => null;
const Virtual = (props) => props.children;
const InternalSSRStream = () => null;
const fromCamelToKebabCase = (text) => {
  return text.replace(/([A-Z])/g, "-$1").toLowerCase();
};
const executeComponent = (rctx, elCtx) => {
  elCtx.$dirty$ = false;
  elCtx.$mounted$ = true;
  elCtx.$slots$ = [];
  const hostElement = elCtx.$element$;
  const onRenderQRL = elCtx.$renderQrl$;
  const staticCtx = rctx.$static$;
  const containerState = staticCtx.$containerState$;
  const props = elCtx.$props$;
  const newCtx = pushRenderContext(rctx, elCtx);
  const invocatinContext = newInvokeContext(staticCtx.$doc$, hostElement, void 0, RenderEvent);
  const waitOn = invocatinContext.$waitOn$ = [];
  assertDefined(onRenderQRL, `render: host element to render must has a $renderQrl$:`, elCtx);
  assertDefined(props, `render: host element to render must has defined props`, elCtx);
  newCtx.$cmpCtx$ = elCtx;
  invocatinContext.$subscriber$ = hostElement;
  invocatinContext.$renderCtx$ = rctx;
  containerState.$hostsStaging$.delete(hostElement);
  containerState.$subsManager$.$clearSub$(hostElement);
  const onRenderFn = onRenderQRL.getFn(invocatinContext);
  return safeCall(() => onRenderFn(props), (jsxNode) => {
    staticCtx.$hostElements$.add(hostElement);
    const waitOnPromise = promiseAll(waitOn);
    return then(waitOnPromise, () => {
      if (isFunction(jsxNode)) {
        elCtx.$dirty$ = false;
        jsxNode = jsxNode();
      } else if (elCtx.$dirty$) {
        return executeComponent(rctx, elCtx);
      }
      elCtx.$attachedListeners$ = false;
      return {
        node: jsxNode,
        rctx: newCtx
      };
    });
  }, (err) => {
    logError(err);
  });
};
const createRenderContext = (doc, containerState) => {
  const ctx = {
    $static$: {
      $doc$: doc,
      $containerState$: containerState,
      $containerEl$: containerState.$containerEl$,
      $hostElements$: /* @__PURE__ */ new Set(),
      $operations$: [],
      $postOperations$: [],
      $roots$: [],
      $addSlots$: [],
      $rmSlots$: []
    },
    $cmpCtx$: void 0,
    $localStack$: []
  };
  seal(ctx);
  seal(ctx.$static$);
  return ctx;
};
const pushRenderContext = (ctx, elCtx) => {
  const newCtx = {
    $static$: ctx.$static$,
    $cmpCtx$: ctx.$cmpCtx$,
    $localStack$: ctx.$localStack$.concat(elCtx)
  };
  return newCtx;
};
const joinClasses = (...input) => {
  const set = /* @__PURE__ */ new Set();
  input.forEach((value) => {
    parseClassAny(value).forEach((v) => set.add(v));
  });
  return Array.from(set).join(" ");
};
const parseClassAny = (obj) => {
  if (isString(obj)) {
    return parseClassList(obj);
  } else if (isObject(obj)) {
    if (isArray(obj)) {
      return obj;
    } else {
      const output = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value) {
            output.push(key);
          }
        }
      }
      return output;
    }
  }
  return [];
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => !value ? EMPTY_ARRAY$1 : value.split(parseClassListRegex);
const stringifyStyle = (obj) => {
  if (obj == null)
    return "";
  if (typeof obj == "object") {
    if (isArray(obj)) {
      throw qError(QError_stringifyClassOrStyle, obj, "style");
    } else {
      const chunks = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value) {
            chunks.push(fromCamelToKebabCase(key) + ":" + value);
          }
        }
      }
      return chunks.join(";");
    }
  }
  return String(obj);
};
const getNextIndex = (ctx) => {
  return intToStr(ctx.$static$.$containerState$.$elementIndex$++);
};
const getQId = (el) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    return ctx.$id$;
  }
  return null;
};
const setQId = (rctx, ctx) => {
  const id = getNextIndex(rctx);
  ctx.$id$ = id;
  if (qSerialize) {
    ctx.$element$.setAttribute(ELEMENT_ID, id);
  }
};
const hasStyle = (containerState, styleId) => {
  return containerState.$styleIds$.has(styleId);
};
const ALLOWS_PROPS = [QSlot];
const SKIPS_PROPS = [QSlot, OnRenderProp, "children"];
const hashCode = (text, hash = 0) => {
  if (text.length === 0)
    return hash;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Number(Math.abs(hash)).toString(36);
};
const styleKey = (qStyles, index2) => {
  assertQrl(qStyles);
  return `${hashCode(qStyles.$hash$)}-${index2}`;
};
const styleContent = (styleId) => {
  return ComponentStylesPrefixContent + styleId;
};
const serializeSStyle = (scopeIds) => {
  const value = scopeIds.join(" ");
  if (value.length > 0) {
    return value;
  }
  return void 0;
};
const setAttribute = (ctx, el, prop, value) => {
  if (ctx) {
    ctx.$operations$.push({
      $operation$: _setAttribute,
      $args$: [el, prop, value]
    });
  } else {
    _setAttribute(el, prop, value);
  }
};
const _setAttribute = (el, prop, value) => {
  if (value == null || value === false) {
    el.removeAttribute(prop);
  } else {
    const str = value === true ? "" : String(value);
    directSetAttribute(el, prop, str);
  }
};
const setProperty$1 = (ctx, node, key, value) => {
  if (ctx) {
    ctx.$operations$.push({
      $operation$: _setProperty,
      $args$: [node, key, value]
    });
  } else {
    _setProperty(node, key, value);
  }
};
const _setProperty = (node, key, value) => {
  try {
    node[key] = value;
  } catch (err) {
    logError(codeToText(QError_setProperty), { node, key, value }, err);
  }
};
const createElement = (doc, expectTag, isSvg) => {
  const el = isSvg ? doc.createElementNS(SVG_NS, expectTag) : doc.createElement(expectTag);
  return el;
};
const insertBefore = (ctx, parent, newChild, refChild) => {
  ctx.$operations$.push({
    $operation$: directInsertBefore,
    $args$: [parent, newChild, refChild ? refChild : null]
  });
  return newChild;
};
const appendChild = (ctx, parent, newChild) => {
  ctx.$operations$.push({
    $operation$: directAppendChild,
    $args$: [parent, newChild]
  });
  return newChild;
};
const appendHeadStyle = (ctx, styleTask) => {
  ctx.$containerState$.$styleIds$.add(styleTask.styleId);
  ctx.$postOperations$.push({
    $operation$: _appendHeadStyle,
    $args$: [ctx.$doc$, ctx.$containerEl$, styleTask]
  });
};
const setClasslist = (ctx, elm, toRemove, toAdd) => {
  if (ctx) {
    ctx.$operations$.push({
      $operation$: _setClasslist,
      $args$: [elm, toRemove, toAdd]
    });
  } else {
    _setClasslist(elm, toRemove, toAdd);
  }
};
const _setClasslist = (elm, toRemove, toAdd) => {
  const classList = elm.classList;
  classList.remove(...toRemove);
  classList.add(...toAdd);
};
const _appendHeadStyle = (doc, containerEl, styleTask) => {
  const isDoc = doc.documentElement === containerEl;
  const headEl = doc.head;
  const style = doc.createElement("style");
  if (isDoc && !headEl) {
    logWarn("document.head is undefined");
  }
  directSetAttribute(style, QStyle, styleTask.styleId);
  style.textContent = styleTask.content;
  if (isDoc && headEl) {
    directAppendChild(headEl, style);
  } else {
    directInsertBefore(containerEl, style, containerEl.firstChild);
  }
};
const prepend = (ctx, parent, newChild) => {
  ctx.$operations$.push({
    $operation$: directInsertBefore,
    $args$: [parent, newChild, parent.firstChild]
  });
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
    if (el.nodeType === 1 || el.nodeType === 111) {
      const subsManager = staticCtx.$containerState$.$subsManager$;
      cleanupTree(el, staticCtx, subsManager, true);
    }
    directRemoveChild(parent, el);
  } else if (qDev$1) {
    logWarn("Trying to remove component already removed", el);
  }
};
const createTemplate = (doc, slotName) => {
  const template = createElement(doc, "q:template", false);
  directSetAttribute(template, QSlot, slotName);
  directSetAttribute(template, "hidden", "");
  directSetAttribute(template, "aria-hidden", "true");
  return template;
};
const executeDOMRender = (ctx) => {
  for (const op of ctx.$operations$) {
    op.$operation$.apply(void 0, op.$args$);
  }
  resolveSlotProjection(ctx);
};
const getKey = (el) => {
  return directGetAttribute(el, "q:key");
};
const setKey = (el, key) => {
  if (key !== null) {
    directSetAttribute(el, "q:key", key);
  }
};
const resolveSlotProjection = (ctx) => {
  const subsManager = ctx.$containerState$.$subsManager$;
  ctx.$rmSlots$.forEach((slotEl) => {
    const key = getKey(slotEl);
    assertDefined(key, "slots must have a key");
    const slotChildren = getChildren(slotEl, "root");
    if (slotChildren.length > 0) {
      const sref = slotEl.getAttribute(QSlotRef);
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
  });
  ctx.$addSlots$.forEach(([slotEl, hostElm]) => {
    const key = getKey(slotEl);
    assertDefined(key, "slots must have a key");
    const template = Array.from(hostElm.childNodes).find((node) => {
      return isSlotTemplate(node) && node.getAttribute(QSlot) === key;
    });
    if (template) {
      const children = getChildren(template, "root");
      children.forEach((child) => {
        directAppendChild(slotEl, child);
      });
      template.remove();
    }
  });
};
const createTextNode = (doc, text) => {
  return doc.createTextNode(text);
};
const printRenderStats = (ctx) => {
  var _a;
  if (qDev$1) {
    if (typeof window !== "undefined" && window.document != null) {
      const byOp = {};
      for (const op of ctx.$operations$) {
        byOp[op.$operation$.name] = ((_a = byOp[op.$operation$.name]) != null ? _a : 0) + 1;
      }
      const stats = {
        byOp,
        roots: ctx.$roots$.map((ctx2) => ctx2.$element$),
        hostElements: Array.from(ctx.$hostElements$),
        operations: ctx.$operations$.map((v) => [v.$operation$.name, ...v.$args$])
      };
      const noOps = ctx.$operations$.length === 0;
      logDebug("Render stats.", noOps ? "No operations" : "", stats);
    }
  }
};
const VIRTUAL_SYMBOL = "__virtual";
const newVirtualElement = (doc) => {
  const open = doc.createComment("qv ");
  const close = doc.createComment("/qv");
  return new VirtualElementImpl(open, close);
};
const parseVirtualAttributes = (str) => {
  if (!str) {
    return /* @__PURE__ */ new Map();
  }
  const attributes = str.split(" ");
  return new Map(attributes.map((attr) => {
    const index2 = attr.indexOf("=");
    if (index2 >= 0) {
      return [attr.slice(0, index2), unescape(attr.slice(index2 + 1))];
    } else {
      return [attr, ""];
    }
  }));
};
const serializeVirtualAttributes = (map) => {
  const attributes = [];
  map.forEach((value, key) => {
    if (!value) {
      attributes.push(`${key}`);
    } else {
      attributes.push(`${key}=${escape$1(value)}`);
    }
  });
  return attributes.join(" ");
};
const SHOW_COMMENT$1 = 128;
const FILTER_ACCEPT$1 = 1;
const FILTER_REJECT$1 = 2;
const walkerVirtualByAttribute = (el, prop, value) => {
  return el.ownerDocument.createTreeWalker(el, SHOW_COMMENT$1, {
    acceptNode(c) {
      const virtual = getVirtualElement(c);
      if (virtual) {
        return directGetAttribute(virtual, prop) === value ? FILTER_ACCEPT$1 : FILTER_REJECT$1;
      }
      return FILTER_REJECT$1;
    }
  });
};
const queryAllVirtualByAttribute = (el, prop, value) => {
  const walker = walkerVirtualByAttribute(el, prop, value);
  const pars = [];
  let currentNode = null;
  while (currentNode = walker.nextNode()) {
    pars.push(getVirtualElement(currentNode));
  }
  return pars;
};
const escape$1 = (s) => {
  return s.replace(/ /g, "+");
};
const unescape = (s) => {
  return s.replace(/\+/g, " ");
};
const VIRTUAL = ":virtual";
class VirtualElementImpl {
  constructor(open, close) {
    this.open = open;
    this.close = close;
    this._qc_ = null;
    this.nodeType = 111;
    this.localName = VIRTUAL;
    this.nodeName = VIRTUAL;
    const doc = this.ownerDocument = open.ownerDocument;
    this.template = createElement(doc, "template", false);
    this.attributes = parseVirtualAttributes(open.data.slice(3));
    assertTrue(open.data.startsWith("qv "), "comment is not a qv");
    open[VIRTUAL_SYMBOL] = this;
    seal(this);
  }
  insertBefore(node, ref) {
    const parent = this.parentElement;
    if (parent) {
      const ref2 = ref ? ref : this.close;
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
      assertEqual(this.template.childElementCount, 0, "children should be empty");
      parent.removeChild(this.open);
      this.template.append(...ch);
      parent.removeChild(this.close);
    }
  }
  appendChild(node) {
    return this.insertBefore(node, null);
  }
  insertBeforeTo(newParent, child) {
    const ch = Array.from(this.childNodes);
    if (this.parentElement) {
      console.warn("already attached");
    }
    newParent.insertBefore(this.open, child);
    for (const c of ch) {
      newParent.insertBefore(c, child);
    }
    newParent.insertBefore(this.close, child);
    assertEqual(this.template.childElementCount, 0, "children should be empty");
  }
  appendTo(newParent) {
    this.insertBeforeTo(newParent, null);
  }
  removeChild(child) {
    if (this.parentElement) {
      this.parentElement.removeChild(child);
    } else {
      this.template.removeChild(child);
    }
  }
  getAttribute(prop) {
    var _a;
    return (_a = this.attributes.get(prop)) != null ? _a : null;
  }
  hasAttribute(prop) {
    return this.attributes.has(prop);
  }
  setAttribute(prop, value) {
    this.attributes.set(prop, value);
    if (qSerialize) {
      this.open.data = updateComment(this.attributes);
    }
  }
  removeAttribute(prop) {
    this.attributes.delete(prop);
    if (qSerialize) {
      this.open.data = updateComment(this.attributes);
    }
  }
  matches(_) {
    return false;
  }
  compareDocumentPosition(other) {
    return this.open.compareDocumentPosition(other);
  }
  closest(query) {
    const parent = this.parentElement;
    if (parent) {
      return parent.closest(query);
    }
    return null;
  }
  querySelectorAll(query) {
    const result = [];
    const ch = getChildren(this, "elements");
    ch.forEach((el) => {
      if (isQwikElement(el)) {
        if (el.matches(query)) {
          result.push(el);
        }
        result.concat(Array.from(el.querySelectorAll(query)));
      }
    });
    return result;
  }
  querySelector(query) {
    for (const el of this.childNodes) {
      if (isElement(el)) {
        if (el.matches(query)) {
          return el;
        }
        const v = el.querySelector(query);
        if (v !== null) {
          return v;
        }
      }
    }
    return null;
  }
  get firstChild() {
    if (this.parentElement) {
      const first = this.open.nextSibling;
      if (first === this.close) {
        return null;
      }
      return first;
    } else {
      return this.template.firstChild;
    }
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
    while (node = node.nextSibling) {
      if (node !== this.close) {
        nodes.push(node);
      } else {
        break;
      }
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
const updateComment = (attributes) => {
  return `qv ${serializeVirtualAttributes(attributes)}`;
};
const processVirtualNodes = (node) => {
  if (node == null) {
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
  const virtual = open[VIRTUAL_SYMBOL];
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
  while (node) {
    if (isComment(node)) {
      if (node.data.startsWith("qv ")) {
        stack++;
      } else if (node.data === "/qv") {
        stack--;
        if (stack === 0) {
          return node;
        }
      }
    }
    node = node.nextSibling;
  }
  throw new Error("close not found");
};
const isComment = (node) => {
  return node.nodeType === 8;
};
const getRootNode = (node) => {
  if (node == null) {
    return null;
  }
  if (isVirtualElement(node)) {
    return node.open;
  } else {
    return node;
  }
};
const renderComponent = (rctx, ctx, flags) => {
  const justMounted = !ctx.$mounted$;
  return then(executeComponent(rctx, ctx), (res) => {
    if (res) {
      const hostElement = ctx.$element$;
      const newCtx = res.rctx;
      const invocatinContext = newInvokeContext(rctx.$static$.$doc$, hostElement);
      invocatinContext.$subscriber$ = hostElement;
      invocatinContext.$renderCtx$ = newCtx;
      if (justMounted) {
        if (ctx.$appendStyles$) {
          for (const style of ctx.$appendStyles$) {
            appendHeadStyle(rctx.$static$, style);
          }
        }
        if (ctx.$scopeIds$) {
          const value = serializeSStyle(ctx.$scopeIds$);
          if (value) {
            hostElement.setAttribute(QScopedStyle, value);
          }
        }
      }
      const processedJSXNode = processData$1(res.node, invocatinContext);
      return then(processedJSXNode, (processedJSXNode2) => {
        const newVdom = wrapJSX(hostElement, processedJSXNode2);
        const oldVdom = getVdom(ctx);
        ctx.$vdom$ = newVdom;
        return visitJsxNode(newCtx, oldVdom, newVdom, flags);
      });
    }
  });
};
const getVdom = (ctx) => {
  if (!ctx.$vdom$) {
    ctx.$vdom$ = domToVnode(ctx.$element$);
  }
  return ctx.$vdom$;
};
class ProcessedJSXNodeImpl {
  constructor($type$, $props$, $children$, $key$) {
    this.$type$ = $type$;
    this.$props$ = $props$;
    this.$children$ = $children$;
    this.$key$ = $key$;
    this.$elm$ = null;
    this.$text$ = "";
    seal(this);
  }
}
const processNode = (node, invocationContext) => {
  const key = node.key != null ? String(node.key) : null;
  const nodeType = node.type;
  const props = node.props;
  const originalChildren = props.children;
  let textType = "";
  if (isString(nodeType)) {
    textType = nodeType;
  } else if (nodeType === Virtual) {
    textType = VIRTUAL;
  } else if (isFunction(nodeType)) {
    const res = invocationContext ? invoke(invocationContext, () => nodeType(props, node.key)) : nodeType(props, node.key);
    return processData$1(res, invocationContext);
  } else {
    throw qError(QError_invalidJsxNodeType, nodeType);
  }
  let children = EMPTY_ARRAY$1;
  if (originalChildren != null) {
    return then(processData$1(originalChildren, invocationContext), (result) => {
      if (result !== void 0) {
        children = isArray(result) ? result : [result];
      }
      return new ProcessedJSXNodeImpl(textType, props, children, key);
    });
  } else {
    return new ProcessedJSXNodeImpl(textType, props, children, key);
  }
};
const wrapJSX = (element, input) => {
  const children = input === void 0 ? EMPTY_ARRAY$1 : isArray(input) ? input : [input];
  const node = new ProcessedJSXNodeImpl(":virtual", {}, children, null);
  node.$elm$ = element;
  return node;
};
const processData$1 = (node, invocationContext) => {
  if (node == null || typeof node === "boolean") {
    return void 0;
  }
  if (isString(node) || typeof node === "number") {
    const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ$1, EMPTY_ARRAY$1, null);
    newNode.$text$ = String(node);
    return newNode;
  } else if (isJSXNode(node)) {
    return processNode(node, invocationContext);
  } else if (isArray(node)) {
    const output = promiseAll(node.flatMap((n) => processData$1(n, invocationContext)));
    return then(output, (array) => array.flat(100).filter(isNotNullable));
  } else if (isPromise(node)) {
    return node.then((node2) => processData$1(node2, invocationContext));
  } else if (node === SkipRender) {
    return new ProcessedJSXNodeImpl(SKIP_RENDER_TYPE, EMPTY_OBJ$1, EMPTY_ARRAY$1, null);
  } else {
    logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
    return void 0;
  }
};
const SVG_NS = "http://www.w3.org/2000/svg";
const IS_SVG = 1 << 0;
const IS_HEAD$1 = 1 << 1;
const CHILDREN_PLACEHOLDER = [];
const visitJsxNode = (ctx, oldVnode, newVnode, flags) => {
  return smartUpdateChildren(ctx, oldVnode, newVnode, "root", flags);
};
const smartUpdateChildren = (ctx, oldVnode, newVnode, mode, flags) => {
  assertQwikElement(oldVnode.$elm$);
  const ch = newVnode.$children$;
  if (ch.length === 1 && ch[0].$type$ === SKIP_RENDER_TYPE) {
    return;
  }
  const elm = oldVnode.$elm$;
  const needsDOMRead = oldVnode.$children$ === CHILDREN_PLACEHOLDER;
  if (needsDOMRead) {
    const isHead = elm.nodeName === "HEAD";
    if (isHead) {
      mode = "head";
      flags |= IS_HEAD$1;
    }
  }
  const oldCh = getVnodeChildren(oldVnode, mode);
  if (oldCh.length > 0 && ch.length > 0) {
    return updateChildren(ctx, elm, oldCh, ch, flags);
  } else if (ch.length > 0) {
    return addVnodes(ctx, elm, null, ch, 0, ch.length - 1, flags);
  } else if (oldCh.length > 0) {
    return removeVnodes(ctx.$static$, oldCh, 0, oldCh.length - 1);
  }
};
const getVnodeChildren = (vnode, mode) => {
  const oldCh = vnode.$children$;
  const elm = vnode.$elm$;
  if (oldCh === CHILDREN_PLACEHOLDER) {
    return vnode.$children$ = getChildrenVnodes(elm, mode);
  }
  return oldCh;
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
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newStartVnode, flags));
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newEndVnode, flags));
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      assertDefined(oldStartVnode.$elm$, "oldStartVnode $elm$ must be defined");
      assertDefined(oldEndVnode.$elm$, "oldEndVnode $elm$ must be defined");
      results.push(patchVnode(ctx, oldStartVnode, newEndVnode, flags));
      insertBefore(staticCtx, parentElm, oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      assertDefined(oldStartVnode.$elm$, "oldStartVnode $elm$ must be defined");
      assertDefined(oldEndVnode.$elm$, "oldEndVnode $elm$ must be defined");
      results.push(patchVnode(ctx, oldEndVnode, newStartVnode, flags));
      insertBefore(staticCtx, parentElm, oldEndVnode.$elm$, oldStartVnode.$elm$);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      if (oldKeyToIdx === void 0) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.$key$];
      if (idxInOld === void 0) {
        const newElm = createElm(ctx, newStartVnode, flags);
        results.push(then(newElm, (newElm2) => {
          insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
        }));
      } else {
        elmToMove = oldCh[idxInOld];
        if (!isTagName(elmToMove, newStartVnode.$type$)) {
          const newElm = createElm(ctx, newStartVnode, flags);
          results.push(then(newElm, (newElm2) => {
            insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
          }));
        } else {
          results.push(patchVnode(ctx, elmToMove, newStartVnode, flags));
          oldCh[idxInOld] = void 0;
          assertDefined(elmToMove.$elm$, "elmToMove $elm$ must be defined");
          insertBefore(staticCtx, parentElm, elmToMove.$elm$, oldStartVnode.$elm$);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (newStartIdx <= newEndIdx) {
    const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$;
    results.push(addVnodes(ctx, parentElm, before, newCh, newStartIdx, newEndIdx, flags));
  }
  let wait = promiseAll(results);
  if (oldStartIdx <= oldEndIdx) {
    wait = then(wait, () => {
      removeVnodes(staticCtx, oldCh, oldStartIdx, oldEndIdx);
    });
  }
  return wait;
};
const getCh = (elm, filter) => {
  const end = isVirtualElement(elm) ? elm.close : null;
  const nodes = [];
  let node = elm.firstChild;
  while (node = processVirtualNodes(node)) {
    if (filter(node)) {
      nodes.push(node);
    }
    node = node.nextSibling;
    if (node === end) {
      break;
    }
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
const getChildrenVnodes = (elm, mode) => {
  return getChildren(elm, mode).map(domToVnode);
};
const domToVnode = (node) => {
  if (isQwikElement(node)) {
    const props = isVirtualElement(node) ? EMPTY_OBJ$1 : getProps(node);
    const t = new ProcessedJSXNodeImpl(node.localName, props, CHILDREN_PLACEHOLDER, getKey(node));
    t.$elm$ = node;
    return t;
  } else if (isText(node)) {
    const t = new ProcessedJSXNodeImpl(node.nodeName, {}, CHILDREN_PLACEHOLDER, null);
    t.$text$ = node.data;
    t.$elm$ = node;
    return t;
  }
  throw new Error("invalid node");
};
const getProps = (node) => {
  const props = {};
  const attributes = node.attributes;
  const len = attributes.length;
  for (let i = 0; i < len; i++) {
    const a = attributes.item(i);
    assertDefined(a, "attribute must be defined");
    const name = a.name;
    if (!name.includes(":")) {
      props[name] = name === "class" ? parseClassAny(a.value).filter((c) => !c.startsWith(ComponentStylesPrefixContent)) : a.value;
    }
  }
  return props;
};
const isHeadChildren = (node) => {
  const type = node.nodeType;
  if (type === 1) {
    return node.hasAttribute("q:head");
  }
  return type === 111;
};
const isSlotTemplate = (node) => {
  return node.nodeName === "Q:TEMPLATE";
};
const isChildComponent = (node) => {
  const type = node.nodeType;
  if (type === 3 || type === 111) {
    return true;
  }
  if (type !== 1) {
    return false;
  }
  const nodeName = node.nodeName;
  if (nodeName === "Q:TEMPLATE") {
    return false;
  }
  if (nodeName === "HEAD") {
    return node.hasAttribute("q:head");
  }
  return true;
};
const splitChildren = (input) => {
  var _a;
  const output = {};
  for (const item of input) {
    const key = getSlotName(item);
    const node = (_a = output[key]) != null ? _a : output[key] = new ProcessedJSXNodeImpl(VIRTUAL, {
      [QSlotS]: ""
    }, [], key);
    node.$children$.push(item);
  }
  return output;
};
const patchVnode = (rctx, oldVnode, newVnode, flags) => {
  assertEqual(oldVnode.$type$, newVnode.$type$, "old and new vnodes type must be the same");
  const elm = oldVnode.$elm$;
  const tag = newVnode.$type$;
  const staticCtx = rctx.$static$;
  const isVirtual = tag === VIRTUAL;
  newVnode.$elm$ = elm;
  if (tag === "#text") {
    if (oldVnode.$text$ !== newVnode.$text$) {
      setProperty$1(staticCtx, elm, "data", newVnode.$text$);
    }
    return;
  }
  assertQwikElement(elm);
  let isSvg = !!(flags & IS_SVG);
  if (!isSvg && tag === "svg") {
    flags |= IS_SVG;
    isSvg = true;
  }
  const props = newVnode.$props$;
  const isComponent = isVirtual && OnRenderProp in props;
  const elCtx = getContext(elm);
  if (!isComponent) {
    const listenerMap = updateProperties$1(elCtx, staticCtx, oldVnode.$props$, props, isSvg);
    const currentComponent = rctx.$cmpCtx$;
    if (currentComponent && !currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      Object.entries(currentComponent.li).forEach(([key, value]) => {
        addQRLListener(listenerMap, key, value);
        addGlobalListener(staticCtx, elm, key);
      });
    }
    if (qSerialize) {
      Object.entries(listenerMap).forEach(([key, value]) => setAttribute(staticCtx, elm, key, serializeQRLs(value, elCtx)));
    }
    if (isSvg && newVnode.$type$ === "foreignObject") {
      flags &= ~IS_SVG;
      isSvg = false;
    }
    const isSlot = isVirtual && QSlotS in props;
    if (isSlot) {
      const currentComponent2 = rctx.$cmpCtx$;
      assertDefined(currentComponent2, "slots can not be rendered outside a component");
      assertDefined(currentComponent2.$slots$, "current component slots must be a defined array");
      currentComponent2.$slots$.push(newVnode);
      return;
    }
    const setsInnerHTML = props[dangerouslySetInnerHTML] !== void 0;
    if (setsInnerHTML) {
      if (qDev$1 && newVnode.$children$.length > 0) {
        logWarn("Node can not have children when innerHTML is set");
      }
      return;
    }
    const isRenderOnce = isVirtual && QOnce in props;
    if (isRenderOnce) {
      return;
    }
    return smartUpdateChildren(rctx, oldVnode, newVnode, "root", flags);
  }
  let needsRender = setComponentProps(elCtx, rctx, props);
  if (!needsRender && !elCtx.$renderQrl$ && !elCtx.$element$.hasAttribute(ELEMENT_ID)) {
    setQId(rctx, elCtx);
    elCtx.$renderQrl$ = props[OnRenderProp];
    assertQrl(elCtx.$renderQrl$);
    needsRender = true;
  }
  if (needsRender) {
    return then(renderComponent(rctx, elCtx, flags), () => renderContentProjection(rctx, elCtx, newVnode, flags));
  }
  return renderContentProjection(rctx, elCtx, newVnode, flags);
};
const renderContentProjection = (rctx, hostCtx, vnode, flags) => {
  const newChildren = vnode.$children$;
  const staticCtx = rctx.$static$;
  const splittedNewChidren = splitChildren(newChildren);
  const slotRctx = pushRenderContext(rctx, hostCtx);
  const slotMaps = getSlotMap(hostCtx);
  Object.entries(slotMaps.slots).forEach(([key, slotEl]) => {
    if (!splittedNewChidren[key]) {
      const oldCh = getChildrenVnodes(slotEl, "root");
      if (oldCh.length > 0) {
        const slotCtx = tryGetContext(slotEl);
        if (slotCtx && slotCtx.$vdom$) {
          slotCtx.$vdom$.$children$ = [];
        }
        removeVnodes(staticCtx, oldCh, 0, oldCh.length - 1);
      }
    }
  });
  Object.entries(slotMaps.templates).forEach(([key, templateEl]) => {
    if (templateEl) {
      if (!splittedNewChidren[key] || slotMaps.slots[key]) {
        removeNode(staticCtx, templateEl);
        slotMaps.templates[key] = void 0;
      }
    }
  });
  return promiseAll(Object.entries(splittedNewChidren).map(([key, newVdom]) => {
    const slotElm = getSlotElement(staticCtx, slotMaps, hostCtx.$element$, key);
    const slotCtx = getContext(slotElm);
    const oldVdom = getVdom(slotCtx);
    slotCtx.$vdom$ = newVdom;
    newVdom.$elm$ = slotElm;
    return smartUpdateChildren(slotRctx, oldVdom, newVdom, "root", flags);
  }));
};
const addVnodes = (ctx, parentElm, before, vnodes, startIdx, endIdx, flags) => {
  const promises = [];
  let hasPromise = false;
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    assertDefined(ch, "render: node must be defined at index", startIdx, vnodes);
    const elm = createElm(ctx, ch, flags);
    promises.push(elm);
    if (isPromise(elm)) {
      hasPromise = true;
    }
  }
  if (hasPromise) {
    return Promise.all(promises).then((children) => insertChildren(ctx.$static$, parentElm, children, before));
  } else {
    insertChildren(ctx.$static$, parentElm, promises, before);
  }
};
const insertChildren = (ctx, parentElm, children, before) => {
  for (const child of children) {
    insertBefore(ctx, parentElm, child, before);
  }
};
const removeVnodes = (ctx, nodes, startIdx, endIdx) => {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = nodes[startIdx];
    if (ch) {
      assertDefined(ch.$elm$, "vnode elm must be defined");
      removeNode(ctx, ch.$elm$);
    }
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
  prepend(ctx, parentEl, template);
  slotMaps.templates[slotName] = template;
  return template;
};
const getSlotName = (node) => {
  var _a;
  return (_a = node.$props$[QSlot]) != null ? _a : "";
};
const createElm = (rctx, vnode, flags) => {
  const tag = vnode.$type$;
  const doc = rctx.$static$.$doc$;
  if (tag === "#text") {
    return vnode.$elm$ = createTextNode(doc, vnode.$text$);
  }
  let elm;
  let isHead = !!(flags & IS_HEAD$1);
  let isSvg = !!(flags & IS_SVG);
  if (!isSvg && tag === "svg") {
    flags |= IS_SVG;
    isSvg = true;
  }
  const isVirtual = tag === VIRTUAL;
  const props = vnode.$props$;
  const isComponent = OnRenderProp in props;
  const staticCtx = rctx.$static$;
  if (isVirtual) {
    elm = newVirtualElement(doc);
  } else if (tag === "head") {
    elm = doc.head;
    flags |= IS_HEAD$1;
    isHead = true;
  } else {
    elm = createElement(doc, tag, isSvg);
    flags &= ~IS_HEAD$1;
  }
  vnode.$elm$ = elm;
  if (isSvg && tag === "foreignObject") {
    isSvg = false;
    flags &= ~IS_SVG;
  }
  const elCtx = getContext(elm);
  if (isComponent) {
    setKey(elm, vnode.$key$);
    assertTrue(isVirtual, "component must be a virtual element");
    const renderQRL = props[OnRenderProp];
    assertQrl(renderQRL);
    setComponentProps(elCtx, rctx, props);
    setQId(rctx, elCtx);
    elCtx.$renderQrl$ = renderQRL;
    return then(renderComponent(rctx, elCtx, flags), () => {
      let children2 = vnode.$children$;
      if (children2.length === 0) {
        return elm;
      }
      if (children2.length === 1 && children2[0].$type$ === SKIP_RENDER_TYPE) {
        children2 = children2[0].$children$;
      }
      const slotRctx = pushRenderContext(rctx, elCtx);
      const slotMap = getSlotMap(elCtx);
      const elements = children2.map((ch) => createElm(slotRctx, ch, flags));
      return then(promiseAll(elements), () => {
        for (const node of children2) {
          assertDefined(node.$elm$, "vnode elm must be defined");
          appendChild(staticCtx, getSlotElement(staticCtx, slotMap, elm, getSlotName(node)), node.$elm$);
        }
        return elm;
      });
    });
  }
  const currentComponent = rctx.$cmpCtx$;
  const isSlot = isVirtual && QSlotS in props;
  const hasRef = !isVirtual && "ref" in props;
  const listenerMap = setProperties(staticCtx, elCtx, props, isSvg);
  if (currentComponent && !isVirtual) {
    const scopedIds = currentComponent.$scopeIds$;
    if (scopedIds) {
      scopedIds.forEach((styleId) => {
        elm.classList.add(styleId);
      });
    }
    if (!currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      Object.entries(currentComponent.li).forEach(([eventName, qrls]) => {
        addQRLListener(listenerMap, eventName, qrls);
      });
    }
  }
  if (isSlot) {
    assertDefined(currentComponent, "slot can only be used inside component");
    assertDefined(currentComponent.$slots$, "current component slots must be a defined array");
    setKey(elm, vnode.$key$);
    directSetAttribute(elm, QSlotRef, currentComponent.$id$);
    currentComponent.$slots$.push(vnode);
    staticCtx.$addSlots$.push([elm, currentComponent.$element$]);
  } else if (qSerialize) {
    setKey(elm, vnode.$key$);
  }
  if (qSerialize) {
    const listeners = Object.entries(listenerMap);
    if (isHead && !isVirtual) {
      directSetAttribute(elm, "q:head", "");
    }
    if (listeners.length > 0 || hasRef) {
      setQId(rctx, elCtx);
    }
    listeners.forEach(([key, qrls]) => {
      setAttribute(staticCtx, elm, key, serializeQRLs(qrls, elCtx));
    });
  }
  const setsInnerHTML = props[dangerouslySetInnerHTML] !== void 0;
  if (setsInnerHTML) {
    if (qDev$1 && vnode.$children$.length > 0) {
      logWarn("Node can not have children when innerHTML is set");
    }
    return elm;
  }
  let children = vnode.$children$;
  if (children.length === 0) {
    return elm;
  }
  if (children.length === 1 && children[0].$type$ === SKIP_RENDER_TYPE) {
    children = children[0].$children$;
  }
  const promises = children.map((ch) => createElm(rctx, ch, flags));
  return then(promiseAll(promises), () => {
    for (const node of children) {
      assertDefined(node.$elm$, "vnode elm must be defined");
      appendChild(rctx.$static$, elm, node.$elm$);
    }
    return elm;
  });
};
const getSlots = (ctx) => {
  const slots = ctx.$slots$;
  if (!slots) {
    const parent = ctx.$element$.parentElement;
    assertDefined(parent, "component should be already attached to the dom");
    return ctx.$slots$ = readDOMSlots(ctx);
  }
  return slots;
};
const getSlotMap = (ctx) => {
  var _a, _b;
  const slotsArray = getSlots(ctx);
  const slots = {};
  const templates = {};
  const t = Array.from(ctx.$element$.childNodes).filter(isSlotTemplate);
  for (const vnode of slotsArray) {
    assertQwikElement(vnode.$elm$);
    slots[(_a = vnode.$key$) != null ? _a : ""] = vnode.$elm$;
  }
  for (const elm of t) {
    templates[(_b = directGetAttribute(elm, QSlot)) != null ? _b : ""] = elm;
  }
  return { slots, templates };
};
const readDOMSlots = (ctx) => {
  const parent = ctx.$element$.parentElement;
  assertDefined(parent, "component should be already attached to the dom");
  return queryAllVirtualByAttribute(parent, QSlotRef, ctx.$id$).map(domToVnode);
};
const handleStyle = (ctx, elm, _, newValue) => {
  setProperty$1(ctx, elm.style, "cssText", stringifyStyle(newValue));
  return true;
};
const handleClass = (ctx, elm, _, newValue, oldValue) => {
  const oldClasses = parseClassAny(oldValue);
  const newClasses = parseClassAny(newValue);
  setClasslist(ctx, elm, oldClasses.filter((c) => c && !newClasses.includes(c)), newClasses.filter((c) => c && !oldClasses.includes(c)));
  return true;
};
const checkBeforeAssign = (ctx, elm, prop, newValue) => {
  if (prop in elm) {
    if (elm[prop] !== newValue) {
      setProperty$1(ctx, elm, prop, newValue);
    }
  }
  return true;
};
const dangerouslySetInnerHTML = "dangerouslySetInnerHTML";
const setInnerHTML = (ctx, elm, _, newValue) => {
  if (dangerouslySetInnerHTML in elm) {
    setProperty$1(ctx, elm, dangerouslySetInnerHTML, newValue);
  } else if ("innerHTML" in elm) {
    setProperty$1(ctx, elm, "innerHTML", newValue);
  }
  return true;
};
const noop = () => {
  return true;
};
const PROP_HANDLER_MAP = {
  style: handleStyle,
  class: handleClass,
  className: handleClass,
  value: checkBeforeAssign,
  checked: checkBeforeAssign,
  [dangerouslySetInnerHTML]: setInnerHTML,
  innerHTML: noop
};
const updateProperties$1 = (elCtx, staticCtx, oldProps, newProps, isSvg) => {
  const keys = getKeys(oldProps, newProps);
  const listenersMap = elCtx.li = {};
  if (keys.length === 0) {
    return listenersMap;
  }
  const elm = elCtx.$element$;
  for (const key of keys) {
    if (key === "children") {
      continue;
    }
    const newValue = newProps[key];
    const oldValue = oldProps[key];
    if (oldValue === newValue) {
      continue;
    }
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      setEvent(listenersMap, key, newValue);
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    if (exception) {
      if (exception(staticCtx, elm, key, newValue, oldValue)) {
        continue;
      }
    }
    if (!isSvg && key in elm) {
      setProperty$1(staticCtx, elm, key, newValue);
      continue;
    }
    setAttribute(staticCtx, elm, key, newValue);
  }
  return listenersMap;
};
const getKeys = (oldProps, newProps) => {
  const keys = Object.keys(newProps);
  keys.push(...Object.keys(oldProps).filter((p) => !keys.includes(p)));
  return keys;
};
const addGlobalListener = (staticCtx, elm, prop) => {
  if (!qSerialize && prop.includes(":")) {
    setAttribute(staticCtx, elm, prop, "");
  }
};
const setProperties = (rctx, elCtx, newProps, isSvg) => {
  const elm = elCtx.$element$;
  const keys = Object.keys(newProps);
  const listenerMap = elCtx.li;
  if (keys.length === 0) {
    return listenerMap;
  }
  for (const key of keys) {
    if (key === "children") {
      continue;
    }
    const newValue = newProps[key];
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      addGlobalListener(rctx, elm, setEvent(listenerMap, key, newValue));
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    if (exception) {
      if (exception(rctx, elm, key, newValue, void 0)) {
        continue;
      }
    }
    if (!isSvg && key in elm) {
      setProperty$1(rctx, elm, key, newValue);
      continue;
    }
    setAttribute(rctx, elm, key, newValue);
  }
  return listenerMap;
};
const setComponentProps = (ctx, rctx, expectProps) => {
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return false;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$static$.$containerState$);
  for (const key of keys) {
    if (SKIPS_PROPS.includes(key)) {
      continue;
    }
    qwikProps.set(key, expectProps[key]);
  }
  return ctx.$dirty$;
};
const cleanupTree = (parent, rctx, subsManager, stopSlots) => {
  if (stopSlots && parent.hasAttribute(QSlotS)) {
    rctx.$rmSlots$.push(parent);
    return;
  }
  cleanupElement(parent, subsManager);
  const ch = getChildren(parent, "elements");
  for (const child of ch) {
    cleanupTree(child, rctx, subsManager, stopSlots);
  }
};
const cleanupElement = (el, subsManager) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    cleanupContext(ctx, subsManager);
  }
};
const executeContextWithSlots = ({ $static$: ctx }) => {
  executeDOMRender(ctx);
};
const directAppendChild = (parent, child) => {
  if (isVirtualElement(child)) {
    child.appendTo(parent);
  } else {
    parent.appendChild(child);
  }
};
const directRemoveChild = (parent, child) => {
  if (isVirtualElement(child)) {
    child.remove();
  } else {
    parent.removeChild(child);
  }
};
const directInsertBefore = (parent, child, ref) => {
  if (isVirtualElement(child)) {
    child.insertBeforeTo(parent, getRootNode(ref));
  } else {
    parent.insertBefore(child, getRootNode(ref));
  }
};
const createKeyToOldIdx = (children, beginIdx, endIdx) => {
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const child = children[i];
    const key = child.$key$;
    if (key != null) {
      map[key] = i;
    }
  }
  return map;
};
const sameVnode = (vnode1, vnode2) => {
  if (vnode1.$type$ !== vnode2.$type$) {
    return false;
  }
  return vnode1.$key$ === vnode2.$key$;
};
const isTagName = (elm, tagName) => {
  return elm.$type$ === tagName;
};
const useLexicalScope = () => {
  const context = getInvokeContext();
  let qrl = context.$qrl$;
  if (!qrl) {
    const el = context.$element$;
    assertDefined(el, "invoke: element must be defined inside useLexicalScope()", context);
    const container = getWrappingContainer(el);
    const ctx = getContext(el);
    assertDefined(container, `invoke: cant find parent q:container of`, el);
    qrl = parseQRL(decodeURIComponent(String(context.$url$)), container);
    assertQrl(qrl);
    resumeIfNeeded(container);
    inflateQrl(qrl, ctx);
  } else {
    assertQrl(qrl);
    assertDefined(qrl.$captureRef$, "invoke: qrl $captureRef$ must be defined inside useLexicalScope()", qrl);
  }
  return qrl.$captureRef$;
};
const notifyChange = (subscriber, containerState) => {
  if (isQwikElement(subscriber)) {
    notifyRender(subscriber, containerState);
  } else {
    notifyWatch(subscriber, containerState);
  }
};
const notifyRender = (hostElement, containerState) => {
  const isServer2 = qDynamicPlatform && !qTest && containerState.$platform$.isServer;
  if (!isServer2) {
    resumeIfNeeded(containerState.$containerEl$);
  }
  const ctx = getContext(hostElement);
  assertDefined(ctx.$renderQrl$, `render: notified host element must have a defined $renderQrl$`, ctx);
  if (ctx.$dirty$) {
    return;
  }
  ctx.$dirty$ = true;
  const activeRendering = containerState.$hostsRendering$ !== void 0;
  if (activeRendering) {
    assertDefined(containerState.$renderPromise$, "render: while rendering, $renderPromise$ must be defined", containerState);
    containerState.$hostsStaging$.add(hostElement);
  } else {
    if (isServer2) {
      logWarn("Can not rerender in server platform");
      return void 0;
    }
    containerState.$hostsNext$.add(hostElement);
    scheduleFrame(containerState);
  }
};
const notifyWatch = (watch, containerState) => {
  if (watch.$flags$ & WatchFlagsIsDirty) {
    return;
  }
  watch.$flags$ |= WatchFlagsIsDirty;
  const activeRendering = containerState.$hostsRendering$ !== void 0;
  if (activeRendering) {
    assertDefined(containerState.$renderPromise$, "render: while rendering, $renderPromise$ must be defined", containerState);
    containerState.$watchStaging$.add(watch);
  } else {
    containerState.$watchNext$.add(watch);
    scheduleFrame(containerState);
  }
};
const scheduleFrame = (containerState) => {
  if (containerState.$renderPromise$ === void 0) {
    containerState.$renderPromise$ = containerState.$platform$.nextTick(() => renderMarked(containerState));
  }
  return containerState.$renderPromise$;
};
const _hW = () => {
  const [watch] = useLexicalScope();
  notifyWatch(watch, getContainerState(getWrappingContainer(watch.$el$)));
};
const renderMarked = async (containerState) => {
  const hostsRendering = containerState.$hostsRendering$ = new Set(containerState.$hostsNext$);
  containerState.$hostsNext$.clear();
  await executeWatchesBefore(containerState);
  containerState.$hostsStaging$.forEach((host) => {
    hostsRendering.add(host);
  });
  containerState.$hostsStaging$.clear();
  const doc = getDocument(containerState.$containerEl$);
  const platform = containerState.$platform$;
  const renderingQueue = Array.from(hostsRendering);
  sortNodes(renderingQueue);
  const ctx = createRenderContext(doc, containerState);
  const staticCtx = ctx.$static$;
  for (const el of renderingQueue) {
    if (!staticCtx.$hostElements$.has(el)) {
      const elCtx = getContext(el);
      if (elCtx.$renderQrl$) {
        assertTrue(el.isConnected, "element must be connected to the dom");
        staticCtx.$roots$.push(elCtx);
        try {
          await renderComponent(ctx, elCtx, getFlags(el.parentElement));
        } catch (e) {
          logError(codeToText(QError_errorWhileRendering), e);
        }
      }
    }
  }
  staticCtx.$operations$.push(...staticCtx.$postOperations$);
  if (staticCtx.$operations$.length === 0) {
    printRenderStats(staticCtx);
    postRendering(containerState, staticCtx);
    return ctx;
  }
  return platform.raf(() => {
    executeContextWithSlots(ctx);
    printRenderStats(staticCtx);
    postRendering(containerState, staticCtx);
    return ctx;
  });
};
const getFlags = (el) => {
  let flags = 0;
  if (el) {
    if (el.namespaceURI === SVG_NS) {
      flags |= IS_SVG;
    }
    if (el.tagName === "HEAD") {
      flags |= IS_HEAD$1;
    }
  }
  return flags;
};
const postRendering = async (containerState, ctx) => {
  await executeWatchesAfter(containerState, (watch, stage) => {
    if ((watch.$flags$ & WatchFlagsIsEffect) === 0) {
      return false;
    }
    if (stage) {
      return ctx.$hostElements$.has(watch.$el$);
    }
    return true;
  });
  containerState.$hostsStaging$.forEach((el) => {
    containerState.$hostsNext$.add(el);
  });
  containerState.$hostsStaging$.clear();
  containerState.$hostsRendering$ = void 0;
  containerState.$renderPromise$ = void 0;
  if (containerState.$hostsNext$.size + containerState.$watchNext$.size > 0) {
    scheduleFrame(containerState);
  }
};
const executeWatchesBefore = async (containerState) => {
  const resourcesPromises = [];
  const watchPromises = [];
  const isWatch = (watch) => (watch.$flags$ & WatchFlagsIsWatch) !== 0;
  const isResourceWatch2 = (watch) => (watch.$flags$ & WatchFlagsIsResource) !== 0;
  containerState.$watchNext$.forEach((watch) => {
    if (isWatch(watch)) {
      watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      containerState.$watchNext$.delete(watch);
    }
    if (isResourceWatch2(watch)) {
      resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      containerState.$watchNext$.delete(watch);
    }
  });
  do {
    containerState.$watchStaging$.forEach((watch) => {
      if (isWatch(watch)) {
        watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      } else if (isResourceWatch2(watch)) {
        resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      } else {
        containerState.$watchNext$.add(watch);
      }
    });
    containerState.$watchStaging$.clear();
    if (watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      await Promise.all(watches.map((watch) => {
        return runSubscriber(watch, containerState);
      }));
      watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
  if (resourcesPromises.length > 0) {
    const resources = await Promise.all(resourcesPromises);
    sortWatches(resources);
    resources.forEach((watch) => runSubscriber(watch, containerState));
  }
};
const executeWatchesAfter = async (containerState, watchPred) => {
  const watchPromises = [];
  containerState.$watchNext$.forEach((watch) => {
    if (watchPred(watch, false)) {
      watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      containerState.$watchNext$.delete(watch);
    }
  });
  do {
    containerState.$watchStaging$.forEach((watch) => {
      if (watchPred(watch, true)) {
        watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      } else {
        containerState.$watchNext$.add(watch);
      }
    });
    containerState.$watchStaging$.clear();
    if (watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      await Promise.all(watches.map((watch) => {
        return runSubscriber(watch, containerState);
      }));
      watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
};
const sortNodes = (elements) => {
  elements.sort((a, b) => a.compareDocumentPosition(getRootNode(b)) & 2 ? 1 : -1);
};
const sortWatches = (watches) => {
  watches.sort((a, b) => {
    if (a.$el$ === b.$el$) {
      return a.$index$ < b.$index$ ? -1 : 1;
    }
    return (a.$el$.compareDocumentPosition(getRootNode(b.$el$)) & 2) !== 0 ? 1 : -1;
  });
};
const CONTAINER_STATE = Symbol("ContainerState");
const getContainerState = (containerEl) => {
  let set = containerEl[CONTAINER_STATE];
  if (!set) {
    containerEl[CONTAINER_STATE] = set = {
      $containerEl$: containerEl,
      $proxyMap$: /* @__PURE__ */ new WeakMap(),
      $subsManager$: null,
      $platform$: getPlatform(containerEl),
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
    seal(set);
    set.$subsManager$ = createSubscriptionManager(set);
  }
  return set;
};
const createSubscriptionManager = (containerState) => {
  const objToSubs = /* @__PURE__ */ new Map();
  const subsToObjs = /* @__PURE__ */ new Map();
  const clearSub = (sub) => {
    const subs = subsToObjs.get(sub);
    if (subs) {
      subs.forEach((s) => {
        s.delete(sub);
      });
      subsToObjs.delete(sub);
      subs.clear();
    }
  };
  const tryGetLocal = (obj) => {
    assertEqual(getProxyTarget(obj), void 0, "object can not be be a proxy", obj);
    return objToSubs.get(obj);
  };
  const trackSubToObj = (subscriber, map) => {
    let set = subsToObjs.get(subscriber);
    if (!set) {
      subsToObjs.set(subscriber, set = /* @__PURE__ */ new Set());
    }
    set.add(map);
  };
  const getLocal = (obj, initialMap) => {
    let local = tryGetLocal(obj);
    if (local) {
      assertEqual(initialMap, void 0, "subscription map can not be set to an existing object", local);
    } else {
      const map = !initialMap ? /* @__PURE__ */ new Map() : initialMap;
      map.forEach((_, key) => {
        trackSubToObj(key, map);
      });
      objToSubs.set(obj, local = {
        $subs$: map,
        $addSub$(subscriber, key) {
          if (key == null) {
            map.set(subscriber, null);
          } else {
            let sub = map.get(subscriber);
            if (sub === void 0) {
              map.set(subscriber, sub = /* @__PURE__ */ new Set());
            }
            if (sub) {
              sub.add(key);
            }
          }
          trackSubToObj(subscriber, map);
        },
        $notifySubs$(key) {
          map.forEach((value, subscriber) => {
            if (value === null || !key || value.has(key)) {
              notifyChange(subscriber, containerState);
            }
          });
        }
      });
      seal(local);
    }
    return local;
  };
  const manager = {
    $tryGetLocal$: tryGetLocal,
    $getLocal$: getLocal,
    $clearSub$: clearSub
  };
  seal(manager);
  return manager;
};
const pauseContainer = async (elmOrDoc, defaultParentJSON) => {
  const doc = getDocument(elmOrDoc);
  const documentElement = doc.documentElement;
  const containerEl = isDocument(elmOrDoc) ? documentElement : elmOrDoc;
  if (directGetAttribute(containerEl, QContainerAttr) === "paused") {
    throw qError(QError_containerAlreadyPaused);
  }
  const parentJSON = defaultParentJSON != null ? defaultParentJSON : containerEl === doc.documentElement ? doc.body : containerEl;
  const data2 = await pauseFromContainer(containerEl);
  const script = doc.createElement("script");
  directSetAttribute(script, "type", "qwik/json");
  script.textContent = escapeText$1(JSON.stringify(data2.state, void 0, qDev$1 ? "  " : void 0));
  parentJSON.appendChild(script);
  directSetAttribute(containerEl, QContainerAttr, "paused");
  return data2;
};
const moveStyles = (containerEl, containerState) => {
  const head2 = containerEl.ownerDocument.head;
  containerEl.querySelectorAll("style[q\\:style]").forEach((el) => {
    containerState.$styleIds$.add(directGetAttribute(el, QStyle));
    head2.appendChild(el);
  });
};
const resumeContainer = (containerEl) => {
  if (!isContainer(containerEl)) {
    logWarn("Skipping hydration because parent element is not q:container");
    return;
  }
  const doc = getDocument(containerEl);
  const isDocElement = containerEl === doc.documentElement;
  const parentJSON = isDocElement ? doc.body : containerEl;
  const script = getQwikJSON(parentJSON);
  if (!script) {
    logWarn("Skipping hydration qwik/json metadata was not found.");
    return;
  }
  script.remove();
  const containerState = getContainerState(containerEl);
  moveStyles(containerEl, containerState);
  const meta = JSON.parse(unescapeText(script.textContent || "{}"));
  const elements = /* @__PURE__ */ new Map();
  const getObject = (id) => {
    return getObjectImpl(id, elements, meta.objs, containerState);
  };
  let maxId = 0;
  getNodesInScope(containerEl, hasQId).forEach((el) => {
    const id = directGetAttribute(el, ELEMENT_ID);
    assertDefined(id, `resume: element missed q:id`, el);
    const ctx = getContext(el);
    ctx.$id$ = id;
    ctx.$mounted$ = true;
    elements.set(ELEMENT_ID_PREFIX + id, el);
    maxId = Math.max(maxId, strToInt(id));
  });
  containerState.$elementIndex$ = ++maxId;
  const parser = createParser(getObject, containerState, doc);
  reviveValues(meta.objs, meta.subs, getObject, containerState, parser);
  for (const obj of meta.objs) {
    reviveNestedObjects(obj, getObject, parser);
  }
  Object.entries(meta.ctx).forEach(([elementID, ctxMeta]) => {
    const el = getObject(elementID);
    assertDefined(el, `resume: cant find dom node for id`, elementID);
    const ctx = getContext(el);
    const qobj = ctxMeta.r;
    const seq = ctxMeta.s;
    const host = ctxMeta.h;
    const contexts = ctxMeta.c;
    const watches = ctxMeta.w;
    if (qobj) {
      assertTrue(isElement(el), "el must be an actual DOM element");
      ctx.$refMap$.push(...qobj.split(" ").map(getObject));
      ctx.li = getDomListeners(ctx, containerEl);
    }
    if (seq) {
      ctx.$seq$ = seq.split(" ").map(getObject);
    }
    if (watches) {
      ctx.$watches$ = watches.split(" ").map(getObject);
    }
    if (contexts) {
      contexts.split(" ").map((part) => {
        const [key, value] = part.split("=");
        if (!ctx.$contexts$) {
          ctx.$contexts$ = /* @__PURE__ */ new Map();
        }
        ctx.$contexts$.set(key, getObject(value));
      });
    }
    if (host) {
      const [props, renderQrl] = host.split(" ");
      assertDefined(props, `resume: props missing in host metadata`, host);
      assertDefined(renderQrl, `resume: renderQRL missing in host metadata`, host);
      ctx.$props$ = getObject(props);
      ctx.$renderQrl$ = getObject(renderQrl);
    }
  });
  directSetAttribute(containerEl, QContainerAttr, "resumed");
  logDebug("Container resumed");
  emitEvent(containerEl, "qresume", void 0, true);
};
const pauseFromContainer = async (containerEl) => {
  const containerState = getContainerState(containerEl);
  const contexts = getNodesInScope(containerEl, hasQId).map(tryGetContext);
  return _pauseFromContexts(contexts, containerState);
};
const _pauseFromContexts = async (elements, containerState) => {
  const elementToIndex = /* @__PURE__ */ new Map();
  const collector = createCollector(containerState);
  const listeners = [];
  for (const ctx of elements) {
    const el = ctx.$element$;
    if (isElement(el)) {
      Object.entries(ctx.li).forEach(([key, qrls]) => {
        qrls.forEach((qrl) => {
          listeners.push({
            key,
            qrl,
            el
          });
        });
      });
    }
    if (ctx.$watches$) {
      for (const watch of ctx.$watches$) {
        collector.$watches$.push(watch);
      }
    }
  }
  if (listeners.length === 0) {
    return {
      state: {
        ctx: {},
        objs: [],
        subs: []
      },
      objs: [],
      listeners: [],
      pendingContent: [],
      mode: "static"
    };
  }
  for (const listener of listeners) {
    assertQrl(listener.qrl);
    const captured = listener.qrl.$captureRef$;
    if (captured) {
      for (const obj of captured) {
        await collectValue(obj, collector, true);
      }
    }
    const ctx = tryGetContext(listener.el);
    for (const obj of ctx.$refMap$) {
      await collectValue(obj, collector, true);
    }
  }
  const canRender = collector.$elements$.length > 0;
  if (canRender) {
    for (const ctx of elements) {
      if (isVirtualElement(ctx.$element$)) {
        await collectProps(ctx.$element$, ctx.$props$, collector);
      }
      if (ctx.$contexts$) {
        for (const item of ctx.$contexts$.values()) {
          await collectValue(item, collector, false);
        }
      }
    }
  }
  const objs = Array.from(new Set(collector.$objMap$.values()));
  const objToId = /* @__PURE__ */ new Map();
  const getElementID = (el) => {
    let id = elementToIndex.get(el);
    if (id === void 0) {
      if (el.isConnected) {
        id = getQId(el);
        if (!id) {
          console.warn("Missing ID", el);
        } else {
          id = ELEMENT_ID_PREFIX + id;
        }
      } else {
        id = null;
      }
      elementToIndex.set(el, id);
    }
    return id;
  };
  const getObjId = (obj) => {
    let suffix = "";
    if (isMutable(obj)) {
      obj = obj.v;
      suffix = "%";
    }
    if (isPromise(obj)) {
      const { value, resolved } = getPromiseValue(obj);
      obj = value;
      if (resolved) {
        suffix += "~";
      } else {
        suffix += "_";
      }
    }
    if (isObject(obj)) {
      const target = getProxyTarget(obj);
      if (target) {
        suffix += "!";
        obj = target;
      }
      if (!target && isQwikElement(obj)) {
        const elID = getElementID(obj);
        if (elID) {
          return elID + suffix;
        }
        return null;
      }
    }
    if (collector.$objMap$.has(obj)) {
      const value = collector.$objMap$.get(obj);
      const id = objToId.get(value);
      assertTrue(typeof id === "number", "Can not find ID for object");
      return intToStr(id) + suffix;
    }
    return null;
  };
  const mustGetObjId = (obj) => {
    const key = getObjId(obj);
    if (key === null) {
      throw qError(QError_missingObjectId, obj);
    }
    return key;
  };
  const subsMap = /* @__PURE__ */ new Map();
  objs.forEach((obj) => {
    var _a;
    const flags = getProxyFlags(containerState.$proxyMap$.get(obj));
    if (flags === void 0) {
      return;
    }
    const subsObj = [];
    if (flags > 0) {
      subsObj.push({
        subscriber: "$",
        data: flags
      });
    }
    const subs2 = (_a = containerState.$subsManager$.$tryGetLocal$(obj)) == null ? void 0 : _a.$subs$;
    if (subs2) {
      subs2.forEach((set, key) => {
        if (isNode(key) && isVirtualElement(key)) {
          if (!collector.$elements$.includes(key)) {
            return;
          }
        }
        subsObj.push({
          subscriber: key,
          data: set ? Array.from(set) : null
        });
      });
    }
    if (subsObj.length > 0) {
      subsMap.set(obj, subsObj);
    }
  });
  objs.sort((a, b) => {
    const isProxyA = subsMap.has(a) ? 0 : 1;
    const isProxyB = subsMap.has(b) ? 0 : 1;
    return isProxyA - isProxyB;
  });
  let count = 0;
  for (const obj of objs) {
    objToId.set(obj, count);
    count++;
  }
  const subs = objs.map((obj) => {
    const sub = subsMap.get(obj);
    if (!sub) {
      return null;
    }
    const subsObj = {};
    sub.forEach(({ subscriber, data: data2 }) => {
      if (subscriber === "$") {
        subsObj[subscriber] = data2;
      } else {
        const id = getObjId(subscriber);
        if (id !== null) {
          subsObj[id] = data2;
        }
      }
    });
    return subsObj;
  }).filter(isNotNullable);
  const convertedObjs = objs.map((obj) => {
    if (obj === null) {
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
        if (value !== void 0) {
          return value;
        }
        if (typeObj === "object") {
          if (isArray(obj)) {
            return obj.map(mustGetObjId);
          }
          if (isSerializableObject(obj)) {
            const output = {};
            Object.entries(obj).forEach(([key, value2]) => {
              output[key] = mustGetObjId(value2);
            });
            return output;
          }
        }
        break;
    }
    throw qError(QError_verifySerializable, obj);
  });
  const meta = {};
  elements.forEach((ctx) => {
    const node = ctx.$element$;
    assertDefined(ctx, `pause: missing context for dom node`, node);
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
      if (value) {
        metaValue.r = value;
        add = true;
      }
    }
    if (canRender) {
      if (elementCaptured && props) {
        const objs2 = [props];
        if (renderQrl) {
          objs2.push(renderQrl);
        }
        const value = objs2.map(mustGetObjId).join(" ");
        if (value) {
          metaValue.h = value;
          add = true;
        }
      }
      if (watches && watches.length > 0) {
        const value = watches.map(getObjId).filter(isNotNullable).join(" ");
        if (value) {
          metaValue.w = value;
          add = true;
        }
      }
      if (elementCaptured && seq && seq.length > 0) {
        const value = seq.map(mustGetObjId).join(" ");
        if (value) {
          metaValue.s = value;
          add = true;
        }
      }
      if (contexts) {
        const serializedContexts = [];
        contexts.forEach((value2, key) => {
          serializedContexts.push(`${key}=${mustGetObjId(value2)}`);
        });
        const value = serializedContexts.join(" ");
        if (value) {
          metaValue.c = value;
          add = true;
        }
      }
    }
    if (add) {
      const elementID = getElementID(node);
      assertDefined(elementID, `pause: can not generate ID for dom node`, node);
      meta[elementID] = metaValue;
    }
  });
  const pendingContent = [];
  for (const watch of collector.$watches$) {
    if (qDev$1) {
      if (watch.$flags$ & WatchFlagsIsDirty) {
        logWarn("Serializing dirty watch. Looks like an internal error.");
      }
      if (!isConnected(watch)) {
        logWarn("Serializing disconneted watch. Looks like an internal error.");
      }
    }
    destroyWatch(watch);
  }
  if (qDev$1) {
    elementToIndex.forEach((value, el) => {
      if (!value) {
        logWarn("unconnected element", el.nodeName, "\n");
      }
    });
  }
  return {
    state: {
      ctx: meta,
      objs: convertedObjs,
      subs
    },
    pendingContent,
    objs,
    listeners,
    mode: canRender ? "render" : "listeners"
  };
};
const getQwikJSON = (parentElm) => {
  let child = parentElm.lastElementChild;
  while (child) {
    if (child.tagName === "SCRIPT" && directGetAttribute(child, "type") === "qwik/json") {
      return child;
    }
    child = child.previousElementSibling;
  }
  return void 0;
};
const SHOW_ELEMENT = 1;
const SHOW_COMMENT = 128;
const FILTER_ACCEPT = 1;
const FILTER_REJECT = 2;
const FILTER_SKIP = 3;
const getNodesInScope = (parent, predicate) => {
  if (predicate(parent))
    ;
  const walker = parent.ownerDocument.createTreeWalker(parent, SHOW_ELEMENT | SHOW_COMMENT, {
    acceptNode(node) {
      if (isContainer(node)) {
        return FILTER_REJECT;
      }
      return predicate(node) ? FILTER_ACCEPT : FILTER_SKIP;
    }
  });
  const pars = [];
  let currentNode = null;
  while (currentNode = walker.nextNode()) {
    pars.push(processVirtualNodes(currentNode));
  }
  return pars;
};
const reviveValues = (objs, subs, getObject, containerState, parser) => {
  for (let i = 0; i < objs.length; i++) {
    const value = objs[i];
    if (isString(value)) {
      objs[i] = value === UNDEFINED_PREFIX ? void 0 : parser.prepare(value);
    }
  }
  for (let i = 0; i < subs.length; i++) {
    const value = objs[i];
    const sub = subs[i];
    if (sub) {
      const converted = /* @__PURE__ */ new Map();
      let flags = 0;
      Object.entries(sub).forEach((entry) => {
        if (entry[0] === "$") {
          flags = entry[1];
          return;
        }
        const el = getObject(entry[0]);
        if (!el) {
          logWarn("QWIK can not revive subscriptions because of missing element ID", entry, value);
          return;
        }
        const set = entry[1] === null ? null : new Set(entry[1]);
        converted.set(el, set);
      });
      createProxy(value, containerState, flags, converted);
    }
  }
};
const reviveNestedObjects = (obj, getObject, parser) => {
  if (parser.fill(obj)) {
    return;
  }
  if (obj && typeof obj == "object") {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        if (typeof value == "string") {
          obj[i] = getObject(value);
        } else {
          reviveNestedObjects(value, getObject, parser);
        }
      }
    } else if (isSerializableObject(obj)) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value == "string") {
            obj[key] = getObject(value);
          } else {
            reviveNestedObjects(value, getObject, parser);
          }
        }
      }
    }
  }
};
const OBJECT_TRANSFORMS = {
  "!": (obj, containerState) => {
    var _a;
    return (_a = containerState.$proxyMap$.get(obj)) != null ? _a : getOrCreateProxy(obj, containerState);
  },
  "%": (obj) => {
    return mutable(obj);
  },
  "~": (obj) => {
    return Promise.resolve(obj);
  },
  _: (obj) => {
    return Promise.reject(obj);
  }
};
const getObjectImpl = (id, elements, objs, containerState) => {
  assertTrue(typeof id === "string" && id.length > 0, "resume: id must be an non-empty string, got:", id);
  if (id.startsWith(ELEMENT_ID_PREFIX)) {
    assertTrue(elements.has(id), `missing element for id:`, id);
    return elements.get(id);
  }
  const index2 = strToInt(id);
  assertTrue(objs.length > index2, "resume: index is out of bounds", id);
  let obj = objs[index2];
  for (let i = id.length - 1; i >= 0; i--) {
    const code = id[i];
    const transform = OBJECT_TRANSFORMS[code];
    if (!transform) {
      break;
    }
    obj = transform(obj, containerState);
  }
  return obj;
};
const collectProps = async (el, props, collector) => {
  var _a;
  const subs = (_a = collector.$containerState$.$subsManager$.$tryGetLocal$(getProxyTarget(props))) == null ? void 0 : _a.$subs$;
  if (subs && subs.has(el)) {
    await collectElement(el, collector);
  }
};
const createCollector = (containerState) => {
  return {
    $seen$: /* @__PURE__ */ new Set(),
    $seenLeaks$: /* @__PURE__ */ new Set(),
    $objMap$: /* @__PURE__ */ new Map(),
    $elements$: [],
    $watches$: [],
    $containerState$: containerState
  };
};
const collectElement = async (el, collector) => {
  if (collector.$elements$.includes(el)) {
    return;
  }
  const ctx = tryGetContext(el);
  if (ctx) {
    collector.$elements$.push(el);
    if (ctx.$props$) {
      await collectValue(ctx.$props$, collector, false);
    }
    if (ctx.$renderQrl$) {
      await collectValue(ctx.$renderQrl$, collector, false);
    }
    if (ctx.$seq$) {
      for (const obj of ctx.$seq$) {
        await collectValue(obj, collector, false);
      }
    }
    if (ctx.$watches$) {
      for (const obj of ctx.$watches$) {
        await collectValue(obj, collector, false);
      }
    }
    if (ctx.$contexts$) {
      for (const obj of ctx.$contexts$.values()) {
        await collectValue(obj, collector, false);
      }
    }
  }
};
const escapeText$1 = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
const unescapeText = (str) => {
  return str.replace(/\\x3C(\/?script)/g, "<$1");
};
const collectSubscriptions = async (target, collector) => {
  var _a;
  const subs = (_a = collector.$containerState$.$subsManager$.$tryGetLocal$(target)) == null ? void 0 : _a.$subs$;
  if (subs) {
    if (collector.$seen$.has(subs)) {
      return;
    }
    collector.$seen$.add(subs);
    for (const key of Array.from(subs.keys())) {
      if (isNode(key) && isVirtualElement(key)) {
        await collectElement(key, collector);
      } else {
        await collectValue(key, collector, true);
      }
    }
  }
};
const PROMISE_VALUE = Symbol();
const resolvePromise = (promise) => {
  return promise.then((value) => {
    const v = {
      resolved: true,
      value
    };
    promise[PROMISE_VALUE] = v;
    return value;
  }, (value) => {
    const v = {
      resolved: false,
      value
    };
    promise[PROMISE_VALUE] = v;
    return value;
  });
};
const getPromiseValue = (promise) => {
  assertTrue(PROMISE_VALUE in promise, "pause: promise was not resolved previously", promise);
  return promise[PROMISE_VALUE];
};
const collectValue = async (obj, collector, leaks) => {
  const input = obj;
  const seen = leaks ? collector.$seenLeaks$ : collector.$seen$;
  if (seen.has(obj)) {
    return;
  }
  seen.add(obj);
  if (!shouldSerialize(obj) || obj === void 0) {
    collector.$objMap$.set(obj, void 0);
    return;
  }
  if (obj != null) {
    if (isQrl$1(obj)) {
      collector.$objMap$.set(obj, obj);
      if (obj.$captureRef$) {
        for (const item of obj.$captureRef$) {
          await collectValue(item, collector, leaks);
        }
      }
      return;
    }
    if (typeof obj === "object") {
      if (isPromise(obj)) {
        const value = await resolvePromise(obj);
        await collectValue(value, collector, leaks);
        return;
      }
      const target = getProxyTarget(obj);
      if (!target && isNode(obj)) {
        if (isDocument(obj)) {
          collector.$objMap$.set(obj, obj);
        } else if (!isQwikElement(obj)) {
          throw qError(QError_verifySerializable, obj);
        }
        return;
      }
      if (target) {
        if (leaks) {
          await collectSubscriptions(target, collector);
        }
        obj = target;
        if (seen.has(obj)) {
          return;
        }
        seen.add(obj);
        if (isResourceReturn(obj)) {
          collector.$objMap$.set(target, target);
          await collectValue(obj.promise, collector, leaks);
          await collectValue(obj.resolved, collector, leaks);
          return;
        }
      }
      collector.$objMap$.set(obj, obj);
      if (isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          await collectValue(input[i], collector, leaks);
        }
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            await collectValue(input[key], collector, leaks);
          }
        }
      }
      return;
    }
  }
  collector.$objMap$.set(obj, obj);
};
const isContainer = (el) => {
  return isElement(el) && el.hasAttribute(QContainerAttr);
};
const hasQId = (el) => {
  const node = processVirtualNodes(el);
  if (isQwikElement(node)) {
    return node.hasAttribute(ELEMENT_ID);
  }
  return false;
};
const intToStr = (nu) => {
  return nu.toString(36);
};
const strToInt = (nu) => {
  return parseInt(nu, 36);
};
const WatchFlagsIsEffect = 1 << 0;
const WatchFlagsIsWatch = 1 << 1;
const WatchFlagsIsDirty = 1 << 2;
const WatchFlagsIsCleanup = 1 << 3;
const WatchFlagsIsResource = 1 << 4;
const useWatchQrl = (qrl, opts) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (get) {
    return;
  }
  assertQrl(qrl);
  const el = ctx.$hostElement$;
  const containerState = ctx.$renderCtx$.$static$.$containerState$;
  const watch = new Watch(WatchFlagsIsDirty | WatchFlagsIsWatch, i, el, qrl, void 0);
  const elCtx = getContext(el);
  set(true);
  qrl.$resolveLazy$();
  if (!elCtx.$watches$) {
    elCtx.$watches$ = [];
  }
  elCtx.$watches$.push(watch);
  waitAndRun(ctx, () => runSubscriber(watch, containerState));
  if (isServer$1(ctx)) {
    useRunWatch(watch, opts == null ? void 0 : opts.eagerness);
  }
};
const isResourceWatch = (watch) => {
  return !!watch.$resource$;
};
const runSubscriber = async (watch, containerState) => {
  assertEqual(!!(watch.$flags$ & WatchFlagsIsDirty), true, "Resource is not dirty", watch);
  if (isResourceWatch(watch)) {
    await runResource(watch, containerState);
  } else {
    await runWatch(watch, containerState);
  }
};
const runResource = (watch, containerState, waitOn) => {
  watch.$flags$ &= ~WatchFlagsIsDirty;
  cleanupWatch(watch);
  const el = watch.$el$;
  const doc = getDocument(el);
  const invokationContext = newInvokeContext(doc, el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  const resource = watch.$resource$;
  assertDefined(resource, 'useResource: when running a resource, "watch.r" must be a defined.', watch);
  const track = (obj, prop) => {
    const target = getProxyTarget(obj);
    if (target) {
      const manager = subsManager.$getLocal$(target);
      manager.$addSub$(watch, prop);
    } else {
      logErrorAndStop(codeToText(QError_trackUseStore), obj);
    }
    if (prop) {
      return obj[prop];
    } else {
      return obj;
    }
  };
  const resourceTarget = unwrapProxy(resource);
  const opts = {
    track,
    cleanup(callback) {
      cleanups.push(callback);
    },
    previous: resourceTarget.resolved
  };
  let resolve;
  let reject;
  let done = false;
  const setState = (resolved, value) => {
    if (!done) {
      done = true;
      if (resolved) {
        done = true;
        resource.state = "resolved";
        resource.resolved = value;
        resource.error = void 0;
        resolve(value);
      } else {
        done = true;
        resource.state = "rejected";
        resource.resolved = void 0;
        resource.error = value;
        reject(value);
      }
      return true;
    }
    return false;
  };
  invoke(invokationContext, () => {
    resource.state = "pending";
    resource.resolved = void 0;
    resource.promise = new Promise((r, re) => {
      resolve = r;
      reject = re;
    });
  });
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const promise = safeCall(() => then(waitOn, () => watchFn(opts)), (value) => {
    setState(true, value);
  }, (reason) => {
    setState(false, reason);
  });
  const timeout = resourceTarget.timeout;
  if (timeout) {
    return Promise.race([
      promise,
      delay(timeout).then(() => {
        if (setState(false, "timeout")) {
          cleanupWatch(watch);
        }
      })
    ]);
  }
  return promise;
};
const runWatch = (watch, containerState) => {
  watch.$flags$ &= ~WatchFlagsIsDirty;
  cleanupWatch(watch);
  const el = watch.$el$;
  const doc = getDocument(el);
  const invokationContext = newInvokeContext(doc, el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const track = (obj, prop) => {
    const target = getProxyTarget(obj);
    if (target) {
      const manager = subsManager.$getLocal$(target);
      manager.$addSub$(watch, prop);
    } else {
      logErrorAndStop(codeToText(QError_trackUseStore), obj);
    }
    if (prop) {
      return obj[prop];
    } else {
      return obj;
    }
  };
  const cleanups = [];
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const opts = {
    track,
    cleanup(callback) {
      cleanups.push(callback);
    }
  };
  return safeCall(() => watchFn(opts), (returnValue) => {
    if (isFunction(returnValue)) {
      cleanups.push(returnValue);
    }
  }, (reason) => {
    logError(reason);
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
  if (watch.$flags$ & WatchFlagsIsCleanup) {
    watch.$flags$ &= ~WatchFlagsIsCleanup;
    const cleanup = watch.$qrl$;
    cleanup();
  } else {
    cleanupWatch(watch);
  }
};
const useRunWatch = (watch, eagerness) => {
  if (eagerness === "load") {
    useOn("qinit", getWatchHandlerQrl(watch));
  } else if (eagerness === "visible") {
    useOn("qvisible", getWatchHandlerQrl(watch));
  }
};
const getWatchHandlerQrl = (watch) => {
  const watchQrl = watch.$qrl$;
  const watchHandler = createQRL(watchQrl.$chunk$, "_hW", _hW, null, null, [watch], watchQrl.$symbol$);
  return watchHandler;
};
const isSubscriberDescriptor = (obj) => {
  return isObject(obj) && obj instanceof Watch;
};
const serializeWatch = (watch, getObjId) => {
  let value = `${intToStr(watch.$flags$)} ${intToStr(watch.$index$)} ${getObjId(watch.$qrl$)} ${getObjId(watch.$el$)}`;
  if (isResourceWatch(watch)) {
    value += ` ${getObjId(watch.$resource$)}`;
  }
  return value;
};
const parseWatch = (data2) => {
  const [flags, index2, qrl, el, resource] = data2.split(" ");
  return new Watch(strToInt(flags), strToInt(index2), el, qrl, resource);
};
class Watch {
  constructor($flags$, $index$, $el$, $qrl$, $resource$) {
    this.$flags$ = $flags$;
    this.$index$ = $index$;
    this.$el$ = $el$;
    this.$qrl$ = $qrl$;
    this.$resource$ = $resource$;
  }
}
const _createResourceReturn = (opts) => {
  const resource = {
    __brand: "resource",
    promise: void 0,
    resolved: void 0,
    error: void 0,
    state: "pending",
    timeout: opts == null ? void 0 : opts.timeout
  };
  return resource;
};
const isResourceReturn = (obj) => {
  return isObject(obj) && obj.__brand === "resource";
};
const serializeResource = (resource, getObjId) => {
  const state = resource.state;
  if (state === "resolved") {
    return `0 ${getObjId(resource.resolved)}`;
  } else if (state === "pending") {
    return `1`;
  } else {
    return `2 ${getObjId(resource.error)}`;
  }
};
const parseResourceReturn = (data2) => {
  const [first, id] = data2.split(" ");
  const result = _createResourceReturn(void 0);
  result.promise = Promise.resolve();
  if (first === "0") {
    result.state = "resolved";
    result.resolved = id;
  } else if (first === "1") {
    result.state = "pending";
    result.promise = new Promise(() => {
    });
  } else if (first === "2") {
    result.state = "rejected";
    result.error = id;
  }
  return result;
};
const UNDEFINED_PREFIX = "";
const QRLSerializer = {
  prefix: "",
  test: (v) => isQrl$1(v),
  serialize: (obj, getObjId, containerState) => {
    return stringifyQRL(obj, {
      $platform$: containerState.$platform$,
      $getObjId$: getObjId
    });
  },
  prepare: (data2, containerState) => {
    return parseQRL(data2, containerState.$containerEl$);
  },
  fill: (qrl, getObject) => {
    if (qrl.$capture$ && qrl.$capture$.length > 0) {
      qrl.$captureRef$ = qrl.$capture$.map(getObject);
      qrl.$capture$ = null;
    }
  }
};
const WatchSerializer = {
  prefix: "",
  test: (v) => isSubscriberDescriptor(v),
  serialize: (obj, getObjId) => serializeWatch(obj, getObjId),
  prepare: (data2) => parseWatch(data2),
  fill: (watch, getObject) => {
    watch.$el$ = getObject(watch.$el$);
    watch.$qrl$ = getObject(watch.$qrl$);
    if (watch.$resource$) {
      watch.$resource$ = getObject(watch.$resource$);
    }
  }
};
const ResourceSerializer = {
  prefix: "",
  test: (v) => isResourceReturn(v),
  serialize: (obj, getObjId) => {
    return serializeResource(obj, getObjId);
  },
  prepare: (data2) => {
    return parseResourceReturn(data2);
  },
  fill: (resource, getObject) => {
    if (resource.state === "resolved") {
      resource.resolved = getObject(resource.resolved);
      resource.promise = Promise.resolve(resource.resolved);
    } else if (resource.state === "rejected") {
      const p = Promise.reject(resource.error);
      p.catch(() => null);
      resource.error = getObject(resource.error);
      resource.promise = p;
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
  serialize: (obj) => {
    return obj.message;
  },
  prepare: (text) => {
    const err = new Error(text);
    err.stack = void 0;
    return err;
  },
  fill: void 0
};
const DocumentSerializer = {
  prefix: "",
  test: (v) => isDocument(v),
  serialize: void 0,
  prepare: (_, _c, doc) => {
    return doc;
  },
  fill: void 0
};
const SERIALIZABLE_STATE = Symbol("serializable-data");
const ComponentSerializer = {
  prefix: "",
  test: (obj) => isQwikComponent(obj),
  serialize: (obj, getObjId, containerState) => {
    const [qrl] = obj[SERIALIZABLE_STATE];
    return stringifyQRL(qrl, {
      $platform$: containerState.$platform$,
      $getObjId$: getObjId
    });
  },
  prepare: (data2, containerState) => {
    const optionsIndex = data2.indexOf("{");
    const qrlString = optionsIndex == -1 ? data2 : data2.slice(0, optionsIndex);
    const qrl = parseQRL(qrlString, containerState.$containerEl$);
    return componentQrl(qrl);
  },
  fill: (component, getObject) => {
    const [qrl] = component[SERIALIZABLE_STATE];
    if (qrl.$capture$ && qrl.$capture$.length > 0) {
      qrl.$captureRef$ = qrl.$capture$.map(getObject);
      qrl.$capture$ = null;
    }
  }
};
const PureFunctionSerializer = {
  prefix: "",
  test: (obj) => typeof obj === "function" && obj.__qwik_serializable__ !== void 0,
  serialize: (obj) => {
    return obj.toString();
  },
  prepare: (data2) => {
    const fn = new Function("return " + data2)();
    fn.__qwik_serializable__ = true;
    return fn;
  },
  fill: void 0
};
const serializers = [
  QRLSerializer,
  WatchSerializer,
  ResourceSerializer,
  URLSerializer,
  DateSerializer,
  RegexSerializer,
  ErrorSerializer,
  DocumentSerializer,
  ComponentSerializer,
  PureFunctionSerializer
];
const canSerialize = (obj) => {
  for (const s of serializers) {
    if (s.test(obj)) {
      return true;
    }
  }
  return false;
};
const serializeValue = (obj, getObjID, containerState) => {
  for (const s of serializers) {
    if (s.test(obj)) {
      let value = s.prefix;
      if (s.serialize) {
        value += s.serialize(obj, getObjID, containerState);
      }
      return value;
    }
  }
  return void 0;
};
const createParser = (getObject, containerState, doc) => {
  const map = /* @__PURE__ */ new Map();
  return {
    prepare(data2) {
      for (const s of serializers) {
        const prefix = s.prefix;
        if (data2.startsWith(prefix)) {
          const value = s.prepare(data2.slice(prefix.length), containerState, doc);
          if (s.fill) {
            map.set(value, s);
          }
          return value;
        }
      }
      return data2;
    },
    fill(obj) {
      const serializer = map.get(obj);
      if (serializer) {
        serializer.fill(obj, getObject, containerState);
        return true;
      }
      return false;
    }
  };
};
const QObjectRecursive = 1 << 0;
const QObjectImmutable = 1 << 1;
const getOrCreateProxy = (target, containerState, flags = 0) => {
  const proxy = containerState.$proxyMap$.get(target);
  if (proxy) {
    return proxy;
  }
  return createProxy(target, containerState, flags, void 0);
};
const createProxy = (target, containerState, flags, subs) => {
  assertEqual(unwrapProxy(target), target, "Unexpected proxy at this location", target);
  assertTrue(!containerState.$proxyMap$.has(target), "Proxy was already created", target);
  if (!isObject(target)) {
    throw qError(QError_onlyObjectWrapped, target);
  }
  if (target.constructor !== Object && !isArray(target)) {
    throw qError(QError_onlyLiteralWrapped, target);
  }
  const manager = containerState.$subsManager$.$getLocal$(target, subs);
  const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager, flags));
  containerState.$proxyMap$.set(target, proxy);
  return proxy;
};
const QOjectTargetSymbol = Symbol();
const QOjectFlagsSymbol = Symbol();
class ReadWriteProxyHandler {
  constructor($containerState$, $manager$, $flags$) {
    this.$containerState$ = $containerState$;
    this.$manager$ = $manager$;
    this.$flags$ = $flags$;
  }
  get(target, prop) {
    if (typeof prop === "symbol") {
      if (prop === QOjectTargetSymbol)
        return target;
      if (prop === QOjectFlagsSymbol)
        return this.$flags$;
      return target[prop];
    }
    let subscriber;
    const invokeCtx = tryGetInvokeContext();
    const recursive = (this.$flags$ & QObjectRecursive) !== 0;
    const immutable = (this.$flags$ & QObjectImmutable) !== 0;
    if (invokeCtx) {
      subscriber = invokeCtx.$subscriber$;
    }
    let value = target[prop];
    if (isMutable(value)) {
      value = value.v;
    } else if (immutable) {
      subscriber = null;
    }
    if (subscriber) {
      const isA = isArray(target);
      this.$manager$.$addSub$(subscriber, isA ? void 0 : prop);
    }
    return recursive ? wrap(value, this.$containerState$) : value;
  }
  set(target, prop, newValue) {
    if (typeof prop === "symbol") {
      target[prop] = newValue;
      return true;
    }
    const immutable = (this.$flags$ & QObjectImmutable) !== 0;
    if (immutable) {
      throw qError(QError_immutableProps);
    }
    const recursive = (this.$flags$ & QObjectRecursive) !== 0;
    const unwrappedNewValue = recursive ? unwrapProxy(newValue) : newValue;
    if (qDev$1) {
      verifySerializable(unwrappedNewValue);
      const invokeCtx = tryGetInvokeContext();
      if (invokeCtx && invokeCtx.$event$ === RenderEvent) {
        logWarn("State mutation inside render function. Move mutation to useWatch(), useClientEffect() or useServerMount()", invokeCtx.$hostElement$, prop);
      }
    }
    const isA = isArray(target);
    if (isA) {
      target[prop] = unwrappedNewValue;
      this.$manager$.$notifySubs$();
      return true;
    }
    const oldValue = target[prop];
    if (oldValue !== unwrappedNewValue) {
      target[prop] = unwrappedNewValue;
      this.$manager$.$notifySubs$(prop);
    }
    return true;
  }
  has(target, property) {
    if (property === QOjectTargetSymbol)
      return true;
    if (property === QOjectFlagsSymbol)
      return true;
    return Object.prototype.hasOwnProperty.call(target, property);
  }
  ownKeys(target) {
    let subscriber = null;
    const invokeCtx = tryGetInvokeContext();
    if (invokeCtx) {
      subscriber = invokeCtx.$subscriber$;
    }
    if (subscriber) {
      this.$manager$.$addSub$(subscriber);
    }
    return Object.getOwnPropertyNames(target);
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
    if (nakedValue !== value) {
      return value;
    }
    if (isNode(nakedValue)) {
      return value;
    }
    if (!shouldSerialize(nakedValue)) {
      return value;
    }
    if (qDev$1) {
      verifySerializable(value);
    }
    const proxy = containerState.$proxyMap$.get(value);
    return proxy ? proxy : getOrCreateProxy(value, containerState, QObjectRecursive);
  } else {
    return value;
  }
};
const verifySerializable = (value) => {
  const seen = /* @__PURE__ */ new Set();
  return _verifySerializable(value, seen);
};
const _verifySerializable = (value, seen) => {
  const unwrapped = unwrapProxy(value);
  if (unwrapped == null) {
    return value;
  }
  if (shouldSerialize(unwrapped)) {
    if (seen.has(unwrapped)) {
      return value;
    }
    seen.add(unwrapped);
    if (canSerialize(unwrapped)) {
      return value;
    }
    switch (typeof unwrapped) {
      case "object":
        if (isPromise(unwrapped))
          return value;
        if (isQwikElement(unwrapped))
          return value;
        if (isDocument(unwrapped))
          return value;
        if (isArray(unwrapped)) {
          for (const item of unwrapped) {
            _verifySerializable(item, seen);
          }
          return value;
        }
        if (isSerializableObject(unwrapped)) {
          for (const item of Object.values(unwrapped)) {
            _verifySerializable(item, seen);
          }
          return value;
        }
        break;
      case "boolean":
      case "string":
      case "number":
        return value;
    }
    throw qError(QError_verifySerializable, unwrapped);
  }
  return value;
};
const noSerializeSet = /* @__PURE__ */ new WeakSet();
const shouldSerialize = (obj) => {
  if (isObject(obj) || isFunction(obj)) {
    return !noSerializeSet.has(obj);
  }
  return true;
};
const noSerialize = (input) => {
  if (input != null) {
    noSerializeSet.add(input);
  }
  return input;
};
const mutable = (v) => {
  return {
    [MUTABLE]: true,
    v
  };
};
const isConnected = (sub) => {
  if (isQwikElement(sub)) {
    return !!tryGetContext(sub) || sub.isConnected;
  } else {
    return isConnected(sub.$el$);
  }
};
const MUTABLE = Symbol("mutable");
const isMutable = (v) => {
  return isObject(v) && v[MUTABLE] === true;
};
const unwrapProxy = (proxy) => {
  var _a;
  return (_a = getProxyTarget(proxy)) != null ? _a : proxy;
};
const getProxyTarget = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectTargetSymbol];
  }
  return void 0;
};
const getProxyFlags = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectFlagsSymbol];
  }
  return void 0;
};
const Q_CTX = "_qc_";
const resumeIfNeeded = (containerEl) => {
  const isResumed = directGetAttribute(containerEl, QContainerAttr);
  if (isResumed === "paused") {
    resumeContainer(containerEl);
    if (qDev$1) {
      appendQwikDevTools(containerEl);
    }
  }
};
const appendQwikDevTools = (containerEl) => {
  containerEl["qwik"] = {
    pause: () => pauseContainer(containerEl),
    state: getContainerState(containerEl)
  };
};
const tryGetContext = (element) => {
  return element[Q_CTX];
};
const getContext = (element) => {
  let ctx = tryGetContext(element);
  if (!ctx) {
    element[Q_CTX] = ctx = {
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
    };
  }
  return ctx;
};
const cleanupContext = (ctx, subsManager) => {
  var _a;
  const el = ctx.$element$;
  (_a = ctx.$watches$) == null ? void 0 : _a.forEach((watch) => {
    subsManager.$clearSub$(watch);
    destroyWatch(watch);
  });
  if (ctx.$renderQrl$) {
    subsManager.$clearSub$(el);
  }
  ctx.$renderQrl$ = null;
  ctx.$seq$ = null;
  ctx.$watches$ = null;
  ctx.$dirty$ = false;
  el[Q_CTX] = void 0;
};
const PREFIXES = ["on", "window:on", "document:on"];
const SCOPED = ["on", "on-window", "on-document"];
const normalizeOnProp = (prop) => {
  let scope = "on";
  for (let i = 0; i < PREFIXES.length; i++) {
    const prefix = PREFIXES[i];
    if (prop.startsWith(prefix)) {
      scope = SCOPED[i];
      prop = prop.slice(prefix.length);
      break;
    }
  }
  if (prop.startsWith("-")) {
    prop = fromCamelToKebabCase(prop.slice(1));
  } else {
    prop = prop.toLowerCase();
  }
  return scope + ":" + prop;
};
const createProps = (target, containerState) => {
  return createProxy(target, containerState, QObjectImmutable);
};
const getPropsMutator = (ctx, containerState) => {
  let props = ctx.$props$;
  if (!ctx.$props$) {
    ctx.$props$ = props = createProps({}, containerState);
  }
  const target = getProxyTarget(props);
  assertDefined(target, `props have to be a proxy, but it is not`, props);
  const manager = containerState.$subsManager$.$getLocal$(target);
  return {
    set(prop, value) {
      var _a, _b;
      const didSet = prop in target;
      let oldValue = target[prop];
      let mut = false;
      if (isMutable(oldValue)) {
        oldValue = oldValue.v;
      }
      if (containerState.$mutableProps$) {
        mut = true;
        if (isMutable(value)) {
          value = value.v;
          target[prop] = value;
        } else {
          target[prop] = mutable(value);
        }
      } else {
        target[prop] = value;
        if (isMutable(value)) {
          value = value.v;
          mut = true;
        }
      }
      if (oldValue !== value) {
        if (qDev$1) {
          if (didSet && !mut && !isQrl$1(value)) {
            const displayName = (_b = (_a = ctx.$renderQrl$) == null ? void 0 : _a.getSymbol()) != null ? _b : ctx.$element$.localName;
            logError(codeToText(QError_immutableJsxProps), `If you need to change a value of a passed in prop, please wrap the prop with "mutable()" <${displayName} ${prop}={mutable(...)}>`, "\n - Component:", displayName, "\n - Prop:", prop, "\n - Old value:", oldValue, "\n - New value:", value);
          }
        }
        manager.$notifySubs$(prop);
      }
    }
  };
};
const inflateQrl = (qrl, elCtx) => {
  assertDefined(qrl.$capture$, "invoke: qrl capture must be defined inside useLexicalScope()", qrl);
  return qrl.$captureRef$ = qrl.$capture$.map((idx) => {
    const int = parseInt(idx, 10);
    const obj = elCtx.$refMap$[int];
    assertTrue(elCtx.$refMap$.length > int, "out of bounds inflate access", idx);
    return obj;
  });
};
const STYLE = qDev$1 ? `background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;` : "";
const logError = (message, ...optionalParams) => {
  const err = message instanceof Error ? message : new Error(message);
  console.error("%cQWIK ERROR", STYLE, err.message, ...printParams(optionalParams), err.stack);
  return err;
};
const logErrorAndStop = (message, ...optionalParams) => {
  const err = logError(message, ...optionalParams);
  debugger;
  return err;
};
const logWarn = (message, ...optionalParams) => {
  if (qDev$1) {
    console.warn("%cQWIK WARN", STYLE, message, ...printParams(optionalParams));
  }
};
const logDebug = (message, ...optionalParams) => {
  if (qDev$1) {
    console.debug("%cQWIK", STYLE, message, ...printParams(optionalParams));
  }
};
const printParams = (optionalParams) => {
  if (qDev$1) {
    return optionalParams.map((p) => {
      if (isNode$1(p) && isElement(p)) {
        return printElement(p);
      }
      return p;
    });
  }
  return optionalParams;
};
const printElement = (el) => {
  var _a;
  const ctx = tryGetContext(el);
  const isServer2 = /* @__PURE__ */ (() => typeof process !== "undefined" && !!process.versions && !!process.versions.node)();
  return {
    tagName: el.tagName,
    renderQRL: (_a = ctx == null ? void 0 : ctx.$renderQrl$) == null ? void 0 : _a.getSymbol(),
    element: isServer2 ? void 0 : el,
    ctx: isServer2 ? void 0 : ctx
  };
};
const QError_stringifyClassOrStyle = 0;
const QError_runtimeQrlNoElement = 2;
const QError_verifySerializable = 3;
const QError_errorWhileRendering = 4;
const QError_setProperty = 6;
const QError_onlyObjectWrapped = 8;
const QError_onlyLiteralWrapped = 9;
const QError_qrlIsNotFunction = 10;
const QError_notFoundContext = 13;
const QError_useMethodOutsideContext = 14;
const QError_immutableProps = 17;
const QError_immutableJsxProps = 19;
const QError_useInvokeContext = 20;
const QError_containerAlreadyPaused = 21;
const QError_invalidJsxNodeType = 25;
const QError_trackUseStore = 26;
const QError_missingObjectId = 27;
const QError_invalidContext = 28;
const QError_canNotRenderHTML = 29;
const qError = (code, ...parts) => {
  const text = codeToText(code);
  return logErrorAndStop(text, ...parts);
};
const codeToText = (code) => {
  var _a;
  if (qDev$1) {
    const MAP = [
      "Error while serializing class attribute",
      "Can not serialize a HTML Node that is not an Element",
      "Rruntime but no instance found on element.",
      "Only primitive and object literals can be serialized",
      "Crash while rendering",
      "You can render over a existing q:container. Skipping render().",
      "Set property",
      "Only function's and 'string's are supported.",
      "Only objects can be wrapped in 'QObject'",
      `Only objects literals can be wrapped in 'QObject'`,
      "QRL is not a function",
      "Dynamic import not found",
      "Unknown type argument",
      "Actual value for useContext() can not be found, make sure some ancestor component has set a value using useContextProvider()",
      "Invoking 'use*()' method outside of invocation context.",
      "Cant access renderCtx for existing context",
      "Cant access document for existing context",
      "props are inmutable",
      "<div> component can only be used at the root of a Qwik component$()",
      "Props are immutable by default.",
      "use- method must be called only at the root level of a component$()",
      "Container is already paused. Skipping",
      'Components using useServerMount() can only be mounted in the server, if you need your component to be mounted in the client, use "useMount$()" instead',
      "When rendering directly on top of Document, the root node must be a <html>",
      "A <html> node must have 2 children. The first one <head> and the second one a <body>",
      "Invalid JSXNode type. It must be either a function or a string. Found:",
      "Tracking value changes can only be done to useStore() objects and component props",
      "Missing Object ID for captured object",
      "The provided Context reference is not a valid context created by createContext()",
      "<html> is the root container, it can not be rendered inside a component"
    ];
    return `Code(${code}): ${(_a = MAP[code]) != null ? _a : ""}`;
  } else {
    return `Code(${code})`;
  }
};
const isQrl$1 = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};
const createQRL = (chunk, symbol, symbolRef, symbolFn, capture, captureRef, refSymbol) => {
  if (qDev$1) {
    verifySerializable(captureRef);
  }
  let containerEl;
  const setContainer = (el) => {
    if (!containerEl) {
      containerEl = el;
    }
  };
  const resolve = async () => {
    if (symbolRef) {
      return symbolRef;
    }
    if (symbolFn) {
      return symbolRef = symbolFn().then((module) => symbolRef = module[symbol]);
    } else {
      if (!containerEl) {
        throw new Error(`QRL '${chunk}#${symbol || "default"}' does not have an attached container`);
      }
      const symbol2 = getPlatform(containerEl).importSymbol(containerEl, chunk, symbol);
      return symbolRef = then(symbol2, (ref) => {
        return symbolRef = ref;
      });
    }
  };
  const resolveLazy = () => {
    return isFunction(symbolRef) ? symbolRef : resolve();
  };
  const invokeFn = (currentCtx, beforeFn) => {
    return (...args) => {
      const fn = resolveLazy();
      return then(fn, (fn2) => {
        if (isFunction(fn2)) {
          if (beforeFn && beforeFn() === false) {
            return;
          }
          const baseContext = createInvokationContext(currentCtx);
          const context = {
            ...baseContext,
            $qrl$: QRL
          };
          return invoke(context, fn2, ...args);
        }
        throw qError(QError_qrlIsNotFunction);
      });
    };
  };
  const createInvokationContext = (invoke2) => {
    if (invoke2 == null) {
      return newInvokeContext();
    } else if (isArray(invoke2)) {
      return newInvokeContextFromTuple(invoke2);
    } else {
      return invoke2;
    }
  };
  const invokeQRL = async function(...args) {
    const fn = invokeFn();
    const result = await fn(...args);
    return result;
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
  const qrl = Object.assign(invokeQRL, methods);
  seal(qrl);
  return qrl;
};
const getSymbolHash$1 = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
function assertQrl(qrl) {
  if (qDev$1) {
    if (!isQrl$1(qrl)) {
      throw new Error("Not a QRL");
    }
  }
}
let runtimeSymbolId = 0;
const RUNTIME_QRL = "/runtimeQRL";
const INLINED_QRL = "/inlinedQRL";
const runtimeQrl = (symbol, lexicalScopeCapture = EMPTY_ARRAY$1) => {
  return createQRL(RUNTIME_QRL, "s" + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture, null);
};
const inlinedQrl = (symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY$1) => {
  return createQRL(INLINED_QRL, symbolName, symbol, null, null, lexicalScopeCapture, null);
};
const stringifyQRL = (qrl, opts = {}) => {
  var _a;
  assertQrl(qrl);
  let symbol = qrl.$symbol$;
  let chunk = qrl.$chunk$;
  const refSymbol = (_a = qrl.$refSymbol$) != null ? _a : symbol;
  const platform = opts.$platform$;
  const element = opts.$element$;
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol);
    if (result) {
      chunk = result[1];
      if (!qrl.$refSymbol$) {
        symbol = result[0];
      }
    }
  }
  if (chunk.startsWith("./")) {
    chunk = chunk.slice(2);
  }
  const parts = [chunk];
  if (symbol && symbol !== "default") {
    if (chunk === RUNTIME_QRL && qTest) {
      symbol = "_";
    }
    parts.push("#", symbol);
  }
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
  } else if (capture && capture.length > 0) {
    parts.push(`[${capture.join(" ")}]`);
  }
  const qrlString = parts.join("");
  if (qrl.$chunk$ === RUNTIME_QRL && element) {
    const qrls = element.__qrls__ || (element.__qrls__ = /* @__PURE__ */ new Set());
    qrls.add(qrl);
  }
  return qrlString;
};
const serializeQRLs = (existingQRLs, elCtx) => {
  assertTrue(isElement$1(elCtx.$element$), "Element must be an actual element");
  const opts = {
    $platform$: getPlatform(elCtx.$element$),
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
  if (chunk === RUNTIME_QRL) {
    logError(codeToText(QError_runtimeQrlNoElement), qrl);
  }
  const iQrl = createQRL(chunk, symbol, null, null, capture, null, null);
  if (containerEl) {
    iQrl.$setContainer$(containerEl);
  }
  return iQrl;
};
const indexOf = (text, startIdx, char) => {
  const endIdx = text.length;
  const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
  return charIdx == -1 ? endIdx : charIdx;
};
const addToArray = (array, obj) => {
  const index2 = array.indexOf(obj);
  if (index2 === -1) {
    array.push(obj);
    return array.length - 1;
  }
  return index2;
};
const $ = (expression) => {
  return runtimeQrl(expression);
};
const componentQrl = (onRenderQrl) => {
  function QwikComponent(props, key) {
    assertQrl(onRenderQrl);
    const hash = qTest ? "sX" : onRenderQrl.$hash$;
    const finalKey = hash + ":" + (key ? key : "");
    return jsx(Virtual, { [OnRenderProp]: onRenderQrl, ...props }, finalKey);
  }
  QwikComponent[SERIALIZABLE_STATE] = [onRenderQrl];
  return QwikComponent;
};
const isQwikComponent = (component) => {
  return typeof component == "function" && component[SERIALIZABLE_STATE] !== void 0;
};
const Slot = (props) => {
  var _a;
  const name = (_a = props.name) != null ? _a : "";
  return jsx(Virtual, {
    [QSlotS]: ""
  }, name);
};
const version = "0.0.108";
const IS_HEAD = 1 << 0;
const IS_RAW_CONTENT = 1 << 1;
const IS_HTML = 1 << 2;
const renderSSR = async (doc, node, opts) => {
  var _a;
  const root = opts.containerTagName;
  const containerEl = doc.createElement(root);
  const containerState = getContainerState(containerEl);
  const rctx = createRenderContext(doc, containerState);
  const headNodes = (_a = opts.beforeContent) != null ? _a : [];
  const ssrCtx = {
    rctx,
    $contexts$: [],
    projectedChildren: void 0,
    projectedContext: void 0,
    hostCtx: void 0,
    invocationContext: void 0,
    headNodes: root === "html" ? headNodes : []
  };
  const containerAttributes = {
    ...opts.containerAttributes,
    "q:container": "paused",
    "q:version": version,
    "q:render": qDev$1 ? "ssr-dev" : "ssr"
  };
  if (opts.base) {
    containerAttributes["q:base"] = opts.base;
  }
  if (opts.url) {
    containerState.$envData$["url"] = opts.url;
  }
  if (opts.envData) {
    Object.assign(containerState.$envData$, opts.envData);
  }
  if (root === "html") {
    node = jsx(root, {
      ...containerAttributes,
      children: [node]
    });
  } else {
    node = jsx(root, {
      ...containerAttributes,
      children: [...headNodes != null ? headNodes : [], node]
    });
  }
  containerState.$hostsRendering$ = /* @__PURE__ */ new Set();
  containerState.$renderPromise$ = Promise.resolve().then(() => renderRoot(node, ssrCtx, opts.stream, containerState, opts));
  await containerState.$renderPromise$;
};
const renderRoot = async (node, ssrCtx, stream, containerState, opts) => {
  const beforeClose = opts.beforeClose;
  await renderNode(node, ssrCtx, stream, 0, (stream2) => {
    const result = beforeClose == null ? void 0 : beforeClose(ssrCtx.$contexts$, containerState);
    if (result) {
      return processData(result, ssrCtx, stream2, 0, void 0);
    }
  });
  if (qDev$1) {
    if (ssrCtx.headNodes.length > 0) {
      logError("Missing <head>. Global styles could not be rendered. Please render a <head> element at the root of the app");
    }
  }
  return ssrCtx.rctx.$static$;
};
const renderNodeFunction = (node, ssrCtx, stream, flags, beforeClose) => {
  var _a;
  const fn = node.type;
  if (fn === SSRComment) {
    stream.write(`<!--${(_a = node.props.data) != null ? _a : ""}-->`);
    return;
  }
  if (fn === InternalSSRStream) {
    return renderGenerator(node, ssrCtx, stream, flags);
  }
  if (fn === Virtual) {
    const elCtx = getContext(ssrCtx.rctx.$static$.$doc$.createElement(VIRTUAL));
    return renderNodeVirtual(node, elCtx, void 0, ssrCtx, stream, flags, beforeClose);
  }
  const res = ssrCtx.invocationContext ? invoke(ssrCtx.invocationContext, () => node.type(node.props, node.key)) : node.type(node.props, node.key);
  return processData(res, ssrCtx, stream, flags, beforeClose);
};
const renderGenerator = async (node, ssrCtx, stream, flags) => {
  const generator = node.props.children;
  let value;
  if (isFunction(generator)) {
    const v = generator(stream);
    if (isPromise(v)) {
      return v;
    }
    value = v;
  } else {
    value = generator;
  }
  for await (const chunk of value) {
    await processData(chunk, ssrCtx, stream, flags, void 0);
  }
};
const renderNodeVirtual = (node, elCtx, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  var _a;
  const props = node.props;
  const renderQrl = props[OnRenderProp];
  if (renderQrl) {
    elCtx.$renderQrl$ = renderQrl;
    return renderSSRComponent(ssrCtx, stream, elCtx, node, flags, beforeClose);
  }
  const { children, ...attributes } = node.props;
  const isSlot = QSlotS in props;
  const key = node.key != null ? String(node.key) : null;
  if (isSlot) {
    assertDefined((_a = ssrCtx.hostCtx) == null ? void 0 : _a.$id$, "hostId must be defined for a slot");
    attributes[QSlotRef] = ssrCtx.hostCtx.$id$;
  }
  if (key != null) {
    attributes["q:key"] = key;
  }
  const url = new Map(Object.entries(attributes));
  stream.write(`<!--qv ${serializeVirtualAttributes(url)}-->`);
  if (extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = processData(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    var _a2;
    if (!isSlot && !beforeClose) {
      stream.write(CLOSE_VIRTUAL);
      return;
    }
    let promise2;
    if (isSlot) {
      assertDefined(key, "key must be defined for a slot");
      const content = (_a2 = ssrCtx.projectedChildren) == null ? void 0 : _a2[key];
      if (content) {
        ssrCtx.projectedChildren[key] = void 0;
        promise2 = processData(content, ssrCtx.projectedContext, stream, flags);
      }
    }
    if (beforeClose) {
      promise2 = then(promise2, () => beforeClose(stream));
    }
    return then(promise2, () => {
      stream.write(CLOSE_VIRTUAL);
    });
  });
};
const CLOSE_VIRTUAL = `<!--/qv-->`;
const renderNodeElement = (node, extraAttributes, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  const key = node.key != null ? String(node.key) : null;
  const props = node.props;
  const textType = node.type;
  const elCtx = getContext(ssrCtx.rctx.$static$.$doc$.createElement(node.type));
  const hasRef = "ref" in props;
  const attributes = updateProperties(elCtx, props);
  const hostCtx = ssrCtx.hostCtx;
  if (hostCtx) {
    if (textType === "html") {
      throw qError(QError_canNotRenderHTML);
    }
    attributes["class"] = joinClasses(hostCtx.$scopeIds$, attributes["class"]);
    const cmp = hostCtx;
    if (!cmp.$attachedListeners$) {
      cmp.$attachedListeners$ = true;
      Object.entries(hostCtx.li).forEach(([eventName, qrls]) => {
        addQRLListener(elCtx.li, eventName, qrls);
      });
    }
  }
  if (textType === "head") {
    flags |= IS_HEAD;
  }
  const listeners = Object.entries(elCtx.li);
  const isHead = flags & IS_HEAD;
  if (key != null) {
    attributes["q:key"] = key;
  }
  if (hasRef || listeners.length > 0) {
    const newID = getNextIndex(ssrCtx.rctx);
    attributes[ELEMENT_ID] = newID;
    elCtx.$id$ = newID;
    ssrCtx.$contexts$.push(elCtx);
  }
  if (isHead) {
    attributes["q:head"] = "";
  }
  if (extraAttributes) {
    Object.assign(attributes, extraAttributes);
  }
  listeners.forEach(([key2, value]) => {
    attributes[key2] = serializeQRLs(value, elCtx);
  });
  if (renderNodeElementSync(textType, attributes, stream)) {
    return;
  }
  if (textType !== "head") {
    flags &= ~IS_HEAD;
  }
  if (textType === "html") {
    flags |= IS_HTML;
  } else {
    flags &= ~IS_HTML;
  }
  if (hasRawContent[textType]) {
    flags |= IS_RAW_CONTENT;
  } else {
    flags &= ~IS_RAW_CONTENT;
  }
  if (extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = processData(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    if (textType === "head") {
      ssrCtx.headNodes.forEach((node2) => {
        renderNodeElementSync(node2.type, node2.props, stream);
      });
      ssrCtx.headNodes.length = 0;
    }
    if (!beforeClose) {
      stream.write(`</${textType}>`);
      return;
    }
    return then(beforeClose(stream), () => {
      stream.write(`</${textType}>`);
    });
  });
};
const renderNodeElementSync = (tagName, attributes, stream) => {
  stream.write(`<${tagName}`);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key !== "dangerouslySetInnerHTML" && key !== "children") {
      if (key === "class" && !value) {
        return;
      }
      const chunk = value === "" ? ` ${key}` : ` ${key}="${escapeAttr(value)}"`;
      stream.write(chunk);
    }
  });
  stream.write(`>`);
  const empty = !!emptyElements[tagName];
  if (empty) {
    return true;
  }
  const innerHTML = attributes.dangerouslySetInnerHTML;
  if (innerHTML) {
    stream.write(innerHTML);
    stream.write(`</${tagName}>`);
    return true;
  }
  return false;
};
const renderSSRComponent = (ssrCtx, stream, elCtx, node, flags, beforeClose) => {
  const attributes = updateComponentProperties(ssrCtx.rctx, elCtx, node.props);
  return then(executeComponent(ssrCtx.rctx, elCtx), (res) => {
    if (!res) {
      logError("component was not rendered during SSR");
      return;
    }
    const hostElement = elCtx.$element$;
    const newCtx = res.rctx;
    let children = node.props.children;
    if (children) {
      if (isArray(children)) {
        if (children.filter(isNotNullable).length === 0) {
          children = void 0;
        }
      } else {
        children = [children];
      }
    }
    const invocationContext = newInvokeContext(newCtx.$static$.$doc$, hostElement, void 0);
    invocationContext.$subscriber$ = hostElement;
    invocationContext.$renderCtx$ = newCtx;
    const projectedContext = {
      ...ssrCtx,
      rctx: newCtx
    };
    const newSSrContext = {
      ...ssrCtx,
      projectedChildren: splitProjectedChildren(children, ssrCtx),
      projectedContext,
      rctx: newCtx,
      invocationContext
    };
    const extraNodes = [];
    if (elCtx.$appendStyles$) {
      const isHTML = !!(flags & IS_HTML);
      const array = isHTML ? ssrCtx.headNodes : extraNodes;
      for (const style of elCtx.$appendStyles$) {
        array.push(jsx("style", {
          [QStyle]: style.styleId,
          dangerouslySetInnerHTML: style.content
        }));
      }
    }
    if (elCtx.$scopeIds$) {
      for (const styleId of elCtx.$scopeIds$) {
      }
      const value = serializeSStyle(elCtx.$scopeIds$);
      if (value) {
        attributes[QScopedStyle] = value;
      }
    }
    const newID = getNextIndex(ssrCtx.rctx);
    attributes[ELEMENT_ID] = newID;
    elCtx.$id$ = newID;
    ssrCtx.$contexts$.push(elCtx);
    const processedNode = jsx(node.type, {
      ...attributes,
      children: res.node
    }, node.key);
    newSSrContext.hostCtx = elCtx;
    return renderNodeVirtual(processedNode, elCtx, extraNodes, newSSrContext, stream, flags, (stream2) => {
      return then(renderQTemplates(newSSrContext, stream2), () => {
        return beforeClose == null ? void 0 : beforeClose(stream2);
      });
    });
  });
};
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
  if (flatChildren === null) {
    return void 0;
  }
  const slotMap = {};
  for (const child of flatChildren) {
    let slotName = "";
    if (isJSXNode(child)) {
      slotName = (_a = child.props[QSlot]) != null ? _a : "";
    }
    let array = slotMap[slotName];
    if (!array) {
      slotMap[slotName] = array = [];
    }
    array.push(child);
  }
  return slotMap;
};
const renderNode = (node, ssrCtx, stream, flags, beforeClose) => {
  if (typeof node.type === "string") {
    return renderNodeElement(node, void 0, void 0, ssrCtx, stream, flags, beforeClose);
  } else {
    return renderNodeFunction(node, ssrCtx, stream, flags, beforeClose);
  }
};
const processData = (node, ssrCtx, stream, flags, beforeClose) => {
  if (node == null || typeof node === "boolean") {
    return;
  }
  if (isJSXNode(node)) {
    return renderNode(node, ssrCtx, stream, flags, beforeClose);
  } else if (isPromise(node)) {
    return node.then((node2) => processData(node2, ssrCtx, stream, flags, beforeClose));
  } else if (isArray(node)) {
    node = _flatVirtualChildren(node, ssrCtx);
    return walkChildren(node, ssrCtx, stream, flags);
  } else if (isString(node) || typeof node === "number") {
    if ((flags & IS_RAW_CONTENT) !== 0) {
      stream.write(String(node));
    } else {
      stream.write(escape(String(node)));
    }
  } else {
    logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
  }
};
function walkChildren(children, ssrContext, stream, flags) {
  if (children == null) {
    return;
  }
  if (!isArray(children)) {
    return processData(children, ssrContext, stream, flags);
  }
  if (children.length === 1) {
    return processData(children[0], ssrContext, stream, flags);
  }
  if (children.length === 0) {
    return;
  }
  let currentIndex = 0;
  const buffers = [];
  return children.reduce((prevPromise, child, index2) => {
    const buffer = [];
    buffers.push(buffer);
    const localStream = {
      write(chunk) {
        if (currentIndex === index2) {
          stream.write(chunk);
        } else {
          buffer.push(chunk);
        }
      }
    };
    return then(processData(child, ssrContext, localStream, flags), () => {
      return then(prevPromise, () => {
        currentIndex++;
        if (buffers.length > currentIndex) {
          buffers[currentIndex].forEach((chunk) => stream.write(chunk));
        }
      });
    });
  }, void 0);
}
const flatVirtualChildren = (children, ssrCtx) => {
  if (children == null) {
    return null;
  }
  const result = _flatVirtualChildren(children, ssrCtx);
  const nodes = isArray(result) ? result : [result];
  if (nodes.length === 0) {
    return null;
  }
  return nodes;
};
const _flatVirtualChildren = (children, ssrCtx) => {
  if (children == null) {
    return null;
  }
  if (isArray(children)) {
    return children.flatMap((c) => _flatVirtualChildren(c, ssrCtx));
  } else if (isJSXNode(children) && isFunction(children.type) && children.type !== SSRComment && children.type !== InternalSSRStream && children.type !== Virtual) {
    const fn = children.type;
    const res = ssrCtx.invocationContext ? invoke(ssrCtx.invocationContext, () => fn(children.props, children.key)) : fn(children.props, children.key);
    return flatVirtualChildren(res, ssrCtx);
  }
  return children;
};
const updateProperties = (ctx, expectProps) => {
  const attributes = {};
  if (!expectProps) {
    return attributes;
  }
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return attributes;
  }
  const elm = ctx.$element$;
  for (const key of keys) {
    if (key === "children" || key === OnRenderProp) {
      continue;
    }
    const newValue = expectProps[key];
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    if (key.startsWith("data-") || key.startsWith("aria-")) {
      attributes[key] = newValue;
      continue;
    }
    if (isOnProp(key)) {
      setEvent(ctx.li, key, newValue);
      continue;
    }
    setProperty(attributes, key, newValue);
  }
  return attributes;
};
const updateComponentProperties = (rctx, ctx, expectProps) => {
  const attributes = {};
  if (!expectProps) {
    return attributes;
  }
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return attributes;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$static$.$containerState$);
  for (const key of keys) {
    if (key === "children" || key === OnRenderProp) {
      continue;
    }
    const newValue = expectProps[key];
    const skipProperty = ALLOWS_PROPS.includes(key);
    if (!skipProperty) {
      qwikProps.set(key, newValue);
      continue;
    }
    setProperty(attributes, key, newValue);
  }
  return attributes;
};
function setProperty(attributes, prop, value) {
  if (value != null && value !== false) {
    prop = processPropKey(prop);
    const attrValue = processPropValue(prop, value, attributes[prop]);
    if (attrValue !== null) {
      attributes[prop] = attrValue;
    }
  }
}
function processPropKey(prop) {
  if (prop === "className") {
    return "class";
  }
  return prop;
}
function processPropValue(prop, value, prevValue) {
  if (prop === "class") {
    const str = joinClasses(value, prevValue);
    return str === "" ? null : str;
  }
  if (prop === "style") {
    return stringifyStyle(value);
  }
  if (value === false || value == null) {
    return null;
  }
  if (value === true) {
    return "";
  }
  return String(value);
}
const hasRawContent = {
  style: true,
  script: true
};
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
const escape = (s) => {
  return s.replace(/[&<>\u00A0]/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\xA0":
        return "&nbsp;";
      default:
        return "";
    }
  });
};
const escapeAttr = (s) => {
  const toEscape = /[&"\u00A0]/g;
  if (!toEscape.test(s)) {
    return s;
  } else {
    return s.replace(toEscape, (c) => {
      switch (c) {
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        case "\xA0":
          return "&nbsp;";
        default:
          return "";
      }
    });
  }
};
const useStore = (initialState, opts) => {
  var _a;
  const { get, set, ctx } = useSequentialScope();
  if (get != null) {
    return get;
  }
  const value = isFunction(initialState) ? initialState() : initialState;
  if ((opts == null ? void 0 : opts.reactive) === false) {
    set(value);
    return value;
  } else {
    const containerState = ctx.$renderCtx$.$static$.$containerState$;
    const recursive = (_a = opts == null ? void 0 : opts.recursive) != null ? _a : false;
    const flags = recursive ? QObjectRecursive : 0;
    const newStore = createProxy(value, containerState, flags, void 0);
    set(newStore);
    return newStore;
  }
};
const createContext = (name) => {
  return Object.freeze({
    id: fromCamelToKebabCase(name)
  });
};
const useContextProvider = (context, newValue) => {
  const { get, set, ctx } = useSequentialScope();
  if (get) {
    return;
  }
  if (qDev$1) {
    validateContext(context);
  }
  const hostElement = ctx.$hostElement$;
  const hostCtx = getContext(hostElement);
  let contexts = hostCtx.$contexts$;
  if (!contexts) {
    hostCtx.$contexts$ = contexts = /* @__PURE__ */ new Map();
  }
  if (qDev$1) {
    verifySerializable(newValue);
  }
  contexts.set(context.id, newValue);
  set(true);
};
const useContext = (context) => {
  const { get, set, ctx } = useSequentialScope();
  if (get) {
    return get;
  }
  if (qDev$1) {
    validateContext(context);
  }
  let hostElement = ctx.$hostElement$;
  const contexts = ctx.$renderCtx$.$localStack$;
  for (let i = contexts.length - 1; i >= 0; i--) {
    const ctx2 = contexts[i];
    hostElement = ctx2.$element$;
    if (ctx2.$contexts$) {
      const found = ctx2.$contexts$.get(context.id);
      if (found) {
        set(found);
        return found;
      }
    }
  }
  if (hostElement.closest) {
    const value = queryContextFromDom(hostElement, context.id);
    if (value !== void 0) {
      set(value);
      return value;
    }
  }
  throw qError(QError_notFoundContext, context.id);
};
const queryContextFromDom = (hostElement, contextId) => {
  var _a;
  let element = hostElement;
  while (element) {
    let node = element;
    let virtual;
    while (node && (virtual = findVirtual(node))) {
      const contexts = (_a = tryGetContext(virtual)) == null ? void 0 : _a.$contexts$;
      if (contexts) {
        if (contexts.has(contextId)) {
          return contexts.get(contextId);
        }
      }
      node = virtual;
    }
    element = element.parentElement;
  }
  return void 0;
};
const findVirtual = (el) => {
  let node = el;
  let stack = 1;
  while (node = node.previousSibling) {
    if (isComment(node)) {
      if (node.data === "/qv") {
        stack++;
      } else if (node.data.startsWith("qv ")) {
        stack--;
        if (stack === 0) {
          return getVirtualElement(node);
        }
      }
    }
  }
  return null;
};
const validateContext = (context) => {
  if (!isObject(context) || typeof context.id !== "string" || context.id.length === 0) {
    throw qError(QError_invalidContext, context);
  }
};
function useEnvData(key, defaultValue) {
  var _a;
  const ctx = useInvokeContext();
  return (_a = ctx.$renderCtx$.$static$.$containerState$.$envData$[key]) != null ? _a : defaultValue;
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
  const styleId = styleKey(styleQrl, i);
  const hostElement = ctx.$hostElement$;
  const containerState = renderCtx.$static$.$containerState$;
  const elCtx = getContext(ctx.$hostElement$);
  set(styleId);
  if (!elCtx.$appendStyles$) {
    elCtx.$appendStyles$ = [];
  }
  if (!elCtx.$scopeIds$) {
    elCtx.$scopeIds$ = [];
  }
  if (scoped) {
    elCtx.$scopeIds$.push(styleContent(styleId));
  }
  if (!hasStyle(containerState, styleId)) {
    containerState.$styleIds$.add(styleId);
    ctx.$waitOn$.push(styleQrl.resolve(hostElement).then((styleText) => {
      elCtx.$appendStyles$.push({
        styleId,
        content: transform(styleText, styleId)
      });
    }));
  }
  return styleId;
};
/**
 * @license
 * @builder.io/qwik/server 0.0.108
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
function createPlatform(document2, opts, mapper) {
  if (!document2 || document2.nodeType !== 9) {
    throw new Error(`Invalid Document implementation`);
  }
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
async function setServerPlatform(document2, opts, mapper) {
  const platform = createPlatform(document2, opts, mapper);
  setPlatform(document2, platform);
}
var getSymbolHash = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
var QWIK_LOADER_DEFAULT_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>c(t,e,n,o)))},s=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),i=e=>{throw Error("QWIK "+e)},a=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),c=async(n,r,c,u)=>{var d;n.hasAttribute("preventdefault:"+c)&&u.preventDefault();const b="on"+r+":"+c,f=null==(d=n._qc_)?void 0:d.li[b];if(f)return void f.forEach((e=>e.getFn([n,u],(()=>n.isConnected))(u,n)));const v=n.getAttribute(b);if(v)for(const r of v.split("\\n")){const c=a(n,r);if(c){const r=l(c),a=(window[c.pathname]||(p=await import(c.href.split("#")[0]),Object.values(p).find(e)||p))[r]||i(c+" does not export "+r),d=t[o];if(n.isConnected)try{t[o]=[n,u,c],a(u,n)}finally{t[o]=d,s(n,"qsymbol",r)}}}var p},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",u=e=>{let t=e.target;for(r("-document",e.type,e);t&&t.getAttribute;)c(t,"",e.type,e),t=e.bubbles?t.parentElement:null},d=e=>{r("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)&&(n=1,r("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),c(n.target,"","qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}},f=e=>{document.addEventListener(e,u,{capture:!0}),window.addEventListener(e,d)};if(!t.qR){t.qR=1;{const e=t.querySelector("script[events]");if(e)e.getAttribute("events").split(/[\\s,;]+/).forEach(f);else for(const e in t)e.startsWith("on")&&f(e.slice(2))}t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                qrls.forEach((q => q.getFn([ element, ev ], (() => element.isConnected))(ev, element)));\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                emitEvent(element, "qsymbol", symbolName);\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => {\n            document.addEventListener(eventName, processDocumentEvent, {\n                capture: !0\n            });\n            window.addEventListener(eventName, processWindowEvent);\n        };\n        if (!doc.qR) {\n            doc.qR = 1;\n            {\n                const scriptTag = doc.querySelector("script[events]");\n                if (scriptTag) {\n                    scriptTag.getAttribute("events").split(/[\\s,;]+/).forEach(addDocEventListener);\n                } else {\n                    for (const key in doc) {\n                        key.startsWith("on") && addDocEventListener(key.slice(2));\n                    }\n                }\n            }\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>c(t,e,n,o)))},i=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),s=e=>{throw Error("QWIK "+e)},a=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),c=async(n,r,c,d)=>{var u;n.hasAttribute("preventdefault:"+c)&&d.preventDefault();const b="on"+r+":"+c,f=null==(u=n._qc_)?void 0:u.li[b];if(f)return void f.forEach((e=>e.getFn([n,d],(()=>n.isConnected))(d,n)));const v=n.getAttribute(b);if(v)for(const r of v.split("\\n")){const c=a(n,r);if(c){const r=l(c),a=(window[c.pathname]||(p=await import(c.href.split("#")[0]),Object.values(p).find(e)||p))[r]||s(c+" does not export "+r),u=t[o];if(n.isConnected)try{t[o]=[n,d,c],a(d,n)}finally{t[o]=u,i(n,"qsymbol",r)}}}var p},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",d=e=>{let t=e.target;for(r("-document",e.type,e);t&&t.getAttribute;)c(t,"",e.type,e),t=e.bubbles?t.parentElement:null},u=e=>{r("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)&&(n=1,r("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),c(n.target,"","qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}};t.qR||(t.qR=1,window.qEvents.forEach((e=>{document.addEventListener(e,d,{capture:!0}),window.addEventListener(e,u)})),t.addEventListener("readystatechange",b),b())})(document)})();';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                qrls.forEach((q => q.getFn([ element, ev ], (() => element.isConnected))(ev, element)));\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                emitEvent(element, "qsymbol", symbolName);\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => {\n            document.addEventListener(eventName, processDocumentEvent, {\n                capture: !0\n            });\n            window.addEventListener(eventName, processWindowEvent);\n        };\n        if (!doc.qR) {\n            doc.qR = 1;\n            window.qEvents.forEach(addDocEventListener);\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
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
function getPrefetchResources(snapshotResult, opts, mapper) {
  const manifest2 = getValidManifest(opts.manifest);
  if (manifest2 && mapper) {
    const prefetchStrategy = opts.prefetchStrategy;
    const buildBase = getBuildBase(opts);
    if (prefetchStrategy !== null) {
      if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
        return getAutoPrefetch(snapshotResult, manifest2, mapper, buildBase);
      }
      if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
        try {
          return prefetchStrategy.symbolsToPrefetch({ manifest: manifest2 });
        } catch (e) {
          console.error("getPrefetchUrls, symbolsToPrefetch()", e);
        }
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, manifest2, mapper, buildBase) {
  const prefetchResources = [];
  const listeners = snapshotResult == null ? void 0 : snapshotResult.listeners;
  const stateObjs = snapshotResult == null ? void 0 : snapshotResult.objs;
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
function createEl(tagName, doc) {
  return {
    nodeType: tagName === ":virtual" ? 111 : 1,
    nodeName: tagName.toUpperCase(),
    localName: tagName,
    ownerDocument: doc,
    isConnected: true,
    _qc_: null,
    __virtual: null,
    "q:id": null
  };
}
function createSimpleDocument() {
  const doc = {
    nodeType: 9,
    parentElement: null,
    ownerDocument: null,
    createElement(tagName) {
      return createEl(tagName, doc);
    }
  };
  return doc;
}
var qDev = globalThis.qDev === true;
var EMPTY_ARRAY = [];
var EMPTY_OBJ = {};
if (qDev) {
  Object.freeze(EMPTY_ARRAY);
  Object.freeze(EMPTY_OBJ);
  Error.stackTraceLimit = 9999;
}
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(rootNode, opts) {
  var _a, _b, _c, _d, _e, _f, _g;
  let stream = opts.stream;
  let bufferSize = 0;
  let totalSize = 0;
  let networkFlushes = 0;
  let firstFlushTime = 0;
  const doc = createSimpleDocument();
  const inOrderStreaming = (_b = (_a = opts.streaming) == null ? void 0 : _a.inOrder) != null ? _b : {
    strategy: "auto",
    initialChunkSize: 3e4,
    minimunChunkSize: 1024
  };
  const containerTagName = (_c = opts.containerTagName) != null ? _c : "html";
  const containerAttributes = (_d = opts.containerAttributes) != null ? _d : {};
  const buffer = [];
  const nativeStream = stream;
  const firstFlushTimer = createTimer();
  function flush() {
    buffer.forEach((chunk) => nativeStream.write(chunk));
    buffer.length = 0;
    bufferSize = 0;
    networkFlushes++;
    if (networkFlushes === 1) {
      firstFlushTime = firstFlushTimer();
    }
  }
  function enqueue(chunk) {
    bufferSize += chunk.length;
    totalSize += chunk.length;
    buffer.push(chunk);
  }
  switch (inOrderStreaming.strategy) {
    case "disabled":
      stream = {
        write: enqueue
      };
      break;
    case "auto":
      let count = 0;
      const minimunChunkSize = (_e = inOrderStreaming.minimunChunkSize) != null ? _e : 0;
      const initialChunkSize = (_f = inOrderStreaming.initialChunkSize) != null ? _f : 0;
      stream = {
        write(chunk) {
          enqueue(chunk);
          if (chunk === "<!--qkssr-pu-->") {
            count++;
          } else if (count > 0 && chunk === "<!--qkssr-po-->") {
            count--;
          }
          const chunkSize = networkFlushes === 0 ? initialChunkSize : minimunChunkSize;
          if (count === 0 && bufferSize >= chunkSize) {
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
  const mapper = computeSymbolMapper(opts.manifest);
  await setServerPlatform(doc, opts, mapper);
  let prefetchResources = [];
  let snapshotResult = null;
  const injections = (_g = opts.manifest) == null ? void 0 : _g.injections;
  const beforeContent = injections ? injections.map((injection) => {
    var _a2;
    return jsx(injection.tag, (_a2 = injection.attributes) != null ? _a2 : EMPTY_OBJ);
  }) : void 0;
  const renderTimer = createTimer();
  let renderTime = 0;
  let snapshotTime = 0;
  const renderSymbols = [];
  await renderSSR(doc, rootNode, {
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
      prefetchResources = getPrefetchResources(snapshotResult, opts, mapper);
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
      collectRenderSymbols(renderSymbols, contexts);
      snapshotTime = snapshotTimer();
      return jsx(Fragment, { children });
    }
  });
  flush();
  const result = {
    prefetchResources,
    snapshotResult,
    flushes: networkFlushes,
    manifest: opts.manifest,
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
function computeSymbolMapper(manifest2) {
  if (manifest2) {
    const mapper = {};
    Object.entries(manifest2.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return mapper;
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
const manifest = { "symbols": { "s_PeDTn2z80A4": { "origin": "components/post/post.tsx", "displayName": "Post_component__Fragment_div_div_div_h1_onClick", "canonicalFilename": "s_pedtn2z80a4", "hash": "PeDTn2z80A4", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_bSNo02BOSeo" }, "s_TlrTEIpSGyw": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_div_onClick", "canonicalFilename": "s_tlrteipsgyw", "hash": "TlrTEIpSGyw", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_hA9UPaY8sNQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onClick", "canonicalFilename": "s_ha9upay8snq", "hash": "hA9UPaY8sNQ", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_p8802htc8lU": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_div_div_div_button_onClick", "canonicalFilename": "s_p8802htc8lu", "hash": "p8802htc8lU", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_t8Q6Qpbu0pE": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_button_onClick", "canonicalFilename": "s_t8q6qpbu0pe", "hash": "t8Q6Qpbu0pE", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_skxgNVWVOT8": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onMouseOver", "canonicalFilename": "s_skxgnvwvot8", "hash": "skxgNVWVOT8", "ctxKind": "event", "ctxName": "onMouseOver$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_uVE5iM9H73c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onQVisible", "canonicalFilename": "s_uve5im9h73c", "hash": "uVE5iM9H73c", "ctxKind": "event", "ctxName": "onQVisible$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_AaAlzKH0KlQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component_useWatch", "canonicalFilename": "s_aaalzkh0klq", "hash": "AaAlzKH0KlQ", "ctxKind": "function", "ctxName": "useWatch$", "captures": true, "parent": "s_z1nvHyEppoI" }, "s_06hTRPZlBNE": { "origin": "root.tsx", "displayName": "root_component", "canonicalFilename": "s_06htrpzlbne", "hash": "06hTRPZlBNE", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_0e3es3vnWuk": { "origin": "routes/index@index.tsx", "displayName": "index_index_component", "canonicalFilename": "s_0e3es3vnwuk", "hash": "0e3es3vnWuk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_26hfKJ9I4hk": { "origin": "routes/profile/[proid]/index@profile.tsx", "displayName": "index_profile_component", "canonicalFilename": "s_26hfkj9i4hk", "hash": "26hfKJ9I4hk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_BtnGjf3PdHw": { "origin": "components/sidebar/sidebar.tsx", "displayName": "Sidebar_component", "canonicalFilename": "s_btngjf3pdhw", "hash": "BtnGjf3PdHw", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_NcbFhH0Rq0M": { "origin": "routes/layout-index.tsx", "displayName": "layout_index_component", "canonicalFilename": "s_ncbfhh0rq0m", "hash": "NcbFhH0Rq0M", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_Xo5tmaGPZOs": { "origin": "routes/posts/[postid]/index.tsx", "displayName": "_postid__component", "canonicalFilename": "s_xo5tmagpzos", "hash": "Xo5tmaGPZOs", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_aeoMBoP047Y": { "origin": "routes/profile/[proid]/layout-profile.tsx", "displayName": "layout_profile_component", "canonicalFilename": "s_aeombop047y", "hash": "aeoMBoP047Y", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_bSNo02BOSeo": { "origin": "components/post/post.tsx", "displayName": "Post_component", "canonicalFilename": "s_bsno02boseo", "hash": "bSNo02BOSeo", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_gm3f0H6v3fA": { "origin": "components/header/header.tsx", "displayName": "Header_component", "canonicalFilename": "s_gm3f0h6v3fa", "hash": "gm3f0H6v3fA", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_j5h3enAr0HE": { "origin": "routes/clips/index.tsx", "displayName": "clips_component", "canonicalFilename": "s_j5h3enar0he", "hash": "j5h3enAr0HE", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_mYsiJcA4IBc": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component", "canonicalFilename": "s_mysijca4ibc", "hash": "mYsiJcA4IBc", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_n0b0sGHmkUY": { "origin": "routes/favs/index.tsx", "displayName": "favs_component", "canonicalFilename": "s_n0b0sghmkuy", "hash": "n0b0sGHmkUY", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_nd8yk3KO22c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "RouterOutlet_component", "canonicalFilename": "s_nd8yk3ko22c", "hash": "nd8yk3KO22c", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_tD1BXnbDybA": { "origin": "routes/settings/index.tsx", "displayName": "settings_component", "canonicalFilename": "s_td1bxnbdyba", "hash": "tD1BXnbDybA", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_uaqIf5ac0DY": { "origin": "routes/vids/index.tsx", "displayName": "vids_component", "canonicalFilename": "s_uaqif5ac0dy", "hash": "uaqIf5ac0DY", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_uwWhp2E5O4I": { "origin": "components/menu/menu.tsx", "displayName": "Menu_component", "canonicalFilename": "s_uwwhp2e5o4i", "hash": "uwWhp2E5O4I", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_yM0L9NCDGUk": { "origin": "routes/layout.tsx", "displayName": "layout_component", "canonicalFilename": "s_ym0l9ncdguk", "hash": "yM0L9NCDGUk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_z1nvHyEppoI": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component", "canonicalFilename": "s_z1nvhyeppoi", "hash": "z1nvHyEppoI", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_zgN7XgNXC7Q": { "origin": "components/head/head.tsx", "displayName": "Head_component", "canonicalFilename": "s_zgn7xgnxc7q", "hash": "zgN7XgNXC7Q", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_WZUT0oi3I0A": { "origin": "root.tsx", "displayName": "root_component_useStyles", "canonicalFilename": "s_wzut0oi3i0a", "hash": "WZUT0oi3I0A", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_06hTRPZlBNE" } }, "mapping": { "s_PeDTn2z80A4": "q-b4c7c099.js", "s_TlrTEIpSGyw": "q-687fbe22.js", "s_hA9UPaY8sNQ": "q-4a5fa1e1.js", "s_p8802htc8lU": "q-687fbe22.js", "s_t8Q6Qpbu0pE": "q-687fbe22.js", "s_skxgNVWVOT8": "q-4a5fa1e1.js", "s_uVE5iM9H73c": "q-4a5fa1e1.js", "s_AaAlzKH0KlQ": "q-b4621644.js", "s_06hTRPZlBNE": "q-2b6484ca.js", "s_0e3es3vnWuk": "q-687fbe22.js", "s_26hfKJ9I4hk": "q-03e9941d.js", "s_BtnGjf3PdHw": "q-6232aac8.js", "s_NcbFhH0Rq0M": "q-9e917870.js", "s_Xo5tmaGPZOs": "q-8735d118.js", "s_aeoMBoP047Y": "q-c5f2b5d0.js", "s_bSNo02BOSeo": "q-b4c7c099.js", "s_gm3f0H6v3fA": "q-80fbf83e.js", "s_j5h3enAr0HE": "q-860f6b19.js", "s_mYsiJcA4IBc": "q-4a5fa1e1.js", "s_n0b0sGHmkUY": "q-47cb966c.js", "s_nd8yk3KO22c": "q-0176c64b.js", "s_tD1BXnbDybA": "q-f0ab9a98.js", "s_uaqIf5ac0DY": "q-55884fb1.js", "s_uwWhp2E5O4I": "q-07309be4.js", "s_yM0L9NCDGUk": "q-1f04af5a.js", "s_z1nvHyEppoI": "q-b4621644.js", "s_zgN7XgNXC7Q": "q-bb1f9e8a.js", "s_WZUT0oi3I0A": "q-2b6484ca.js" }, "bundles": { "q-0176c64b.js": { "size": 269, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_RouterOutlet.js", "src/s_nd8yk3ko22c.js"], "symbols": ["s_nd8yk3KO22c"] }, "q-03e9941d.js": { "size": 178, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_index_profile.js", "src/s_26hfkj9i4hk.js"], "symbols": ["s_26hfKJ9I4hk"] }, "q-07309be4.js": { "size": 2286, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_Menu.js", "src/s_uwwhp2e5o4i.js"], "symbols": ["s_uwWhp2E5O4I"] }, "q-1288b5e3.js": { "size": 180, "imports": ["q-65badc42.js"], "dynamicImports": ["q-55884fb1.js"], "origins": ["src/routes/vids/index.js"] }, "q-1439a3ac.js": { "size": 712, "imports": ["q-65badc42.js"], "dynamicImports": ["q-03e9941d.js"], "origins": ["src/routes/profile/[proid]/index@profile.js"] }, "q-15642003.js": { "size": 714, "imports": ["q-65badc42.js"], "dynamicImports": ["q-c5f2b5d0.js"], "origins": ["src/routes/profile/[proid]/layout-profile.js"] }, "q-1a063a29.js": { "size": 158, "imports": ["q-65badc42.js"], "dynamicImports": ["q-9e917870.js"], "origins": ["src/routes/layout-index.js"] }, "q-1f04af5a.js": { "size": 292, "imports": ["q-65badc42.js", "q-d0d0dbfd.js"], "origins": ["src/entry_layout.js", "src/s_ym0l9ncdguk.js"], "symbols": ["s_yM0L9NCDGUk"] }, "q-237c0038.js": { "size": 158, "imports": ["q-65badc42.js"], "dynamicImports": ["q-1f04af5a.js"], "origins": ["src/routes/layout.js"] }, "q-25e8cbed.js": { "size": 180, "imports": ["q-65badc42.js"], "dynamicImports": ["q-687fbe22.js"], "origins": ["src/routes/index@index.js"] }, "q-2b6484ca.js": { "size": 30511, "imports": ["q-65badc42.js"], "dynamicImports": ["q-0176c64b.js", "q-4a5fa1e1.js", "q-b4621644.js", "q-bb1f9e8a.js"], "origins": ["node_modules/@builder.io/qwik-city/index.qwik.mjs", "src/components/head/head.js", "src/entry_root.js", "src/modern.css?used", "src/s_06htrpzlbne.js", "src/s_wzut0oi3i0a.js"], "symbols": ["s_06hTRPZlBNE", "s_WZUT0oi3I0A"] }, "q-47cb966c.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_favs.js", "src/s_n0b0sghmkuy.js"], "symbols": ["s_n0b0sGHmkUY"] }, "q-4a5fa1e1.js": { "size": 922, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_Link.js", "src/s_ha9upay8snq.js", "src/s_mysijca4ibc.js", "src/s_skxgnvwvot8.js", "src/s_uve5im9h73c.js"], "symbols": ["s_hA9UPaY8sNQ", "s_mYsiJcA4IBc", "s_skxgNVWVOT8", "s_uVE5iM9H73c"] }, "q-55884fb1.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_vids.js", "src/s_uaqif5ac0dy.js"], "symbols": ["s_uaqIf5ac0DY"] }, "q-5dd1a945.js": { "size": 180, "imports": ["q-65badc42.js"], "dynamicImports": ["q-47cb966c.js"], "origins": ["src/routes/favs/index.js"] }, "q-6232aac8.js": { "size": 3494, "imports": ["q-65badc42.js"], "origins": ["src/entry_Sidebar.js", "src/s_btngjf3pdhw.js"], "symbols": ["s_BtnGjf3PdHw"] }, "q-65badc42.js": { "size": 33254, "dynamicImports": ["q-2b6484ca.js"], "origins": ["\0vite/preload-helper", "node_modules/@builder.io/qwik/core.min.mjs", "src/root.js"] }, "q-687fbe22.js": { "size": 8194, "imports": ["q-65badc42.js"], "dynamicImports": ["q-b4c7c099.js"], "origins": ["src/components/post/post.js", "src/entry_index_index.js", "src/s_0e3es3vnwuk.js", "src/s_p8802htc8lu.js", "src/s_t8q6qpbu0pe.js", "src/s_tlrteipsgyw.js"], "symbols": ["s_0e3es3vnWuk", "s_p8802htc8lU", "s_t8Q6Qpbu0pE", "s_TlrTEIpSGyw"] }, "q-80fbf83e.js": { "size": 104, "imports": ["q-65badc42.js"], "origins": ["src/entry_Header.js", "src/s_gm3f0h6v3fa.js"], "symbols": ["s_gm3f0H6v3fA"] }, "q-860f6b19.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_clips.js", "src/s_j5h3enar0he.js"], "symbols": ["s_j5h3enAr0HE"] }, "q-8735d118.js": { "size": 1587, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry__postid_.js", "src/s_xo5tmagpzos.js"], "symbols": ["s_Xo5tmaGPZOs"] }, "q-9c36486d.js": { "size": 58, "imports": ["q-65badc42.js"] }, "q-9e917870.js": { "size": 297, "imports": ["q-65badc42.js", "q-d0d0dbfd.js"], "origins": ["src/entry_layout_index.js", "src/s_ncbfhh0rq0m.js"], "symbols": ["s_NcbFhH0Rq0M"] }, "q-b4621644.js": { "size": 1489, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "dynamicImports": ["q-df1454c4.js"], "origins": ["@builder.io/qwik/build", "src/entry_QwikCity.js", "src/s_aaalzkh0klq.js", "src/s_z1nvhyeppoi.js"], "symbols": ["s_AaAlzKH0KlQ", "s_z1nvHyEppoI"] }, "q-b4c7c099.js": { "size": 1847, "imports": ["q-65badc42.js"], "origins": ["src/entry_Post.js", "src/s_bsno02boseo.js", "src/s_pedtn2z80a4.js"], "symbols": ["s_bSNo02BOSeo", "s_PeDTn2z80A4"] }, "q-b4c84de9.js": { "size": 158, "imports": ["q-65badc42.js"], "dynamicImports": ["q-8735d118.js"], "origins": ["src/routes/posts/[postid]/index.js"] }, "q-bb1f9e8a.js": { "size": 893, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_Head.js", "src/s_zgn7xgnxc7q.js"], "symbols": ["s_zgN7XgNXC7Q"] }, "q-c5f2b5d0.js": { "size": 1559, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_layout_profile.js", "src/s_aeombop047y.js"], "symbols": ["s_aeoMBoP047Y"] }, "q-d0d0dbfd.js": { "size": 326, "imports": ["q-65badc42.js"], "dynamicImports": ["q-07309be4.js", "q-6232aac8.js", "q-80fbf83e.js"], "origins": ["src/components/header/header.js", "src/components/menu/menu.js", "src/components/sidebar/sidebar.js"] }, "q-df1454c4.js": { "size": 900, "imports": ["q-65badc42.js"], "dynamicImports": ["q-1288b5e3.js", "q-1439a3ac.js", "q-15642003.js", "q-1a063a29.js", "q-237c0038.js", "q-25e8cbed.js", "q-5dd1a945.js", "q-b4c84de9.js", "q-e582bef0.js", "q-f089809a.js"], "origins": ["@qwik-city-plan"] }, "q-e582bef0.js": { "size": 189, "imports": ["q-65badc42.js"], "dynamicImports": ["q-f0ab9a98.js"], "origins": ["src/routes/settings/index.js"] }, "q-f089809a.js": { "size": 181, "imports": ["q-65badc42.js"], "dynamicImports": ["q-860f6b19.js"], "origins": ["src/routes/clips/index.js"] }, "q-f0ab9a98.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_settings.js", "src/s_td1bxnbdyba.js"], "symbols": ["s_tD1BXnbDybA"] } }, "injections": [{ "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-30a9d718.css" } }], "version": "1", "options": { "target": "client", "buildMode": "production", "forceFullBuild": true, "entryStrategy": { "type": "smart" } }, "platform": { "qwik": "0.0.108", "vite": "", "rollup": "2.77.3", "env": "node", "os": "linux", "node": "18.8.0" } };
const isServer = true;
const isBrowser = false;
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
      class: "menumain",
      children: [
        /* @__PURE__ */ jsx(Link, {
          id: "central",
          href: "/",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-2  py-3 lg:py-[8px] ${loc.pathname === "/" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
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
          id: "central",
          href: "/vids",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-2  py-3 lg:py-[8px] ${loc.pathname === "/vids" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
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
          id: "central",
          href: "/clips",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-2  py-3 lg:py-[8px] ${loc.pathname === "/clips" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
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
          id: "central",
          href: "/favs",
          class: mutable(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-2  py-3 lg:py-[8px] ${loc.pathname === "/favs" ? "selected-sidebar-bg selected-sidebar-text selected-sidebar-icon" : "unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon"}`),
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
        class: "flex flex-row-reverse md:flex-row w-screen overflow-hidden ",
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
        class: "flex flex-row-reverse md:flex-row w-screen flex-grow overflow-hidden ",
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
var Post = /* @__PURE__ */ componentQrl(inlinedQrl((props) => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("div", {
      class: "flex flex-row border-b border-b-[#121212] ",
      children: [
        /* @__PURE__ */ jsx("img", {
          class: `hidden w-full lg:max-w-[430px] max-h-auto max-w-[350px] absolute  h-full`,
          src: props.image
        }),
        /* @__PURE__ */ jsx("div", {
          class: "w-max h-full py-4 px-[16px] bg-[#121212] flex flex-col space-y-[18px]",
          children: [
            /* @__PURE__ */ jsx("span", {
              class: "text-neutral-500 iconify w-4 h-4",
              "data-icon": "ant-design:heart"
            }),
            /* @__PURE__ */ jsx("span", {
              class: "text-neutral-500 iconify w-4 h-4",
              "data-icon": "ant-design:message"
            })
          ]
        }),
        /* @__PURE__ */ jsx("div", {
          class: "flex flex-col px-4 py-4",
          children: [
            /* @__PURE__ */ jsx("div", {
              class: "flex flex-row bg-white bg-opacity-[3%] w-max px-[10px] py-[6px] rounded-sm items-center content-center mb-[8px] md:mb-[10px] space-x-[8px]",
              children: [
                /* @__PURE__ */ jsx("img", {
                  class: "w-[14px] h-[14px] rounded-full ",
                  src: props.poster,
                  children: " "
                }),
                /* @__PURE__ */ jsx("h1", {
                  class: "text-[9.5px] md:text-[10.5px] font-sans mt-[1.5px] md:mt-[1px] text-neutral-400 font-medium ",
                  children: props.user
                })
              ]
            }),
            /* @__PURE__ */ jsx("div", {
              class: "",
              children: [
                /* @__PURE__ */ jsx("h1", {
                  onClick$: inlinedQrl(() => {
                    const [props2] = useLexicalScope();
                    return window.location.href = `/posts/${props2.id}`;
                  }, "s_PeDTn2z80A4", [
                    props
                  ]),
                  class: ` md:leading-normal leading-5 text-[14.5px] cursor-pointer md:text-[15.9px] lg:text-[16.5px] font-inter  ${`md:mt-[0px] mt-[1px] mb-[4px]`} font-medium text-neutral-300 md:opacity-90 `,
                  children: props.title
                }),
                /* @__PURE__ */ jsx("h1", {
                  class: "text-[12px] md:text-[13.5px] font-inter text-[#7b7b7b] ",
                  children: props.content
                }),
                /* @__PURE__ */ jsx("div", {
                  class: `  py-3 pb-[2px] pt-[16px] ${!props.image ? `hidden` : `flex`}  `,
                  children: [
                    "    ",
                    /* @__PURE__ */ jsx("img", {
                      class: "w-full lg:max-w-[430px] max-h-full max-w-[350px] mx-auto md:mx-0 h-full",
                      src: props.image
                    })
                  ]
                })
              ]
            })
          ]
        }),
        /* @__PURE__ */ jsx("div", {
          class: ""
        })
      ]
    })
  });
}, "s_bSNo02BOSeo"));
const index_index = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  var publishpopup = useStore({
    state: false
  });
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("div", {
      class: "flex flex-col flex-grow md:relative ",
      children: [
        /* @__PURE__ */ jsx("button", {
          onClick$: inlinedQrl(() => {
            const [publishpopup2] = useLexicalScope();
            return publishpopup2.state = !publishpopup2.state;
          }, "s_t8Q6Qpbu0pE", [
            publishpopup
          ]),
          class: "absolute flex flex-row space-x-[10px] items-center content-center right-10 bottom-10 md:right-15 md:bottom-15 lg:bottom:20 text-white font-semibold font-inter md:text-md text-sm md:py-4 md:px-7 bg-blue-900 rounded-full",
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
          class: "flex flex-grow flex-col bg-black bg-opacity-10 md:bg-opacity-0 md:rounded-md ",
          children: [
            /* @__PURE__ */ jsx(Post, {
              id: "breme",
              title: "breme",
              about: "This is the very first post ever on this app!",
              user: "TeamEvolt",
              username: "@TeamEvolt",
              poster: "https://picsum.photos/300/400",
              content: "This is the first post on #evolt https://evoltchat.com",
              likes: "1",
              comments: "0",
              published: "Yesterday"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "rant",
              title: "I love how professors still rant about For Loop being unrealistic",
              about: "2019",
              user: "Admin - Evolt",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "cmon guys for loop is always better than while and still some java nerds claim for to be a memory hog. guys grow up for fcks sake",
              likes: "3",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "first",
              title: "First Image Post",
              about: "2019",
              user: "Admin - Evolt",
              image: "https://picsum.photos/500/600",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "Image Posting test",
              likes: "0",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "breme",
              title: "breme",
              about: "This is the very first post ever on this app!",
              user: "TeamEvolt",
              username: "@TeamEvolt",
              poster: "https://picsum.photos/300/400",
              content: "This is the first post on #evolt https://evoltchat.com",
              likes: "1",
              comments: "0",
              published: "Yesterday"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "rant",
              title: "I love how professors still rant about For Loop being unrealistic",
              about: "2019",
              user: "Admin - Evolt",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "cmon guys for loop is always better than while and still some java nerds claim for to be a memory hog. guys grow up for fcks sake",
              likes: "3",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "first",
              title: "First Image Post",
              about: "2019",
              user: "Admin - Evolt",
              image: "https://picsum.photos/500/600",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "Image Posting test",
              likes: "0",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "breme",
              title: "breme",
              about: "This is the very first post ever on this app!",
              user: "TeamEvolt",
              username: "@TeamEvolt",
              poster: "https://picsum.photos/300/400",
              content: "This is the first post on #evolt https://evoltchat.com",
              likes: "1",
              comments: "0",
              published: "Yesterday"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "rant",
              title: "I love how professors still rant about For Loop being unrealistic",
              about: "2019",
              user: "Admin - Evolt",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "cmon guys for loop is always better than while and still some java nerds claim for to be a memory hog. guys grow up for fcks sake",
              likes: "3",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "first",
              title: "First Image Post",
              about: "2019",
              user: "Admin - Evolt",
              image: "https://picsum.photos/500/600",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "Image Posting test",
              likes: "0",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "breme",
              title: "breme",
              about: "This is the very first post ever on this app!",
              user: "TeamEvolt",
              username: "@TeamEvolt",
              poster: "https://picsum.photos/300/400",
              content: "This is the first post on #evolt https://evoltchat.com",
              likes: "1",
              comments: "0",
              published: "Yesterday"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "rant",
              title: "I love how professors still rant about For Loop being unrealistic",
              about: "2019",
              user: "Admin - Evolt",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "cmon guys for loop is always better than while and still some java nerds claim for to be a memory hog. guys grow up for fcks sake",
              likes: "3",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "first",
              title: "First Image Post",
              about: "2019",
              user: "Admin - Evolt",
              image: "https://picsum.photos/500/600",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "Image Posting test",
              likes: "0",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "breme",
              title: "breme",
              about: "This is the very first post ever on this app!",
              user: "TeamEvolt",
              username: "@TeamEvolt",
              poster: "https://picsum.photos/300/400",
              content: "This is the first post on #evolt https://evoltchat.com",
              likes: "1",
              comments: "0",
              published: "Yesterday"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "rant",
              title: "I love how professors still rant about For Loop being unrealistic",
              about: "2019",
              user: "Admin - Evolt",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "cmon guys for loop is always better than while and still some java nerds claim for to be a memory hog. guys grow up for fcks sake",
              likes: "3",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "first",
              title: "First Image Post",
              about: "2019",
              user: "Admin - Evolt",
              image: "https://picsum.photos/500/600",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "Image Posting test",
              likes: "0",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "breme",
              title: "breme",
              about: "This is the very first post ever on this app!",
              user: "TeamEvolt",
              username: "@TeamEvolt",
              poster: "https://picsum.photos/300/400",
              content: "This is the first post on #evolt https://evoltchat.com",
              likes: "1",
              comments: "0",
              published: "Yesterday"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "rant",
              title: "I love how professors still rant about For Loop being unrealistic",
              about: "2019",
              user: "Admin - Evolt",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "cmon guys for loop is always better than while and still some java nerds claim for to be a memory hog. guys grow up for fcks sake",
              likes: "3",
              comments: "0",
              published: "2 Days Ago"
            }),
            /* @__PURE__ */ jsx(Post, {
              id: "first",
              title: "First Image Post",
              about: "2019",
              user: "Admin - Evolt",
              image: "https://picsum.photos/500/600",
              username: "@AdminEvolt",
              poster: "https://picsum.photos/200/300",
              content: "Image Posting test",
              likes: "0",
              comments: "0",
              published: "2 Days Ago"
            })
          ]
        })
      ]
    })
  });
}, "s_0e3es3vnWuk"));
const head$4 = {
  title: "Home"
};
const Indexindex = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index_index,
  head: head$4
}, Symbol.toStringTag, { value: "Module" }));
const index$4 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "h-screen flex flex-col flex-grow"
  });
}, "s_j5h3enAr0HE"));
const head$3 = {
  title: "Clips"
};
const Clips = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$4,
  head: head$3
}, Symbol.toStringTag, { value: "Module" }));
const index$3 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "h-screen flex flex-col flex-grow"
  });
}, "s_n0b0sGHmkUY"));
const head$2 = {
  title: "Favs"
};
const Favs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
  [/^\/$/, [Layoutindex, () => Indexindex], void 0, "/", ["q-1a063a29.js", "q-25e8cbed.js"]],
  [/^\/clips\/?$/, [Layout, () => Clips], void 0, "/clips", ["q-237c0038.js", "q-f089809a.js"]],
  [/^\/favs\/?$/, [Layout, () => Favs], void 0, "/favs", ["q-237c0038.js", "q-5dd1a945.js"]],
  [/^\/settings\/?$/, [Layout, () => Settings], void 0, "/settings", ["q-237c0038.js", "q-e582bef0.js"]],
  [/^\/vids\/?$/, [Layout, () => Vids], void 0, "/vids", ["q-237c0038.js", "q-1288b5e3.js"]],
  [/^\/posts\/([^/]+?)\/?$/, [Layout, () => PostsPostid], ["postid"], "/posts/[postid]", ["q-237c0038.js", "q-b4c84de9.js"]],
  [/^\/profile\/([^/]+?)\/?$/, [Layout, ProfileProidLayoutprofile, () => ProfileProidIndexprofile], ["proid"], "/profile/[proid]", ["q-237c0038.js", "q-15642003.js", "q-1439a3ac.js"]]
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
const ContentContext = /* @__PURE__ */ createContext("qc-c");
const ContentInternalContext = /* @__PURE__ */ createContext("qc-ic");
const DocumentHeadContext = /* @__PURE__ */ createContext("qc-h");
const RouteLocationContext = /* @__PURE__ */ createContext("qc-l");
const RouteNavigateContext = /* @__PURE__ */ createContext("qc-n");
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
  const pagePathname = new URL(href).pathname;
  const endpointUrl = getClientEndpointPath(pagePathname);
  const now = Date.now();
  const expiration = 6e5;
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
    onMouseOver$: inlinedQrl(() => {
      const [prefetchUrl2] = useLexicalScope();
      return prefetchLinkResources(prefetchUrl2, false);
    }, "Link_component_a_onMouseOver_skxgNVWVOT8", [
      prefetchUrl
    ]),
    onQVisible$: inlinedQrl(() => {
      const [prefetchUrl2] = useLexicalScope();
      return prefetchLinkResources(prefetchUrl2, true);
    }, "Link_component_a_onQVisible_uVE5iM9H73c", [
      prefetchUrl
    ]),
    children: /* @__PURE__ */ jsx(Slot, {})
  });
}, "Link_component_mYsiJcA4IBc"));
const prefetchLinkResources = (prefetchUrl, isOnVisible) => {
  if (!windowInnerWidth)
    windowInnerWidth = window.innerWidth;
  if (prefetchUrl && (!isOnVisible || isOnVisible && windowInnerWidth < 520))
    loadClientData(prefetchUrl);
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
const styles = '/*\n! tailwindcss v3.0.24 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type=\'button\'],\n[type=\'reset\'],\n[type=\'submit\'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/*\nEnsure the default browser behavior of the `hidden` attribute.\n*/\n\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.static {\n  position: static;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.sticky {\n  position: sticky;\n}\n.right-10 {\n  right: 2.5rem;\n}\n.bottom-10 {\n  bottom: 2.5rem;\n}\n.right-0 {\n  right: 0px;\n}\n.top-\\[9px\\] {\n  top: 9px;\n}\n.m-4 {\n  margin: 1rem;\n}\n.m-3 {\n  margin: 0.75rem;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.my-1 {\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n}\n.mx-2 {\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n}\n.mx-5 {\n  margin-left: 1.25rem;\n  margin-right: 1.25rem;\n}\n.mx-4 {\n  margin-left: 1rem;\n  margin-right: 1rem;\n}\n.mx-0 {\n  margin-left: 0px;\n  margin-right: 0px;\n}\n.my-auto {\n  margin-top: auto;\n  margin-bottom: auto;\n}\n.mx-1 {\n  margin-left: 0.25rem;\n  margin-right: 0.25rem;\n}\n.my-4 {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n}\n.my-\\[17px\\] {\n  margin-top: 17px;\n  margin-bottom: 17px;\n}\n.my-5 {\n  margin-top: 1.25rem;\n  margin-bottom: 1.25rem;\n}\n.ml-auto {\n  margin-left: auto;\n}\n.mt-0 {\n  margin-top: 0px;\n}\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\n.mr-6 {\n  margin-right: 1.5rem;\n}\n.mr-1 {\n  margin-right: 0.25rem;\n}\n.mb-\\[8px\\] {\n  margin-bottom: 8px;\n}\n.mt-\\[1\\.5px\\] {\n  margin-top: 1.5px;\n}\n.mt-\\[1px\\] {\n  margin-top: 1px;\n}\n.mb-\\[4px\\] {\n  margin-bottom: 4px;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-6 {\n  margin-top: 1.5rem;\n}\n.mr-auto {\n  margin-right: auto;\n}\n.mb-0 {\n  margin-bottom: 0px;\n}\n.mb-\\[13px\\] {\n  margin-bottom: 13px;\n}\n.mt-7 {\n  margin-top: 1.75rem;\n}\n.mt-3 {\n  margin-top: 0.75rem;\n}\n.inline-block {\n  display: inline-block;\n}\n.flex {\n  display: flex;\n}\n.hidden {\n  display: none;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-\\[18px\\] {\n  height: 18px;\n}\n.h-32 {\n  height: 8rem;\n}\n.h-8 {\n  height: 2rem;\n}\n.h-full {\n  height: 100%;\n}\n.h-4 {\n  height: 1rem;\n}\n.h-\\[14px\\] {\n  height: 14px;\n}\n.h-10 {\n  height: 2.5rem;\n}\n.h-auto {\n  height: auto;\n}\n.h-20 {\n  height: 5rem;\n}\n.h-max {\n  height: -webkit-max-content;\n  height: -moz-max-content;\n  height: max-content;\n}\n.h-screen {\n  height: 100vh;\n}\n.h-44 {\n  height: 11rem;\n}\n.max-h-full {\n  max-height: 100%;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-\\[18px\\] {\n  width: 18px;\n}\n.w-72 {\n  width: 18rem;\n}\n.w-screen {\n  width: 100vw;\n}\n.w-44 {\n  width: 11rem;\n}\n.w-8 {\n  width: 2rem;\n}\n.w-full {\n  width: 100%;\n}\n.w-max {\n  width: -webkit-max-content;\n  width: -moz-max-content;\n  width: max-content;\n}\n.w-4 {\n  width: 1rem;\n}\n.w-\\[14px\\] {\n  width: 14px;\n}\n.w-10 {\n  width: 2.5rem;\n}\n.w-20 {\n  width: 5rem;\n}\n.w-auto {\n  width: auto;\n}\n.max-w-\\[350px\\] {\n  max-width: 350px;\n}\n.flex-shrink-0 {\n  flex-shrink: 0;\n}\n.flex-grow {\n  flex-grow: 1;\n}\n.grow {\n  flex-grow: 1;\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.flex-row {\n  flex-direction: row;\n}\n.flex-row-reverse {\n  flex-direction: row-reverse;\n}\n.flex-col {\n  flex-direction: column;\n}\n.content-center {\n  align-content: center;\n}\n.items-center {\n  align-items: center;\n}\n.space-x-\\[10px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(10px * var(--tw-space-x-reverse));\n  margin-left: calc(10px * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-5 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(1.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1rem * var(--tw-space-x-reverse));\n  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-\\[18px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(18px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(18px * var(--tw-space-y-reverse));\n}\n.space-x-\\[8px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(8px * var(--tw-space-x-reverse));\n  margin-left: calc(8px * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-\\[1\\.5px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1.5px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1.5px * var(--tw-space-y-reverse));\n}\n.space-x-8 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(2rem * var(--tw-space-x-reverse));\n  margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-\\[22px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(22px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(22px * var(--tw-space-y-reverse));\n}\n.space-y-\\[0px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0px * var(--tw-space-y-reverse));\n}\n.space-x-\\[12px\\] > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(12px * var(--tw-space-x-reverse));\n  margin-left: calc(12px * calc(1 - var(--tw-space-x-reverse)));\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.overflow-y-hidden {\n  overflow-y: hidden;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-sm {\n  border-radius: 0.125rem;\n}\n.rounded-none {\n  border-radius: 0px;\n}\n.rounded-\\[5px\\] {\n  border-radius: 5px;\n}\n.border {\n  border-width: 1px;\n}\n.border-t {\n  border-top-width: 1px;\n}\n.border-b {\n  border-bottom-width: 1px;\n}\n.border-none {\n  border-style: none;\n}\n.border-neutral-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(64 64 64 / var(--tw-border-opacity));\n}\n.border-neutral-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(82 82 82 / var(--tw-border-opacity));\n}\n.border-\\[rgba\\(0\\2c 0\\2c 0\\2c 0\\)\\] {\n  border-color: rgba(0,0,0,0);\n}\n.border-neutral-800 {\n  --tw-border-opacity: 1;\n  border-color: rgb(38 38 38 / var(--tw-border-opacity));\n}\n.border-t-neutral-900 {\n  --tw-border-opacity: 1;\n  border-top-color: rgb(23 23 23 / var(--tw-border-opacity));\n}\n.border-b-\\[\\#121212\\] {\n  --tw-border-opacity: 1;\n  border-bottom-color: rgb(18 18 18 / var(--tw-border-opacity));\n}\n.bg-blue-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 58 138 / var(--tw-bg-opacity));\n}\n.bg-\\[\\#0d0d0d\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(13 13 13 / var(--tw-bg-opacity));\n}\n.bg-blue-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 64 175 / var(--tw-bg-opacity));\n}\n.bg-transparent {\n  background-color: transparent;\n}\n.bg-black {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-\\[\\#121212\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(18 18 18 / var(--tw-bg-opacity));\n}\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity));\n}\n.bg-opacity-10 {\n  --tw-bg-opacity: 0.1;\n}\n.bg-opacity-30 {\n  --tw-bg-opacity: 0.3;\n}\n.bg-opacity-\\[5\\%\\] {\n  --tw-bg-opacity: 5%;\n}\n.bg-opacity-\\[3\\%\\] {\n  --tw-bg-opacity: 3%;\n}\n.bg-opacity-\\[2\\%\\] {\n  --tw-bg-opacity: 2%;\n}\n.bg-cover {\n  background-size: cover;\n}\n.p-6 {\n  padding: 1.5rem;\n}\n.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\n.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n.py-\\[8px\\] {\n  padding-top: 8px;\n  padding-bottom: 8px;\n}\n.px-0 {\n  padding-left: 0px;\n  padding-right: 0px;\n}\n.py-\\[14px\\] {\n  padding-top: 14px;\n  padding-bottom: 14px;\n}\n.py-5 {\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n.px-\\[16px\\] {\n  padding-left: 16px;\n  padding-right: 16px;\n}\n.px-\\[10px\\] {\n  padding-left: 10px;\n  padding-right: 10px;\n}\n.py-\\[6px\\] {\n  padding-top: 6px;\n  padding-bottom: 6px;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-\\[10px\\] {\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n.px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.px-8 {\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n.py-0 {\n  padding-top: 0px;\n  padding-bottom: 0px;\n}\n.pr-\\[44px\\] {\n  padding-right: 44px;\n}\n.pb-\\[2px\\] {\n  padding-bottom: 2px;\n}\n.pt-\\[16px\\] {\n  padding-top: 16px;\n}\n.pt-1 {\n  padding-top: 0.25rem;\n}\n.pt-4 {\n  padding-top: 1rem;\n}\n.pl-1 {\n  padding-left: 0.25rem;\n}\n.pt-0 {\n  padding-top: 0px;\n}\n.pt-5 {\n  padding-top: 1.25rem;\n}\n.pt-\\[1px\\] {\n  padding-top: 1px;\n}\n.pt-\\[18\\.5px\\] {\n  padding-top: 18.5px;\n}\n.pl-\\[6px\\] {\n  padding-left: 6px;\n}\n.pl-\\[1px\\] {\n  padding-left: 1px;\n}\n.pt-\\[12px\\] {\n  padding-top: 12px;\n}\n.text-left {\n  text-align: left;\n}\n.text-center {\n  text-align: center;\n}\n.font-sans {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-\\[12px\\] {\n  font-size: 12px;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.text-\\[13\\.5px\\] {\n  font-size: 13.5px;\n}\n.text-\\[9\\.5px\\] {\n  font-size: 9.5px;\n}\n.text-\\[14\\.5px\\] {\n  font-size: 14.5px;\n}\n.text-\\[13px\\] {\n  font-size: 13px;\n}\n.text-\\[10px\\] {\n  font-size: 10px;\n}\n.text-\\[12\\.75px\\] {\n  font-size: 12.75px;\n}\n.text-\\[15px\\] {\n  font-size: 15px;\n}\n.text-\\[11px\\] {\n  font-size: 11px;\n}\n.text-\\[20px\\] {\n  font-size: 20px;\n}\n.text-\\[14px\\] {\n  font-size: 14px;\n}\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.font-semibold {\n  font-weight: 600;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-medium {\n  font-weight: 500;\n}\n.leading-5 {\n  line-height: 1.25rem;\n}\n.leading-relaxed {\n  line-height: 1.625;\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-neutral-400 {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.text-neutral-300 {\n  --tw-text-opacity: 1;\n  color: rgb(212 212 212 / var(--tw-text-opacity));\n}\n.text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgb(59 130 246 / var(--tw-text-opacity));\n}\n.text-neutral-500 {\n  --tw-text-opacity: 1;\n  color: rgb(115 115 115 / var(--tw-text-opacity));\n}\n.text-\\[\\#7b7b7b\\] {\n  --tw-text-opacity: 1;\n  color: rgb(123 123 123 / var(--tw-text-opacity));\n}\n.text-blue-400 {\n  --tw-text-opacity: 1;\n  color: rgb(96 165 250 / var(--tw-text-opacity));\n}\n.underline {\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\n.opacity-100 {\n  opacity: 1;\n}\n.opacity-90 {\n  opacity: 0.9;\n}\n.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n.font-jost {\n  font-family: "Jost";\n}\n\n@font-face {\n  font-family:"SF-Pro";\n  src: url("/fonts/SF-Pro.ttf") format("truetype");\n}\n\n\n.font-pacifico{\n  font-family: \'Pacifico\', cursive;\n\n}\n\n\n\n\n.selected-sidebar-text {\n  font-weight: 500;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\n.unselected-sidebar-text {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n\n.selected-sidebar-bg {\n  border-radius: 0.375rem;\n  --tw-bg-opacity: 1;\n  background-color: rgb(38 38 38 / var(--tw-bg-opacity));\n}\n\n@media (min-width: 1024px) {\n\n  .selected-sidebar-bg {\n    border-radius: 5px;\n  }\n}\n\n/*bg-white bg-opacity-[3.5%] rounded-md*/\n.unselected-sidebar-bg {\n  border-radius: 0px;\n  background-color: transparent;\n}\n\n.menucont {\n  display: flex;\n  flex-direction: column;\n  padding: 0px;\n}\n\n.sidebarwrapper {\n  margin-left: 0px;\n  margin-right: 0px;\n  display: none;\n  height: auto;\n  flex-direction: column;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.3;\n}\n\n@media (min-width: 768px) {\n\n  .sidebarwrapper {\n    display: flex;\n    padding-top: 12px;\n    padding-bottom: 12px;\n  }\n}\n  \n.colorpicker{\n  background-color: #242424;\n}\n.sidebardivs {\n  margin: 0.5rem;\n  margin-top: 0px;\n  margin-bottom: 0px;\n  margin-bottom: 0.5rem;\n  display: flex;\n  flex-direction: column;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  padding-top: 0px;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.sidebarprofile {\n  margin: 0.5rem;\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n  margin-bottom: 0px;\n  display: flex;\n  flex-direction: column;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0px;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n\n.quicktext {\n  display: none;\n}\n\n  .postcont {\n  border-bottom-width: 1px;\n  --tw-border-opacity: 1;\n  border-bottom-color: rgb(38 38 38 / var(--tw-border-opacity));\n  padding-left: 1rem;\n  padding-right: 1.5rem;\n}\n\n.quickcont {\n  margin-bottom: 0px;\n  margin-top: 16px;\n  display: flex;\n  flex-direction: row;\n  align-content: center;\n  align-items: center;\n  border-radius: 0.125rem;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n  .profiletext {\n  margin-top: 0.25rem;\n  padding-left: 0px;\n  font-size: 14px;\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(212 212 212 / var(--tw-text-opacity));\n  font-family: "Inter";\n}\n  \n  .logtext {\n  margin-top: auto;\n  margin-bottom: auto;\n  margin-right: 0px;\n  margin-left: auto;\n  font-size: 14px;\n  font-weight: 500;\n  --tw-text-opacity: 1;\n  color: rgb(248 113 113 / var(--tw-text-opacity));\n  font-family: "Inter";\n}\n\n.msgcont {\n  display: none;\n}\n\n.sidebarmessage {\n  margin: 0.5rem;\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n  display: flex;\n  flex-direction: column;\n  border-style: none;\n  --tw-bg-opacity: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-bottom: 0.75rem;\n  padding-top: 0.25rem;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.bgcol {\n  display: flex;\n  height: 100vh;\n  width: 100vw;\n  flex-direction: column;\n  --tw-bg-opacity: 1;\n  background-color: rgb(23 23 23 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 100%;\n}\n\n.menumain {\n  display: flex;\n  height: 100vh;\n  flex-direction: column;\n}\n\n.menumain > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n}\n\n.menumain {\n  border-radius: 0px;\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n  border-bottom-color: rgb(31 41 55 / var(--tw-border-opacity));\n  border-left-color: rgb(31 41 55 / var(--tw-border-opacity));\n  --tw-border-opacity: 1;\n  border-left-color: rgb(23 23 23 / var(--tw-border-opacity));\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.3;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n\n@media (min-width: 768px) {\n\n  .menumain {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n}\n\n@media (min-width: 1024px) {\n\n  .menumain {\n    width: 13rem;\n  }\n\n  .menumain > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n  }\n}\n\n.selected-sidebar-icon {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\n.unselected-sidebar-icon {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.tab-item-animate {\n  position: absolute;\n  top: 6px;\n  left: 6px;\n  width: calc(100% - 12px);\n  height: 32px;\n  transform-origin: 0 0;\n  transition: transform 0.25s;\n}\n\n.tabs .tabs-item:first-child.active ~ .tab-item-animate {\n  transform: translateX(0) scaleX(0.333);\n}\n\n.tabs .tabs-item:nth-child(2).active ~ .tab-item-animate {\n  transform: translateX(33.333%) scaleX(0.333);\n}\n.tabs .tabs-item:nth-child(3).active ~ .tab-item-animate {\n  transform: translateX(calc(33.333% * 2)) scaleX(0.333);\n}\n\n\n.tag-selected {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(0 0 0 / var(--tw-border-opacity));\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.9;\n  --tw-text-opacity: 1;\n  color: rgb(23 23 23 / var(--tw-text-opacity));\n}\n\n.tag-unselected {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(82 82 82 / var(--tw-border-opacity));\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.2;\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.font-sf{\n  font-family:"SF-Pro";\n}\n\n.font-inter {\n  font-family: "Inter";\n}\n.code {\n  font-family: "Source Code Pro", monospace;\n  display: block;\n  background-color: white;\n  color: #000000;\n  padding: 1em;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n}\n\n.sidenav {\n  height: 100%; /* 100% Full-height */\n  width: 0; /* 0 width - change this with JavaScript */\n  position: fixed; /* Stay in place */\n  z-index: 1; /* Stay on top */\n  top: 0; /* Stay at the top */\n  left: 0;\n  overflow-x: hidden; /* Disable horizontal scroll */\n  padding-top: 60px; /* Place content 60px from the top */\n  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */\n}\n\n/* The navigation menu links */\n.sidenav a {\n  display: block;\n}\n#midcont {\n  overflow-y: scroll;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n}\n#midcont::-webkit-scrollbar { /* WebKit */\n  width: 0;\n  height: 0;\n}\n.truncate{\ntext-overflow: ellipsis;\n\n/* Needed to make it work */\noverflow: hidden;\nwhite-space: nowrap;\n\n}\n\ndiv.fadeMe {\n  \n  background: rgba(0,0,0,0.7); \n  width:      100%;\n  height:     100%; \n  z-index:    10;\n  top:        0; \n  left:       0; \n  position:   fixed; \n}\n.bg-stickytitle{\n  background-color: #0d0d0d;\n}\n\n#publishtextarea{\n  -webkit-text-size-adjust: none;\n     -moz-text-size-adjust: none;\n          text-size-adjust: none;\n\n}\n\n#posttext{\n  -webkit-text-size-adjust: none;\n     -moz-text-size-adjust: none;\n          text-size-adjust: none;\n\n}\n\n.style13{\n  font-size: 14px;\n}\n\n #publishtextarea:focus {\n  outline: 0;\n}\n#popup{\n  z-index: 20;\n}\n\n#tags {\n  overflow-x: scroll;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n}\n#tags::-webkit-scrollbar { /* WebKit */\n  width: 0;\n  height: 0;\n}\n\n#myInputField {\n  border:1px solid #ddd;\n  padding: 10px;\n  font-size: 14px;\n}\n.coverdiv{\nbackground-image:\n    linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(0, 0, 0, 0.73)),\n}\n\n.tag {\n  padding-top: 2px;\n  padding-bottom: 2px;\n  --tw-text-opacity: 1;\n  color: rgb(59 130 246 / var(--tw-text-opacity));\n}\n\n[contenteditable=true]:empty:before{\n  content: attr(placeholder);\n  pointer-events: none;\n  color: #a3a3a3;\n  display: block; /* For Firefox */\n}\n\n\n\n.tag span[data-role="remove"] {\n  margin-left: 3px;\n  margin-right: 3px;\n  cursor: pointer;\n}\n\n.tag span[data-role="remove"]:after {\n  content: "x";\n  padding: 0px 2px;\n}\n\n\nselect {\n  margin: 0px;\n  margin-top: 0.5rem;\n  display: block;\n  width: 100%;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  border-radius: 0.25rem;\n  border-width: 1px;\n  border-style: solid;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n  background-clip: padding-box;\n  background-repeat: no-repeat;\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 150ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n\nselect:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(37 99 235 / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\ntable {\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 2.5rem;\n  margin-bottom: 2.5rem;\n  width: 66.666667%;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(229 229 229 / var(--tw-border-opacity));\n  font-family: "Inter";\n}\n\nth {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(255 255 255 / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity));\n  padding: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  text-align: left;\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\ntd {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(229 229 229 / var(--tw-border-opacity));\n  padding: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n/* Position and style the close button (top right corner) */\n.sidenav .closebtn {\n  position: absolute;\n  top: 0;\n  right: 25px;\n  font-size: 28px;\n  margin-left: 50px;\n}\n@media screen and (max-height: 450px) {\n  .sidenav {\n    padding-top: 15px;\n  }\n  .sidenav a {\n    font-size: 18px;\n  }\n}\n.placeholder\\:text-sm::-moz-placeholder {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.placeholder\\:text-sm::placeholder {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.placeholder\\:text-xs::-moz-placeholder {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.placeholder\\:text-xs::placeholder {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.placeholder\\:text-neutral-400::-moz-placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.placeholder\\:text-neutral-400::placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(163 163 163 / var(--tw-text-opacity));\n}\n.placeholder\\:text-neutral-500::-moz-placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(115 115 115 / var(--tw-text-opacity));\n}\n.placeholder\\:text-neutral-500::placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(115 115 115 / var(--tw-text-opacity));\n}\n@media (min-width: 640px) {\n\n  .sm\\:mt-\\[10px\\] {\n    margin-top: 10px;\n  }\n\n  .sm\\:w-3\\/4 {\n    width: 75%;\n  }\n\n  .sm\\:px-2 {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n  }\n\n  .sm\\:py-4 {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n}\n@media (min-width: 768px) {\n\n  .md\\:absolute {\n    position: absolute;\n  }\n\n  .md\\:relative {\n    position: relative;\n  }\n\n  .md\\:left-0 {\n    left: 0px;\n  }\n\n  .md\\:right-0 {\n    right: 0px;\n  }\n\n  .md\\:top-\\[11px\\] {\n    top: 11px;\n  }\n\n  .md\\:m-0 {\n    margin: 0px;\n  }\n\n  .md\\:m-5 {\n    margin: 1.25rem;\n  }\n\n  .md\\:mx-auto {\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  .md\\:mx-5 {\n    margin-left: 1.25rem;\n    margin-right: 1.25rem;\n  }\n\n  .md\\:mx-2 {\n    margin-left: 0.5rem;\n    margin-right: 0.5rem;\n  }\n\n  .md\\:mx-0 {\n    margin-left: 0px;\n    margin-right: 0px;\n  }\n\n  .md\\:mr-0 {\n    margin-right: 0px;\n  }\n\n  .md\\:ml-0 {\n    margin-left: 0px;\n  }\n\n  .md\\:ml-auto {\n    margin-left: auto;\n  }\n\n  .md\\:mr-2 {\n    margin-right: 0.5rem;\n  }\n\n  .md\\:mb-\\[10px\\] {\n    margin-bottom: 10px;\n  }\n\n  .md\\:mt-\\[1px\\] {\n    margin-top: 1px;\n  }\n\n  .md\\:mt-\\[0px\\] {\n    margin-top: 0px;\n  }\n\n  .md\\:mb-3 {\n    margin-bottom: 0.75rem;\n  }\n\n  .md\\:inline-flex {\n    display: inline-flex;\n  }\n\n  .md\\:hidden {\n    display: none;\n  }\n\n  .md\\:h-4 {\n    height: 1rem;\n  }\n\n  .md\\:w-4 {\n    width: 1rem;\n  }\n\n  .md\\:w-96 {\n    width: 24rem;\n  }\n\n  .md\\:w-\\[450px\\] {\n    width: 450px;\n  }\n\n  .md\\:w-\\[100\\%\\] {\n    width: 100%;\n  }\n\n  .md\\:flex-row {\n    flex-direction: row;\n  }\n\n  .md\\:space-y-4 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n  }\n\n  .md\\:rounded-md {\n    border-radius: 0.375rem;\n  }\n\n  .md\\:rounded-xl {\n    border-radius: 0.75rem;\n  }\n\n  .md\\:bg-opacity-0 {\n    --tw-bg-opacity: 0;\n  }\n\n  .md\\:bg-opacity-20 {\n    --tw-bg-opacity: 0.2;\n  }\n\n  .md\\:py-4 {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n\n  .md\\:px-7 {\n    padding-left: 1.75rem;\n    padding-right: 1.75rem;\n  }\n\n  .md\\:px-5 {\n    padding-left: 1.25rem;\n    padding-right: 1.25rem;\n  }\n\n  .md\\:px-2 {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n  }\n\n  .md\\:py-3 {\n    padding-top: 0.75rem;\n    padding-bottom: 0.75rem;\n  }\n\n  .md\\:py-10 {\n    padding-top: 2.5rem;\n    padding-bottom: 2.5rem;\n  }\n\n  .md\\:pr-0 {\n    padding-right: 0px;\n  }\n\n  .md\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .md\\:text-\\[10\\.5px\\] {\n    font-size: 10.5px;\n  }\n\n  .md\\:text-\\[15\\.9px\\] {\n    font-size: 15.9px;\n  }\n\n  .md\\:text-\\[13\\.5px\\] {\n    font-size: 13.5px;\n  }\n\n  .md\\:text-\\[12px\\] {\n    font-size: 12px;\n  }\n\n  .md\\:text-\\[20\\.75px\\] {\n    font-size: 20.75px;\n  }\n\n  .md\\:text-\\[14\\.5px\\] {\n    font-size: 14.5px;\n  }\n\n  .md\\:leading-normal {\n    line-height: 1.5;\n  }\n\n  .md\\:opacity-90 {\n    opacity: 0.9;\n  }\n\n  .placeholder\\:md\\:text-sm::-moz-placeholder {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .placeholder\\:md\\:text-sm::placeholder {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n@media (min-width: 1024px) {\n\n  .lg\\:mx-0 {\n    margin-left: 0px;\n    margin-right: 0px;\n  }\n\n  .lg\\:ml-auto {\n    margin-left: auto;\n  }\n\n  .lg\\:mr-2 {\n    margin-right: 0.5rem;\n  }\n\n  .lg\\:mt-3 {\n    margin-top: 0.75rem;\n  }\n\n  .lg\\:mb-5 {\n    margin-bottom: 1.25rem;\n  }\n\n  .lg\\:mb-\\[10px\\] {\n    margin-bottom: 10px;\n  }\n\n  .lg\\:block {\n    display: block;\n  }\n\n  .lg\\:inline-block {\n    display: inline-block;\n  }\n\n  .lg\\:inline-flex {\n    display: inline-flex;\n  }\n\n  .lg\\:h-4 {\n    height: 1rem;\n  }\n\n  .lg\\:h-\\[203px\\] {\n    height: 203px;\n  }\n\n  .lg\\:w-4 {\n    width: 1rem;\n  }\n\n  .lg\\:max-w-\\[430px\\] {\n    max-width: 430px;\n  }\n\n  .lg\\:rounded-xl {\n    border-radius: 0.75rem;\n  }\n\n  .lg\\:px-6 {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n\n  .lg\\:py-\\[8px\\] {\n    padding-top: 8px;\n    padding-bottom: 8px;\n  }\n\n  .lg\\:py-4 {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n  }\n\n  .lg\\:text-\\[16\\.5px\\] {\n    font-size: 16.5px;\n  }\n\n  .lg\\:text-\\[15px\\] {\n    font-size: 15px;\n  }\n\n  .lg\\:text-\\[20\\.75px\\] {\n    font-size: 20.75px;\n  }\n\n  .lg\\:text-\\[14\\.5px\\] {\n    font-size: 14.5px;\n  }\n\n  .lg\\:leading-relaxed {\n    line-height: 1.625;\n  }\n\n  .lg\\:shadow-lg {\n    --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n    --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  }\n}\n@media (min-width: 1280px) {\n\n  .xl\\:absolute {\n    position: absolute;\n  }\n\n  .xl\\:relative {\n    position: relative;\n  }\n\n  .xl\\:left-10 {\n    left: 2.5rem;\n  }\n\n  .xl\\:top-\\[120px\\] {\n    top: 120px;\n  }\n\n  .xl\\:right-0 {\n    right: 0px;\n  }\n\n  .xl\\:top-\\[20px\\] {\n    top: 20px;\n  }\n\n  .xl\\:left-\\[125px\\] {\n    left: 125px;\n  }\n\n  .xl\\:right-\\[90px\\] {\n    right: 90px;\n  }\n\n  .xl\\:top-\\[25px\\] {\n    top: 25px;\n  }\n\n  .xl\\:mx-0 {\n    margin-left: 0px;\n    margin-right: 0px;\n  }\n\n  .xl\\:my-0 {\n    margin-top: 0px;\n    margin-bottom: 0px;\n  }\n\n  .xl\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  .xl\\:mt-\\[0px\\] {\n    margin-top: 0px;\n  }\n\n  .xl\\:block {\n    display: block;\n  }\n\n  .xl\\:h-\\[100px\\] {\n    height: 100px;\n  }\n\n  .xl\\:w-\\[100px\\] {\n    width: 100px;\n  }\n\n  .xl\\:w-full {\n    width: 100%;\n  }\n\n  .xl\\:rounded-md {\n    border-radius: 0.375rem;\n  }\n\n  .xl\\:px-0 {\n    padding-left: 0px;\n    padding-right: 0px;\n  }\n\n  .xl\\:text-left {\n    text-align: left;\n  }\n\n  .xl\\:text-lg {\n    font-size: 1.125rem;\n    line-height: 1.75rem;\n  }\n\n  .xl\\:text-\\[12\\.5px\\] {\n    font-size: 12.5px;\n  }\n\n  .xl\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n';
const Root = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles, "s_WZUT0oi3I0A"));
  return /* @__PURE__ */ jsx(QwikCity, {
    children: [
      /* @__PURE__ */ jsx(Head, {}),
      /* @__PURE__ */ jsx("body", {
        lang: "en",
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
export {
  entry_ssr as default
};
