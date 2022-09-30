import { componentQrl, inlinedQrl, useContext, jsx as jsx$1, SkipRender, useEnvData, useStore, useContextProvider, useWatchQrl, useLexicalScope, noSerialize, Slot, createContext, mutable, useStylesQrl } from "@builder.io/qwik";
import { jsx, jsxs, Fragment } from "@builder.io/qwik/jsx-runtime";
import { renderToStream } from "@builder.io/qwik/server";
const Header = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "w-screen"
  });
}, "s_gm3f0H6v3fA"));
const isServer = true;
const isBrowser = false;
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
      cmp = jsx$1(contents[i].default, {
        children: cmp
      });
    return cmp;
  }
  return SkipRender;
}, "RouterOutlet_component_nd8yk3KO22c"));
const MODULE_CACHE$1 = /* @__PURE__ */ new WeakMap();
const loadRoute$1 = async (routes2, menus2, cacheModules2, pathname) => {
  if (Array.isArray(routes2))
    for (const route of routes2) {
      const match = route[0].exec(pathname);
      if (match) {
        const loaders = route[1];
        const params = getRouteParams$1(route[2], match);
        const routeBundleNames = route[4];
        const mods = new Array(loaders.length);
        const pendingLoads = [];
        const menuLoader = getMenuLoader$1(menus2, pathname);
        let menu = void 0;
        loaders.forEach((moduleLoader, i) => {
          loadModule$1(moduleLoader, pendingLoads, (routeModule) => mods[i] = routeModule, cacheModules2);
        });
        loadModule$1(menuLoader, pendingLoads, (menuModule) => menu = menuModule == null ? void 0 : menuModule.default, cacheModules2);
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
const loadModule$1 = (moduleLoader, pendingLoads, moduleSetter, cacheModules2) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE$1.get(moduleLoader);
    if (loadedModule)
      moduleSetter(loadedModule);
    else {
      const l = moduleLoader();
      if (typeof l.then === "function")
        pendingLoads.push(l.then((loadedModule2) => {
          if (cacheModules2 !== false)
            MODULE_CACHE$1.set(moduleLoader, loadedModule2);
          moduleSetter(loadedModule2);
        }));
      else if (l)
        moduleSetter(l);
    }
  }
};
const getMenuLoader$1 = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find((m) => m[0] === pathname || pathname.startsWith(m[0] + (pathname.endsWith("/") ? "" : "/")));
    if (menu)
      return menu[1];
  }
  return void 0;
};
const getRouteParams$1 = (paramNames, match) => {
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
    const loadRoutePromise = loadRoute$1(routes2, menus2, cacheModules2, pathname);
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
const Menu = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const loc = useLocation();
  return /* @__PURE__ */ jsx("div", {
    class: "menucont",
    children: /* @__PURE__ */ jsxs("div", {
      class: "menumain",
      children: [
        /* @__PURE__ */ jsxs(Link, {
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
        /* @__PURE__ */ jsxs(Link, {
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
        /* @__PURE__ */ jsxs(Link, {
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
        /* @__PURE__ */ jsxs(Link, {
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
  return /* @__PURE__ */ jsxs("div", {
    class: "sidebarwrapper",
    children: [
      /* @__PURE__ */ jsx("div", {
        class: " sidebarprofile",
        children: /* @__PURE__ */ jsxs("div", {
          class: "py-[10px] pt-0 flex flex-col items-center content-center ",
          children: [
            /* @__PURE__ */ jsxs("div", {
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
            /* @__PURE__ */ jsxs("div", {
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
      /* @__PURE__ */ jsxs("div", {
        class: "sidebardivs",
        children: [
          /* @__PURE__ */ jsx("span", {
            class: "quicktext",
            children: "Quick Actions"
          }),
          /* @__PURE__ */ jsx("div", {
            class: "quickcont",
            children: /* @__PURE__ */ jsxs("div", {
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
      /* @__PURE__ */ jsxs("div", {
        class: "sidebarmessage",
        children: [
          /* @__PURE__ */ jsxs("div", {
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
          /* @__PURE__ */ jsxs("div", {
            class: "flex flex-col my-1 py-1 space-y-[22px] px-1",
            children: [
              /* @__PURE__ */ jsxs("div", {
                class: "flex flex-row space-x-[10px]",
                children: [
                  /* @__PURE__ */ jsx("img", {
                    class: "w-10 border border-[rgba(0,0,0,0)] flex-shrink-0 h-10 mx-2 mr-1 rounded-md",
                    src: "https://picsum.photos/100/100"
                  }),
                  /* @__PURE__ */ jsxs("div", {
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
              /* @__PURE__ */ jsxs("div", {
                class: "flex flex-row space-x-[10px]",
                children: [
                  /* @__PURE__ */ jsx("img", {
                    class: "w-10 border border-[rgba(0,0,0,0)] flex-shrink-0 h-10 mx-2 mr-1 rounded-md",
                    src: "https://picsum.photos/100/300"
                  }),
                  /* @__PURE__ */ jsxs("div", {
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
              /* @__PURE__ */ jsxs("div", {
                class: "flex flex-row space-x-[10px]",
                children: [
                  /* @__PURE__ */ jsx("img", {
                    class: "w-10 flex-shrink-0 border border-[rgba(0,0,0,0)] h-10 mx-2 mr-1 rounded-md",
                    src: "https://picsum.photos/100/200"
                  }),
                  /* @__PURE__ */ jsxs("div", {
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
  return /* @__PURE__ */ jsxs("div", {
    class: "bgcol",
    children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", {
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
  return /* @__PURE__ */ jsxs("div", {
    class: "bgcol",
    children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", {
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
    children: /* @__PURE__ */ jsxs("div", {
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
        /* @__PURE__ */ jsxs("div", {
          class: "xl:absolute w-full xl:left-10 xl:top-[120px] xl:right-0 mx-auto mt-7 xl:mt-0 flex flex-col",
          children: [
            /* @__PURE__ */ jsx("img", {
              class: "xl:w-[100px] xl:h-[100px] shadow-xl border border-neutral-800 w-20 mx-auto xl:mx-0 h-20 rounded-full"
            }),
            /* @__PURE__ */ jsxs("div", {
              class: "flex-grow flex flex-col xl:block",
              children: [
                /* @__PURE__ */ jsx("div", {
                  class: "flex flex-row xl:top-[20px] xl:left-[125px] mx-auto xl:mx-0 xl:absolute none mt-3 xl:mt-0",
                  children: /* @__PURE__ */ jsxs("div", {
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
    children: /* @__PURE__ */ jsxs("div", {
      class: "flex flex-row border-b border-b-[#121212] ",
      children: [
        /* @__PURE__ */ jsx("img", {
          class: `hidden w-full lg:max-w-[430px] max-h-auto max-w-[350px] absolute  h-full`,
          src: props.image
        }),
        /* @__PURE__ */ jsxs("div", {
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
        /* @__PURE__ */ jsxs("div", {
          class: "flex flex-col px-4 py-4",
          children: [
            /* @__PURE__ */ jsxs("div", {
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
            /* @__PURE__ */ jsxs("div", {
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
                /* @__PURE__ */ jsxs("div", {
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
    children: /* @__PURE__ */ jsxs("div", {
      class: "flex flex-col flex-grow md:relative ",
      children: [
        /* @__PURE__ */ jsxs("button", {
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
          children: /* @__PURE__ */ jsxs("div", {
            id: "popup",
            class: "z-1000 bg-[#0d0d0d] rounded-lg mx-auto",
            children: [
              /* @__PURE__ */ jsxs("div", {
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
              /* @__PURE__ */ jsxs("div", {
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
        /* @__PURE__ */ jsxs("div", {
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
  return /* @__PURE__ */ jsxs("div", {
    id: "midcont",
    class: "h-screen flex flex-col flex-grow md:py-10 p-6 px-8",
    children: [
      /* @__PURE__ */ jsxs("div", {
        class: "flex flex-row items-center content-center ",
        children: [
          /* @__PURE__ */ jsxs("div", {
            class: "flex flex-row items-center content-center space-x-[12px] mr-auto",
            children: [
              /* @__PURE__ */ jsx("img", {
                class: "w-5 h-5 rounded-full",
                src: "https://picsum.photos/500/600",
                children: " "
              }),
              /* @__PURE__ */ jsxs("h1", {
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
      /* @__PURE__ */ jsxs("div", {
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
var HEADERS = Symbol("headers");
var _a;
var HeadersPolyfill = class {
  constructor() {
    this[_a] = {};
  }
  [(_a = HEADERS, Symbol.iterator)]() {
    return this.entries();
  }
  *keys() {
    for (const name of Object.keys(this[HEADERS])) {
      yield name;
    }
  }
  *values() {
    for (const value of Object.values(this[HEADERS])) {
      yield value;
    }
  }
  *entries() {
    for (const name of Object.keys(this[HEADERS])) {
      yield [name, this.get(name)];
    }
  }
  get(name) {
    return this[HEADERS][normalizeHeaderName(name)] || null;
  }
  set(name, value) {
    const normalizedName = normalizeHeaderName(name);
    this[HEADERS][normalizedName] = typeof value !== "string" ? String(value) : value;
  }
  append(name, value) {
    const normalizedName = normalizeHeaderName(name);
    const resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${value}` : value;
    this.set(name, resolvedValue);
  }
  delete(name) {
    if (!this.has(name)) {
      return;
    }
    const normalizedName = normalizeHeaderName(name);
    delete this[HEADERS][normalizedName];
  }
  all() {
    return this[HEADERS];
  }
  has(name) {
    return this[HEADERS].hasOwnProperty(normalizeHeaderName(name));
  }
  forEach(callback, thisArg) {
    for (const name in this[HEADERS]) {
      if (this[HEADERS].hasOwnProperty(name)) {
        callback.call(thisArg, this[HEADERS][name], name, this);
      }
    }
  }
};
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
  if (typeof name !== "string") {
    name = String(name);
  }
  if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") {
    throw new TypeError("Invalid character in header field name");
  }
  return name.toLowerCase();
}
function createHeaders() {
  return new (typeof Headers === "function" ? Headers : HeadersPolyfill)();
}
var ErrorResponse = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
function notFoundHandler(requestCtx) {
  return errorResponse(requestCtx, new ErrorResponse(404, "Not Found"));
}
function errorHandler(requestCtx, e) {
  const status = 500;
  let message = "Server Error";
  let stack = void 0;
  if (e != null) {
    if (typeof e === "object") {
      if (typeof e.message === "string") {
        message = e.message;
      }
      if (e.stack != null) {
        stack = String(e.stack);
      }
    } else {
      message = String(e);
    }
  }
  const html = minimalHtmlResponse(status, message, stack);
  const headers = createHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  return requestCtx.response(
    status,
    headers,
    async (stream) => {
      stream.write(html);
    },
    e
  );
}
function errorResponse(requestCtx, errorResponse2) {
  const html = minimalHtmlResponse(
    errorResponse2.status,
    errorResponse2.message,
    errorResponse2.stack
  );
  const headers = createHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  return requestCtx.response(
    errorResponse2.status,
    headers,
    async (stream) => {
      stream.write(html);
    },
    errorResponse2
  );
}
function minimalHtmlResponse(status, message, stack) {
  const width = typeof message === "string" ? "600px" : "300px";
  const color = status >= 500 ? COLOR_500 : COLOR_400;
  if (status < 500) {
    stack = "";
  }
  return `<!DOCTYPE html>
<html data-qwik-city-status="${status}">
<head>
  <meta charset="utf-8">
  <title>${status} ${message}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { color: ${color}; background-color: #fafafa; padding: 30px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
    p { max-width: ${width}; margin: 60px auto 30px auto; background: white; border-radius: 5px; box-shadow: 0px 0px 50px -20px ${color}; overflow: hidden; }
    strong { display: inline-block; padding: 15px; background: ${color}; color: white; }
    span { display: inline-block; padding: 15px; }
    pre { max-width: 580px; margin: 0 auto; }
  </style>
</head>
<body>
  <p>
    <strong>${status}</strong>
    <span>${message}</span>
  </p>
  ${stack ? `<pre><code>${stack}</code></pre>` : ``}
</body>
</html>
`;
}
var COLOR_400 = "#5249d9";
var COLOR_500 = "#bd16bd";
var MODULE_CACHE = /* @__PURE__ */ new WeakMap();
var loadRoute = async (routes2, menus2, cacheModules2, pathname) => {
  if (Array.isArray(routes2)) {
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
          loadModule(
            moduleLoader,
            pendingLoads,
            (routeModule) => mods[i] = routeModule,
            cacheModules2
          );
        });
        loadModule(
          menuLoader,
          pendingLoads,
          (menuModule) => menu = menuModule == null ? void 0 : menuModule.default,
          cacheModules2
        );
        if (pendingLoads.length > 0) {
          await Promise.all(pendingLoads);
        }
        return [params, mods, menu, routeBundleNames];
      }
    }
  }
  return null;
};
var loadModule = (moduleLoader, pendingLoads, moduleSetter, cacheModules2) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE.get(moduleLoader);
    if (loadedModule) {
      moduleSetter(loadedModule);
    } else {
      const l = moduleLoader();
      if (typeof l.then === "function") {
        pendingLoads.push(
          l.then((loadedModule2) => {
            if (cacheModules2 !== false) {
              MODULE_CACHE.set(moduleLoader, loadedModule2);
            }
            moduleSetter(loadedModule2);
          })
        );
      } else if (l) {
        moduleSetter(l);
      }
    }
  }
};
var getMenuLoader = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find(
      (m) => m[0] === pathname || pathname.startsWith(m[0] + (pathname.endsWith("/") ? "" : "/"))
    );
    if (menu) {
      return menu[1];
    }
  }
  return void 0;
};
var getRouteParams = (paramNames, match) => {
  const params = {};
  if (paramNames) {
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = match ? match[i + 1] : "";
    }
  }
  return params;
};
var RedirectResponse = class {
  constructor(url, status, headers) {
    this.url = url;
    this.location = url;
    this.status = isRedirectStatus(status) ? status : 307;
    this.headers = headers || createHeaders();
    this.headers.set("Location", this.location);
    this.headers.delete("Cache-Control");
  }
};
function redirectResponse(requestCtx, responseRedirect) {
  return requestCtx.response(responseRedirect.status, responseRedirect.headers, async () => {
  });
}
function isRedirectStatus(status) {
  return typeof status === "number" && status >= 301 && status <= 308;
}
async function loadUserResponse(requestCtx, params, routeModules, platform, trailingSlash2, basePathname2 = "/") {
  if (routeModules.length === 0) {
    throw new ErrorResponse(404, `Not Found`);
  }
  const { request, url } = requestCtx;
  const { pathname } = url;
  const isPageModule = isLastModulePageRoute(routeModules);
  const isPageDataRequest = isPageModule && request.headers.get("Accept") === "application/json";
  const type = isPageDataRequest ? "pagedata" : isPageModule ? "pagehtml" : "endpoint";
  const userResponse = {
    type,
    url,
    params,
    status: 200,
    headers: createHeaders(),
    resolvedBody: void 0,
    pendingBody: void 0
  };
  let hasRequestMethodHandler = false;
  if (isPageModule && pathname !== basePathname2) {
    if (trailingSlash2) {
      if (!pathname.endsWith("/")) {
        throw new RedirectResponse(pathname + "/" + url.search, 307);
      }
    } else {
      if (pathname.endsWith("/")) {
        throw new RedirectResponse(
          pathname.slice(0, pathname.length - 1) + url.search,
          307
        );
      }
    }
  }
  let routeModuleIndex = -1;
  const abort = () => {
    routeModuleIndex = ABORT_INDEX;
  };
  const redirect = (url2, status) => {
    return new RedirectResponse(url2, status, userResponse.headers);
  };
  const error = (status, message) => {
    return new ErrorResponse(status, message);
  };
  const next = async () => {
    routeModuleIndex++;
    while (routeModuleIndex < routeModules.length) {
      const endpointModule = routeModules[routeModuleIndex];
      let reqHandler = void 0;
      switch (request.method) {
        case "GET": {
          reqHandler = endpointModule.onGet;
          break;
        }
        case "POST": {
          reqHandler = endpointModule.onPost;
          break;
        }
        case "PUT": {
          reqHandler = endpointModule.onPut;
          break;
        }
        case "PATCH": {
          reqHandler = endpointModule.onPatch;
          break;
        }
        case "OPTIONS": {
          reqHandler = endpointModule.onOptions;
          break;
        }
        case "HEAD": {
          reqHandler = endpointModule.onHead;
          break;
        }
        case "DELETE": {
          reqHandler = endpointModule.onDelete;
          break;
        }
      }
      reqHandler = reqHandler || endpointModule.onRequest;
      if (typeof reqHandler === "function") {
        hasRequestMethodHandler = true;
        const response = {
          get status() {
            return userResponse.status;
          },
          set status(code) {
            userResponse.status = code;
          },
          get headers() {
            return userResponse.headers;
          },
          redirect,
          error
        };
        const requestEv = {
          request,
          url: new URL(url),
          params: { ...params },
          response,
          platform,
          next,
          abort
        };
        const syncData = reqHandler(requestEv);
        if (typeof syncData === "function") {
          userResponse.pendingBody = createPendingBody(syncData);
        } else if (syncData !== null && typeof syncData === "object" && typeof syncData.then === "function") {
          const asyncResolved = await syncData;
          if (typeof asyncResolved === "function") {
            userResponse.pendingBody = createPendingBody(asyncResolved);
          } else {
            userResponse.resolvedBody = asyncResolved;
          }
        } else {
          userResponse.resolvedBody = syncData;
        }
      }
      routeModuleIndex++;
    }
  };
  await next();
  if (!isPageDataRequest && isRedirectStatus(userResponse.status) && userResponse.headers.has("Location")) {
    throw new RedirectResponse(
      userResponse.headers.get("Location"),
      userResponse.status,
      userResponse.headers
    );
  }
  if (type === "endpoint" && !hasRequestMethodHandler) {
    throw new ErrorResponse(405, `Method Not Allowed`);
  }
  return userResponse;
}
function createPendingBody(cb) {
  return new Promise((resolve, reject) => {
    try {
      const rtn = cb();
      if (rtn !== null && typeof rtn === "object" && typeof rtn.then === "function") {
        rtn.then(resolve, reject);
      } else {
        resolve(rtn);
      }
    } catch (e) {
      reject(e);
    }
  });
}
function isLastModulePageRoute(routeModules) {
  const lastRouteModule = routeModules[routeModules.length - 1];
  return lastRouteModule && typeof lastRouteModule.default === "function";
}
function updateRequestCtx(requestCtx, trailingSlash2) {
  let pathname = requestCtx.url.pathname;
  if (pathname.endsWith(QDATA_JSON)) {
    requestCtx.request.headers.set("Accept", "application/json");
    const trimEnd = pathname.length - QDATA_JSON_LEN + (trailingSlash2 ? 1 : 0);
    pathname = pathname.slice(0, trimEnd);
    if (pathname === "") {
      pathname = "/";
    }
    requestCtx.url.pathname = pathname;
  }
}
var QDATA_JSON = "/q-data.json";
var QDATA_JSON_LEN = QDATA_JSON.length;
var ABORT_INDEX = 999999999;
function endpointHandler(requestCtx, userResponse) {
  const { pendingBody, resolvedBody, status, headers } = userResponse;
  const { response } = requestCtx;
  if (pendingBody === void 0 && resolvedBody === void 0) {
    return response(status, headers, asyncNoop);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  const isJson = headers.get("Content-Type").includes("json");
  return response(status, headers, async ({ write }) => {
    const body = pendingBody !== void 0 ? await pendingBody : resolvedBody;
    if (body !== void 0) {
      if (isJson) {
        write(JSON.stringify(body));
      } else {
        const type = typeof body;
        if (type === "string") {
          write(body);
        } else if (type === "number" || type === "boolean") {
          write(String(body));
        } else {
          write(body);
        }
      }
    }
  });
}
var asyncNoop = async () => {
};
function pageHandler(requestCtx, userResponse, render2, opts, routeBundleNames) {
  const { status, headers } = userResponse;
  const { response } = requestCtx;
  const isPageData = userResponse.type === "pagedata";
  if (isPageData) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "text/html; charset=utf-8");
  }
  return response(isPageData ? 200 : status, headers, async (stream) => {
    const result = await render2({
      stream: isPageData ? noopStream : stream,
      envData: getQwikCityEnvData(userResponse),
      ...opts
    });
    if (isPageData) {
      stream.write(JSON.stringify(await getClientPageData(userResponse, result, routeBundleNames)));
    } else {
      if ((typeof result).html === "string") {
        stream.write(result.html);
      }
    }
    if (typeof stream.clientData === "function") {
      stream.clientData(await getClientPageData(userResponse, result, routeBundleNames));
    }
  });
}
async function getClientPageData(userResponse, result, routeBundleNames) {
  const prefetchBundleNames = getPrefetchBundleNames(result, routeBundleNames);
  const clientPage = {
    body: userResponse.pendingBody ? await userResponse.pendingBody : userResponse.resolvedBody,
    status: userResponse.status !== 200 ? userResponse.status : void 0,
    redirect: userResponse.status >= 301 && userResponse.status <= 308 && userResponse.headers.get("location") || void 0,
    prefetch: prefetchBundleNames.length > 0 ? prefetchBundleNames : void 0
  };
  return clientPage;
}
function getPrefetchBundleNames(result, routeBundleNames) {
  const bundleNames = [];
  const addBundle = (bundleName) => {
    if (bundleName && !bundleNames.includes(bundleName)) {
      bundleNames.push(bundleName);
    }
  };
  const addPrefetchResource = (prefetchResources) => {
    if (Array.isArray(prefetchResources)) {
      for (const prefetchResource of prefetchResources) {
        const bundleName = prefetchResource.url.split("/").pop();
        if (bundleName && !bundleNames.includes(bundleName)) {
          addBundle(bundleName);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(result.prefetchResources);
  const manifest2 = result.manifest || result._manifest;
  const renderedSymbols = result._symbols;
  if (manifest2 && renderedSymbols) {
    for (const renderedSymbolName of renderedSymbols) {
      const symbol = manifest2.symbols[renderedSymbolName];
      if (symbol && symbol.ctxName === "component$") {
        addBundle(manifest2.mapping[renderedSymbolName]);
      }
    }
  }
  if (routeBundleNames) {
    for (const routeBundleName of routeBundleNames) {
      addBundle(routeBundleName);
    }
  }
  return bundleNames;
}
function getQwikCityEnvData(userResponse) {
  const { url, params, pendingBody, resolvedBody, status } = userResponse;
  return {
    url: url.href,
    qwikcity: {
      params: { ...params },
      response: {
        body: pendingBody || resolvedBody,
        status
      }
    }
  };
}
var noopStream = { write: () => {
} };
async function requestHandler(requestCtx, render2, platform, opts) {
  try {
    updateRequestCtx(requestCtx, trailingSlash);
    const loadedRoute = await loadRoute(routes, menus, cacheModules, requestCtx.url.pathname);
    if (loadedRoute) {
      const [params, mods, _, routeBundleNames] = loadedRoute;
      const userResponse = await loadUserResponse(
        requestCtx,
        params,
        mods,
        platform,
        trailingSlash,
        basePathname
      );
      if (userResponse.type === "endpoint") {
        return endpointHandler(requestCtx, userResponse);
      }
      return pageHandler(requestCtx, userResponse, render2, opts, routeBundleNames);
    }
  } catch (e) {
    if (e instanceof RedirectResponse) {
      return redirectResponse(requestCtx, e);
    }
    if (e instanceof ErrorResponse) {
      return errorResponse(requestCtx, e);
    }
    return errorHandler(requestCtx, e);
  }
  return null;
}
function qwikCity(render2, opts) {
  async function onRequest(request, { next }) {
    try {
      const requestCtx = {
        url: new URL(request.url),
        request,
        response: (status, headers, body) => {
          return new Promise((resolve) => {
            let flushedHeaders = false;
            const { readable, writable } = new TransformStream();
            const writer = writable.getWriter();
            const response = new Response(readable, { status, headers });
            body({
              write: (chunk) => {
                if (!flushedHeaders) {
                  flushedHeaders = true;
                  resolve(response);
                }
                if (typeof chunk === "string") {
                  const encoder = new TextEncoder();
                  writer.write(encoder.encode(chunk));
                } else {
                  writer.write(chunk);
                }
              }
            }).finally(() => {
              if (!flushedHeaders) {
                flushedHeaders = true;
                resolve(response);
              }
              writer.close();
            });
          });
        }
      };
      const handledResponse = await requestHandler(requestCtx, render2, {}, opts);
      if (handledResponse) {
        return handledResponse;
      }
      const nextResponse = await next();
      if (nextResponse.status === 404) {
        const handledResponse2 = await requestHandler(requestCtx, render2, {}, opts);
        if (handledResponse2) {
          return handledResponse2;
        }
        const notFoundResponse = await notFoundHandler(requestCtx);
        return notFoundResponse;
      }
      return nextResponse;
    } catch (e) {
      return new Response(String(e || "Error"), {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
  return onRequest;
}
const manifest = { "symbols": { "s_PeDTn2z80A4": { "origin": "components/post/post.tsx", "displayName": "Post_component__Fragment_div_div_div_h1_onClick", "canonicalFilename": "s_pedtn2z80a4", "hash": "PeDTn2z80A4", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_bSNo02BOSeo" }, "s_TlrTEIpSGyw": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_div_onClick", "canonicalFilename": "s_tlrteipsgyw", "hash": "TlrTEIpSGyw", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_hA9UPaY8sNQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onClick", "canonicalFilename": "s_ha9upay8snq", "hash": "hA9UPaY8sNQ", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_p8802htc8lU": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_div_div_div_button_onClick", "canonicalFilename": "s_p8802htc8lu", "hash": "p8802htc8lU", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_t8Q6Qpbu0pE": { "origin": "routes/index@index.tsx", "displayName": "index_index_component__Fragment_div_button_onClick", "canonicalFilename": "s_t8q6qpbu0pe", "hash": "t8Q6Qpbu0pE", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_0e3es3vnWuk" }, "s_skxgNVWVOT8": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onMouseOver", "canonicalFilename": "s_skxgnvwvot8", "hash": "skxgNVWVOT8", "ctxKind": "event", "ctxName": "onMouseOver$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_uVE5iM9H73c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onQVisible", "canonicalFilename": "s_uve5im9h73c", "hash": "uVE5iM9H73c", "ctxKind": "event", "ctxName": "onQVisible$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_AaAlzKH0KlQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component_useWatch", "canonicalFilename": "s_aaalzkh0klq", "hash": "AaAlzKH0KlQ", "ctxKind": "function", "ctxName": "useWatch$", "captures": true, "parent": "s_z1nvHyEppoI" }, "s_06hTRPZlBNE": { "origin": "root.tsx", "displayName": "root_component", "canonicalFilename": "s_06htrpzlbne", "hash": "06hTRPZlBNE", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_0e3es3vnWuk": { "origin": "routes/index@index.tsx", "displayName": "index_index_component", "canonicalFilename": "s_0e3es3vnwuk", "hash": "0e3es3vnWuk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_26hfKJ9I4hk": { "origin": "routes/profile/[proid]/index@profile.tsx", "displayName": "index_profile_component", "canonicalFilename": "s_26hfkj9i4hk", "hash": "26hfKJ9I4hk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_BtnGjf3PdHw": { "origin": "components/sidebar/sidebar.tsx", "displayName": "Sidebar_component", "canonicalFilename": "s_btngjf3pdhw", "hash": "BtnGjf3PdHw", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_NcbFhH0Rq0M": { "origin": "routes/layout-index.tsx", "displayName": "layout_index_component", "canonicalFilename": "s_ncbfhh0rq0m", "hash": "NcbFhH0Rq0M", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_Xo5tmaGPZOs": { "origin": "routes/posts/[postid]/index.tsx", "displayName": "_postid__component", "canonicalFilename": "s_xo5tmagpzos", "hash": "Xo5tmaGPZOs", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_aeoMBoP047Y": { "origin": "routes/profile/[proid]/layout-profile.tsx", "displayName": "layout_profile_component", "canonicalFilename": "s_aeombop047y", "hash": "aeoMBoP047Y", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_bSNo02BOSeo": { "origin": "components/post/post.tsx", "displayName": "Post_component", "canonicalFilename": "s_bsno02boseo", "hash": "bSNo02BOSeo", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_gm3f0H6v3fA": { "origin": "components/header/header.tsx", "displayName": "Header_component", "canonicalFilename": "s_gm3f0h6v3fa", "hash": "gm3f0H6v3fA", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_j5h3enAr0HE": { "origin": "routes/clips/index.tsx", "displayName": "clips_component", "canonicalFilename": "s_j5h3enar0he", "hash": "j5h3enAr0HE", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_mYsiJcA4IBc": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component", "canonicalFilename": "s_mysijca4ibc", "hash": "mYsiJcA4IBc", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_n0b0sGHmkUY": { "origin": "routes/favs/index.tsx", "displayName": "favs_component", "canonicalFilename": "s_n0b0sghmkuy", "hash": "n0b0sGHmkUY", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_nd8yk3KO22c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "RouterOutlet_component", "canonicalFilename": "s_nd8yk3ko22c", "hash": "nd8yk3KO22c", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_tD1BXnbDybA": { "origin": "routes/settings/index.tsx", "displayName": "settings_component", "canonicalFilename": "s_td1bxnbdyba", "hash": "tD1BXnbDybA", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_uaqIf5ac0DY": { "origin": "routes/vids/index.tsx", "displayName": "vids_component", "canonicalFilename": "s_uaqif5ac0dy", "hash": "uaqIf5ac0DY", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_uwWhp2E5O4I": { "origin": "components/menu/menu.tsx", "displayName": "Menu_component", "canonicalFilename": "s_uwwhp2e5o4i", "hash": "uwWhp2E5O4I", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_yM0L9NCDGUk": { "origin": "routes/layout.tsx", "displayName": "layout_component", "canonicalFilename": "s_ym0l9ncdguk", "hash": "yM0L9NCDGUk", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_z1nvHyEppoI": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component", "canonicalFilename": "s_z1nvhyeppoi", "hash": "z1nvHyEppoI", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_zgN7XgNXC7Q": { "origin": "components/head/head.tsx", "displayName": "Head_component", "canonicalFilename": "s_zgn7xgnxc7q", "hash": "zgN7XgNXC7Q", "ctxKind": "function", "ctxName": "component$", "captures": false }, "s_WZUT0oi3I0A": { "origin": "root.tsx", "displayName": "root_component_useStyles", "canonicalFilename": "s_wzut0oi3i0a", "hash": "WZUT0oi3I0A", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_06hTRPZlBNE" } }, "mapping": { "s_PeDTn2z80A4": "q-b4c7c099.js", "s_TlrTEIpSGyw": "q-687fbe22.js", "s_hA9UPaY8sNQ": "q-4a5fa1e1.js", "s_p8802htc8lU": "q-687fbe22.js", "s_t8Q6Qpbu0pE": "q-687fbe22.js", "s_skxgNVWVOT8": "q-4a5fa1e1.js", "s_uVE5iM9H73c": "q-4a5fa1e1.js", "s_AaAlzKH0KlQ": "q-b4621644.js", "s_06hTRPZlBNE": "q-2b6484ca.js", "s_0e3es3vnWuk": "q-687fbe22.js", "s_26hfKJ9I4hk": "q-03e9941d.js", "s_BtnGjf3PdHw": "q-6232aac8.js", "s_NcbFhH0Rq0M": "q-9e917870.js", "s_Xo5tmaGPZOs": "q-8735d118.js", "s_aeoMBoP047Y": "q-c5f2b5d0.js", "s_bSNo02BOSeo": "q-b4c7c099.js", "s_gm3f0H6v3fA": "q-80fbf83e.js", "s_j5h3enAr0HE": "q-860f6b19.js", "s_mYsiJcA4IBc": "q-4a5fa1e1.js", "s_n0b0sGHmkUY": "q-47cb966c.js", "s_nd8yk3KO22c": "q-0176c64b.js", "s_tD1BXnbDybA": "q-f0ab9a98.js", "s_uaqIf5ac0DY": "q-55884fb1.js", "s_uwWhp2E5O4I": "q-07309be4.js", "s_yM0L9NCDGUk": "q-1f04af5a.js", "s_z1nvHyEppoI": "q-b4621644.js", "s_zgN7XgNXC7Q": "q-bb1f9e8a.js", "s_WZUT0oi3I0A": "q-2b6484ca.js" }, "bundles": { "q-0176c64b.js": { "size": 269, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_RouterOutlet.js", "src/s_nd8yk3ko22c.js"], "symbols": ["s_nd8yk3KO22c"] }, "q-03e9941d.js": { "size": 178, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_index_profile.js", "src/s_26hfkj9i4hk.js"], "symbols": ["s_26hfKJ9I4hk"] }, "q-07309be4.js": { "size": 2286, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_Menu.js", "src/s_uwwhp2e5o4i.js"], "symbols": ["s_uwWhp2E5O4I"] }, "q-1288b5e3.js": { "size": 180, "imports": ["q-65badc42.js"], "dynamicImports": ["q-55884fb1.js"], "origins": ["src/routes/vids/index.js"] }, "q-1439a3ac.js": { "size": 712, "imports": ["q-65badc42.js"], "dynamicImports": ["q-03e9941d.js"], "origins": ["src/routes/profile/[proid]/index@profile.js"] }, "q-15642003.js": { "size": 714, "imports": ["q-65badc42.js"], "dynamicImports": ["q-c5f2b5d0.js"], "origins": ["src/routes/profile/[proid]/layout-profile.js"] }, "q-1a063a29.js": { "size": 158, "imports": ["q-65badc42.js"], "dynamicImports": ["q-9e917870.js"], "origins": ["src/routes/layout-index.js"] }, "q-1f04af5a.js": { "size": 292, "imports": ["q-65badc42.js", "q-d0d0dbfd.js"], "origins": ["src/entry_layout.js", "src/s_ym0l9ncdguk.js"], "symbols": ["s_yM0L9NCDGUk"] }, "q-237c0038.js": { "size": 158, "imports": ["q-65badc42.js"], "dynamicImports": ["q-1f04af5a.js"], "origins": ["src/routes/layout.js"] }, "q-25e8cbed.js": { "size": 180, "imports": ["q-65badc42.js"], "dynamicImports": ["q-687fbe22.js"], "origins": ["src/routes/index@index.js"] }, "q-2b6484ca.js": { "size": 30511, "imports": ["q-65badc42.js"], "dynamicImports": ["q-0176c64b.js", "q-4a5fa1e1.js", "q-b4621644.js", "q-bb1f9e8a.js"], "origins": ["node_modules/@builder.io/qwik-city/index.qwik.mjs", "src/components/head/head.js", "src/entry_root.js", "src/modern.css?used", "src/s_06htrpzlbne.js", "src/s_wzut0oi3i0a.js"], "symbols": ["s_06hTRPZlBNE", "s_WZUT0oi3I0A"] }, "q-47cb966c.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_favs.js", "src/s_n0b0sghmkuy.js"], "symbols": ["s_n0b0sGHmkUY"] }, "q-4a5fa1e1.js": { "size": 922, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_Link.js", "src/s_ha9upay8snq.js", "src/s_mysijca4ibc.js", "src/s_skxgnvwvot8.js", "src/s_uve5im9h73c.js"], "symbols": ["s_hA9UPaY8sNQ", "s_mYsiJcA4IBc", "s_skxgNVWVOT8", "s_uVE5iM9H73c"] }, "q-55884fb1.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_vids.js", "src/s_uaqif5ac0dy.js"], "symbols": ["s_uaqIf5ac0DY"] }, "q-5dd1a945.js": { "size": 180, "imports": ["q-65badc42.js"], "dynamicImports": ["q-47cb966c.js"], "origins": ["src/routes/favs/index.js"] }, "q-6232aac8.js": { "size": 3494, "imports": ["q-65badc42.js"], "origins": ["src/entry_Sidebar.js", "src/s_btngjf3pdhw.js"], "symbols": ["s_BtnGjf3PdHw"] }, "q-65badc42.js": { "size": 33254, "dynamicImports": ["q-2b6484ca.js"], "origins": ["\0vite/preload-helper", "node_modules/@builder.io/qwik/core.min.mjs", "src/root.js"] }, "q-687fbe22.js": { "size": 8194, "imports": ["q-65badc42.js"], "dynamicImports": ["q-b4c7c099.js"], "origins": ["src/components/post/post.js", "src/entry_index_index.js", "src/s_0e3es3vnwuk.js", "src/s_p8802htc8lu.js", "src/s_t8q6qpbu0pe.js", "src/s_tlrteipsgyw.js"], "symbols": ["s_0e3es3vnWuk", "s_p8802htc8lU", "s_t8Q6Qpbu0pE", "s_TlrTEIpSGyw"] }, "q-80fbf83e.js": { "size": 104, "imports": ["q-65badc42.js"], "origins": ["src/entry_Header.js", "src/s_gm3f0h6v3fa.js"], "symbols": ["s_gm3f0H6v3fA"] }, "q-860f6b19.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_clips.js", "src/s_j5h3enar0he.js"], "symbols": ["s_j5h3enAr0HE"] }, "q-8735d118.js": { "size": 1587, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry__postid_.js", "src/s_xo5tmagpzos.js"], "symbols": ["s_Xo5tmaGPZOs"] }, "q-9c36486d.js": { "size": 58, "imports": ["q-65badc42.js"] }, "q-9e917870.js": { "size": 297, "imports": ["q-65badc42.js", "q-d0d0dbfd.js"], "origins": ["src/entry_layout_index.js", "src/s_ncbfhh0rq0m.js"], "symbols": ["s_NcbFhH0Rq0M"] }, "q-b4621644.js": { "size": 1489, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "dynamicImports": ["q-df1454c4.js"], "origins": ["@builder.io/qwik/build", "src/entry_QwikCity.js", "src/s_aaalzkh0klq.js", "src/s_z1nvhyeppoi.js"], "symbols": ["s_AaAlzKH0KlQ", "s_z1nvHyEppoI"] }, "q-b4c7c099.js": { "size": 1847, "imports": ["q-65badc42.js"], "origins": ["src/entry_Post.js", "src/s_bsno02boseo.js", "src/s_pedtn2z80a4.js"], "symbols": ["s_bSNo02BOSeo", "s_PeDTn2z80A4"] }, "q-b4c84de9.js": { "size": 158, "imports": ["q-65badc42.js"], "dynamicImports": ["q-8735d118.js"], "origins": ["src/routes/posts/[postid]/index.js"] }, "q-bb1f9e8a.js": { "size": 893, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_Head.js", "src/s_zgn7xgnxc7q.js"], "symbols": ["s_zgN7XgNXC7Q"] }, "q-c5f2b5d0.js": { "size": 1559, "imports": ["q-2b6484ca.js", "q-65badc42.js"], "origins": ["src/entry_layout_profile.js", "src/s_aeombop047y.js"], "symbols": ["s_aeoMBoP047Y"] }, "q-d0d0dbfd.js": { "size": 326, "imports": ["q-65badc42.js"], "dynamicImports": ["q-07309be4.js", "q-6232aac8.js", "q-80fbf83e.js"], "origins": ["src/components/header/header.js", "src/components/menu/menu.js", "src/components/sidebar/sidebar.js"] }, "q-df1454c4.js": { "size": 900, "imports": ["q-65badc42.js"], "dynamicImports": ["q-1288b5e3.js", "q-1439a3ac.js", "q-15642003.js", "q-1a063a29.js", "q-237c0038.js", "q-25e8cbed.js", "q-5dd1a945.js", "q-b4c84de9.js", "q-e582bef0.js", "q-f089809a.js"], "origins": ["@qwik-city-plan"] }, "q-e582bef0.js": { "size": 189, "imports": ["q-65badc42.js"], "dynamicImports": ["q-f0ab9a98.js"], "origins": ["src/routes/settings/index.js"] }, "q-f089809a.js": { "size": 181, "imports": ["q-65badc42.js"], "dynamicImports": ["q-860f6b19.js"], "origins": ["src/routes/clips/index.js"] }, "q-f0ab9a98.js": { "size": 128, "imports": ["q-65badc42.js"], "origins": ["src/entry_settings.js", "src/s_td1bxnbdyba.js"], "symbols": ["s_tD1BXnbDybA"] } }, "injections": [{ "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-30a9d718.css" } }], "version": "1", "options": { "target": "client", "buildMode": "production", "forceFullBuild": true, "entryStrategy": { "type": "smart" } }, "platform": { "qwik": "0.0.108", "vite": "", "rollup": "2.77.3", "env": "node", "os": "linux", "node": "18.8.0" } };
const Head = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const head2 = useDocumentHead();
  const loc = useLocation();
  return /* @__PURE__ */ jsxs("head", {
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
  return /* @__PURE__ */ jsxs(QwikCity, {
    children: [
      /* @__PURE__ */ jsx(Head, {}),
      /* @__PURE__ */ jsx("body", {
        lang: "en",
        children: /* @__PURE__ */ jsx(RouterOutlet, {})
      })
    ]
  });
}, "s_06hTRPZlBNE"));
function render(opts) {
  return renderToStream(/* @__PURE__ */ jsx(Root, {}), {
    manifest,
    ...opts
  });
}
const qwikCityHandler = qwikCity(render);
export {
  qwikCityHandler as default
};
