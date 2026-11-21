(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const jn=()=>{};var wt={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zt=function(t){const e=[];let n=0;for(let o=0;o<t.length;o++){let s=t.charCodeAt(o);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&o+1<t.length&&(t.charCodeAt(o+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++o)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},qn=function(t){const e=[];let n=0,o=0;for(;n<t.length;){const s=t[n++];if(s<128)e[o++]=String.fromCharCode(s);else if(s>191&&s<224){const r=t[n++];e[o++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=t[n++],a=t[n++],i=t[n++],c=((s&7)<<18|(r&63)<<12|(a&63)<<6|i&63)-65536;e[o++]=String.fromCharCode(55296+(c>>10)),e[o++]=String.fromCharCode(56320+(c&1023))}else{const r=t[n++],a=t[n++];e[o++]=String.fromCharCode((s&15)<<12|(r&63)<<6|a&63)}}return e.join("")},Ye={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,o=[];for(let s=0;s<t.length;s+=3){const r=t[s],a=s+1<t.length,i=a?t[s+1]:0,c=s+2<t.length,l=c?t[s+2]:0,m=r>>2,f=(r&3)<<4|i>>4;let y=(i&15)<<2|l>>6,b=l&63;c||(b=64,a||(y=64)),o.push(n[m],n[f],n[y],n[b])}return o.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(zt(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):qn(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,o=[];for(let s=0;s<t.length;){const r=n[t.charAt(s++)],i=s<t.length?n[t.charAt(s)]:0;++s;const l=s<t.length?n[t.charAt(s)]:64;++s;const f=s<t.length?n[t.charAt(s)]:64;if(++s,r==null||i==null||l==null||f==null)throw new Wn;const y=r<<2|i>>4;if(o.push(y),l!==64){const b=i<<4&240|l>>2;if(o.push(b),f!==64){const w=l<<6&192|f;o.push(w)}}}return o},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Wn extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Kn=function(t){const e=zt(t);return Ye.encodeByteArray(e,!0)},Yt=function(t){return Kn(t).replace(/\./g,"")},zn=function(t){try{return Ye.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(t){return Jt(void 0,t)}function Jt(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!Yn(n)||(t[n]=Jt(t[n],e[n]));return t}function Yn(t){return t!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Je(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jn=()=>Je().__FIREBASE_DEFAULTS__,Xn=()=>{if(typeof process>"u"||typeof wt>"u")return;const t=wt.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Qn=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&zn(t[1]);return e&&JSON.parse(e)},Zn=()=>{try{return jn()||Jn()||Xn()||Qn()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Xt=()=>{var t;return(t=Zn())==null?void 0:t.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,o)=>{n?this.reject(n):this.resolve(o),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,o))}}}function Xe(){try{return typeof indexedDB=="object"}catch{return!1}}function eo(){return new Promise((t,e)=>{try{let n=!0;const o="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(o);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(o),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var r;e(((r=s.error)==null?void 0:r.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const to="FirebaseError";class ae extends Error{constructor(e,n,o){super(n),this.code=e,this.customData=o,this.name=to,Object.setPrototypeOf(this,ae.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Qe.prototype.create)}}class Qe{constructor(e,n,o){this.service=e,this.serviceName=n,this.errors=o}create(e,...n){const o=n[0]||{},s=`${this.service}/${e}`,r=this.errors[e],a=r?no(r,o):"Error",i=`${this.serviceName}: ${a} (${s}).`;return new ae(s,i,o)}}function no(t,e){try{let n=0,o="";for(;n<t.length;){const s=t.indexOf("{$",n);if(s===-1){o+=t.substring(n);break}const r=t.indexOf("}",s+2);if(r===-1){o+=t.substring(n);break}const a=t.substring(s+2,r),i=e[a];o+=t.substring(n,s)+(i!=null?String(i):`<${a}?>`),n=r+1}return o}catch{return t}}function $e(t,e){if(t===e)return!0;const n=Object.keys(t),o=Object.keys(e);for(const s of n){if(!o.includes(s))return!1;const r=t[s],a=e[s];if(Et(r)&&Et(a)){if(!$e(r,a))return!1}else if(r!==a)return!1}for(const s of o)if(!n.includes(s))return!1;return!0}function Et(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oo=1e3,so=2,ro=14400*1e3,ao=.5;function io(t,e=oo,n=so){const o=e*Math.pow(n,t),s=Math.round(ao*o*(Math.random()-.5)*2);return Math.min(ro,o+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qt(t){return t&&t._delegate?t._delegate:t}class J{constructor(e,n,o){this.name=e,this.instanceFactory=n,this.type=o,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const o=new le;if(this.instancesDeferred.set(n,o),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&o.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),o=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(o)return null;throw s}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(uo(e))try{this.getOrInitializeService({instanceIdentifier:W})}catch{}for(const[n,o]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:s});o.resolve(r)}catch{}}}}clearInstance(e=W){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=W){return this.instances.has(e)}getOptions(e=W){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,o=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(o))throw Error(`${this.name}(${o}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:o,options:n});for(const[r,a]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(r);o===i&&a.resolve(s)}return s}onInit(e,n){const o=this.normalizeInstanceIdentifier(n),s=this.onInitCallbacks.get(o)??new Set;s.add(e),this.onInitCallbacks.set(o,s);const r=this.instances.get(o);return r&&e(r,o),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const o=this.onInitCallbacks.get(n);if(o)for(const s of o)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let o=this.instances.get(e);if(!o&&this.component&&(o=this.component.instanceFactory(this.container,{instanceIdentifier:lo(e),options:n}),this.instances.set(e,o),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(o,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,o)}catch{}return o||null}normalizeInstanceIdentifier(e=W){return this.component?this.component.multipleInstances?e:W:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function lo(t){return t===W?void 0:t}function uo(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fo{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new co(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var E;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(E||(E={}));const ho={debug:E.DEBUG,verbose:E.VERBOSE,info:E.INFO,warn:E.WARN,error:E.ERROR,silent:E.SILENT},po=E.INFO,mo={[E.DEBUG]:"log",[E.VERBOSE]:"log",[E.INFO]:"info",[E.WARN]:"warn",[E.ERROR]:"error"},go=(t,e,...n)=>{if(e<t.logLevel)return;const o=new Date().toISOString(),s=mo[e];if(s)console[s](`[${o}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ze{constructor(e){this.name=e,this._logLevel=po,this._logHandler=go,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in E))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ho[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,E.DEBUG,...e),this._logHandler(this,E.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,E.VERBOSE,...e),this._logHandler(this,E.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,E.INFO,...e),this._logHandler(this,E.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,E.WARN,...e),this._logHandler(this,E.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,E.ERROR,...e),this._logHandler(this,E.ERROR,...e)}}const bo=(t,e)=>e.some(n=>t instanceof n);let kt,_t;function yo(){return kt||(kt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function wo(){return _t||(_t=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Zt=new WeakMap,Be=new WeakMap,en=new WeakMap,Ae=new WeakMap,et=new WeakMap;function Eo(t){const e=new Promise((n,o)=>{const s=()=>{t.removeEventListener("success",r),t.removeEventListener("error",a)},r=()=>{n(j(t.result)),s()},a=()=>{o(t.error),s()};t.addEventListener("success",r),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Zt.set(n,t)}).catch(()=>{}),et.set(e,t),e}function ko(t){if(Be.has(t))return;const e=new Promise((n,o)=>{const s=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",a),t.removeEventListener("abort",a)},r=()=>{n(),s()},a=()=>{o(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",r),t.addEventListener("error",a),t.addEventListener("abort",a)});Be.set(t,e)}let Ue={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Be.get(t);if(e==="objectStoreNames")return t.objectStoreNames||en.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return j(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function _o(t){Ue=t(Ue)}function Co(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const o=t.call(Ie(this),e,...n);return en.set(o,e.sort?e.sort():[e]),j(o)}:wo().includes(t)?function(...e){return t.apply(Ie(this),e),j(Zt.get(this))}:function(...e){return j(t.apply(Ie(this),e))}}function vo(t){return typeof t=="function"?Co(t):(t instanceof IDBTransaction&&ko(t),bo(t,yo())?new Proxy(t,Ue):t)}function j(t){if(t instanceof IDBRequest)return Eo(t);if(Ae.has(t))return Ae.get(t);const e=vo(t);return e!==t&&(Ae.set(t,e),et.set(e,t)),e}const Ie=t=>et.get(t);function So(t,e,{blocked:n,upgrade:o,blocking:s,terminated:r}={}){const a=indexedDB.open(t,e),i=j(a);return o&&a.addEventListener("upgradeneeded",c=>{o(j(a.result),c.oldVersion,c.newVersion,j(a.transaction),c)}),n&&a.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),i.then(c=>{r&&c.addEventListener("close",()=>r()),s&&c.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),i}const To=["get","getKey","getAll","getAllKeys","count"],Ao=["put","add","delete","clear"],Oe=new Map;function Ct(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Oe.get(e))return Oe.get(e);const n=e.replace(/FromIndex$/,""),o=e!==n,s=Ao.includes(n);if(!(n in(o?IDBIndex:IDBObjectStore).prototype)||!(s||To.includes(n)))return;const r=async function(a,...i){const c=this.transaction(a,s?"readwrite":"readonly");let l=c.store;return o&&(l=l.index(i.shift())),(await Promise.all([l[n](...i),s&&c.done]))[0]};return Oe.set(e,r),r}_o(t=>({...t,get:(e,n,o)=>Ct(e,n)||t.get(e,n,o),has:(e,n)=>!!Ct(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Oo(n)){const o=n.getImmediate();return`${o.library}/${o.version}`}else return null}).filter(n=>n).join(" ")}}function Oo(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Fe="@firebase/app",vt="0.16.7";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M=new Ze("@firebase/app"),Ro="@firebase/app-compat",Do="@firebase/analytics-compat",No="@firebase/analytics",Lo="@firebase/app-check-compat",xo="@firebase/app-check",Mo="@firebase/auth",Po="@firebase/auth-compat",$o="@firebase/crashlytics",Bo="@firebase/database",Uo="@firebase/data-connect",Fo="@firebase/database-compat",Ho="@firebase/functions",Go="@firebase/functions-compat",Vo="@firebase/installations",jo="@firebase/installations-compat",qo="@firebase/messaging",Wo="@firebase/messaging-compat",Ko="@firebase/performance",zo="@firebase/performance-compat",Yo="@firebase/remote-config",Jo="@firebase/remote-config-compat",Xo="@firebase/storage",Qo="@firebase/storage-compat",Zo="@firebase/firestore",es="@firebase/ai",ts="@firebase/firestore-compat",ns="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He="[DEFAULT]",os={[Fe]:"fire-core",[Ro]:"fire-core-compat",[No]:"fire-analytics",[Do]:"fire-analytics-compat",[xo]:"fire-app-check",[Lo]:"fire-app-check-compat",[Mo]:"fire-auth",[Po]:"fire-auth-compat",[$o]:"fire-cls",[Bo]:"fire-rtdb",[Uo]:"fire-data-connect",[Fo]:"fire-rtdb-compat",[Ho]:"fire-fn",[Go]:"fire-fn-compat",[Vo]:"fire-iid",[jo]:"fire-iid-compat",[qo]:"fire-fcm",[Wo]:"fire-fcm-compat",[Ko]:"fire-perf",[zo]:"fire-perf-compat",[Yo]:"fire-rc",[Jo]:"fire-rc-compat",[Xo]:"fire-gcs",[Qo]:"fire-gcs-compat",[Zo]:"fire-fst",[ts]:"fire-fst-compat",[es]:"fire-vertex","fire-js":"fire-js",[ns]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ee=new Map,ss=new Map,Ge=new Map;function St(t,e){try{t.container.addComponent(e)}catch(n){M.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function se(t){const e=t.name;if(Ge.has(e))return M.debug(`There were multiple attempts to register component ${e}.`),!1;Ge.set(e,t);for(const n of Ee.values())St(n,t);for(const n of ss.values())St(n,t);return!0}function tt(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function rs(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const as={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},U=new Qe("app","Firebase",as);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e,n,o){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=o,this.container.addComponent(new J("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw U.create("app-deleted",{appName:this._name})}}function tn(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const o={name:He,automaticDataCollectionEnabled:!0,...e},s=o.name;if(typeof s!="string"||!s)throw U.create("bad-app-name",{appName:String(s)});if(n||(n=Xt()),!n)throw U.create("no-options");const r=Ee.get(s);if(r)if($e(n,r.options)){if($e(o,r.config))return r;throw U.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(r.config),newValue:JSON.stringify(o)})}else throw U.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(r.options),newValue:JSON.stringify(n)});const a=new fo(s);for(const c of Ge.values())a.addComponent(c);const i=new is(n,o,a);return Ee.set(s,i),i}function nn(t=He){const e=Ee.get(t);if(!e&&t===He&&Xt())return tn();if(!e)throw U.create("no-app",{appName:t});return e}function Y(t,e,n){let o=os[t]??t;n&&(o+=`-${n}`);const s=o.match(/\s|\//),r=e.match(/\s|\//);if(s||r){const a=[`Unable to register library "${o}" with version "${e}":`];s&&a.push(`library name "${o}" contains illegal characters (whitespace or "/")`),s&&r&&a.push("and"),r&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),M.warn(a.join(" "));return}se(new J(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cs="firebase-heartbeat-database",ls=1,de="firebase-heartbeat-store";let Re=null;function on(){return Re||(Re=So(cs,ls,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(de)}catch(n){console.warn(n)}}}}).catch(t=>{throw U.create("idb-open",{originalErrorMessage:t.message})})),Re}async function ds(t){try{const n=(await on()).transaction(de),o=await n.objectStore(de).get(sn(t));return await n.done,o}catch(e){if(e instanceof ae)M.warn(e.message);else{const n=U.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});M.warn(n.message)}}}async function Tt(t,e){try{const o=(await on()).transaction(de,"readwrite");await o.objectStore(de).put(e,sn(t)),await o.done}catch(n){if(n instanceof ae)M.warn(n.message);else{const o=U.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});M.warn(o.message)}}}function sn(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const us=1024,fs=30;class hs{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ms(n),this._heartbeatsCachePromise=this._storage.read().then(o=>(this._heartbeatsCache=o,o))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=At();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(a=>a.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>fs){const a=gs(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(o){M.warn(o)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=At(),{heartbeatsToSend:o,unsentEntries:s}=ps(this._heartbeatsCache.heartbeats),r=Yt(JSON.stringify({version:2,heartbeats:o}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return M.warn(n),""}}}function At(){return new Date().toISOString().substring(0,10)}function ps(t,e=us){const n=[];let o=t.slice();for(const s of t){const r=n.find(a=>a.agent===s.agent);if(r){if(r.dates.push(s.date),It(n)>e){r.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),It(n)>e){n.pop();break}o=o.slice(1)}return{heartbeatsToSend:n,unsentEntries:o}}class ms{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Xe()?eo().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ds(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const o=await this.read();return Tt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const o=await this.read();return Tt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function It(t){return Yt(JSON.stringify({version:2,heartbeats:t})).length}function gs(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let o=1;o<t.length;o++)t[o].date<n&&(n=t[o].date,e=o);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bs(t){se(new J("platform-logger",e=>new Io(e),"PRIVATE")),se(new J("heartbeat",e=>new hs(e),"PRIVATE")),Y(Fe,vt,t),Y(Fe,vt,"esm2020"),Y("fire-js","")}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ve="firebase-js-sdk-policy",ys=["https://www.googletagmanager.com/gtag/js","https://apis.google.com/js/api.js","https://www.google.com/recaptcha/api.js","https://www.google.com/recaptcha/enterprise.js"];let he,rn=!1;function an(t){if(!ys.some(n=>t.startsWith(n)&&(t.length===n.length||t.charAt(n.length)==="?")))throw new TypeError(`Firebase: Refusing to load untrusted script URL: ${t}`);return t}function ws(){if(he===void 0){he=null;const t=typeof window<"u"?window.trustedTypes:void 0;if(t!=null&&t.createPolicy)try{he=t.createPolicy(Ve,{createScriptURL:an})}catch{rn=!0}}return he}function Es(t,e){an(e);const n=ws();if(n){t.src=n.createScriptURL(e);return}try{t.src=e}catch(o){throw rn&&M.error(`Unable to load ${e} because this page requires Trusted Types for scripts but does not allow the "${Ve}" Trusted Types policy. To fix this, add "${Ve}" to the trusted-types directive of the page's Content-Security-Policy.`),o}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */bs("");var ks="firebase",_s="13.4.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Y(ks,_s,"app");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const je=new Map,cn={activated:!1,tokenObservers:[]},Cs={initialized:!1,enabled:!1};function C(t){return je.get(t)||{...cn}}function vs(t,e){return je.set(t,e),je.get(t)}function ve(){return Cs}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln="https://content-firebaseappcheck.googleapis.com/v1",Ss="exchangeRecaptchaV3Token",Ts="exchangeDebugToken",Ot={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},As=1440*60*1e3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Is{constructor(e,n,o,s,r){if(this.operation=e,this.retryPolicy=n,this.getWaitDuration=o,this.lowerBound=s,this.upperBound=r,this.pending=null,this.nextErrorWaitInterval=s,s>r)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new le,this.pending.promise.catch(n=>{}),await Os(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new le,this.pending.promise.catch(n=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(n){this.retryPolicy(n)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const n=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),n}}}function Os(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rs={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},A=new Qe("appCheck","AppCheck",Rs);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(t=!1){var e;return t?(e=self.grecaptcha)==null?void 0:e.enterprise:self.grecaptcha}function nt(t){if(!C(t).activated)throw A.create("use-before-activation",{appName:t.name})}function dn(t){const e=Math.round(t/1e3),n=Math.floor(e/(3600*24)),o=Math.floor((e-n*3600*24)/3600),s=Math.floor((e-n*3600*24-o*3600)/60),r=e-n*3600*24-o*3600-s*60;let a="";return n&&(a+=pe(n)+"d:"),o&&(a+=pe(o)+"h:"),a+=pe(s)+"m:"+pe(r)+"s",a}function pe(t){return t===0?"00":t>=10?t.toString():"0"+t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ot({url:t,body:e},n){const o={"Content-Type":"application/json"},s=n.getImmediate({optional:!0});if(s){const f=await s.getHeartbeatsHeader();f&&(o["X-Firebase-Client"]=f)}const r={method:"POST",body:JSON.stringify(e),headers:o};let a;try{a=await fetch(t,r)}catch(f){throw A.create("fetch-network-error",{originalErrorMessage:f==null?void 0:f.message})}if(a.status!==200)throw A.create("fetch-status-error",{httpStatus:a.status});let i;try{i=await a.json()}catch(f){throw A.create("fetch-parse-error",{originalErrorMessage:f==null?void 0:f.message})}const c=i.ttl.match(/^([\d.]+)(s)$/);if(!c||!c[2]||isNaN(Number(c[1])))throw A.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${i.ttl}`});const l=Number(c[1])*1e3,m=Date.now();return{token:i.token,expireTimeMillis:m+l,issuedAtTimeMillis:m}}function Ds(t,e){const{projectId:n,appId:o,apiKey:s}=t.options;return{url:`${ln}/projects/${n}/apps/${o}:${Ss}?key=${s}`,body:{recaptcha_v3_token:e}}}function un(t,e){const{projectId:n,appId:o,apiKey:s}=t.options;return{url:`${ln}/projects/${n}/apps/${o}:${Ts}?key=${s}`,body:{debug_token:e}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns="firebase-app-check-database",Ls=1,ue="firebase-app-check-store",fn="debug-token";let me=null;function hn(){return me||(me=new Promise((t,e)=>{try{const n=indexedDB.open(Ns,Ls);n.onsuccess=o=>{t(o.target.result)},n.onerror=o=>{var s;e(A.create("storage-open",{originalErrorMessage:(s=o.target.error)==null?void 0:s.message}))},n.onupgradeneeded=o=>{const s=o.target.result;switch(o.oldVersion){case 0:s.createObjectStore(ue,{keyPath:"compositeKey"})}}}catch(n){e(A.create("storage-open",{originalErrorMessage:n==null?void 0:n.message}))}}),me)}function xs(t){return mn(gn(t))}function Ms(t,e){return pn(gn(t),e)}function Ps(t){return pn(fn,t)}function $s(){return mn(fn)}async function pn(t,e){const o=(await hn()).transaction(ue,"readwrite"),r=o.objectStore(ue).put({compositeKey:t,value:e});return new Promise((a,i)=>{r.onsuccess=c=>{a()},o.onerror=c=>{var l;i(A.create("storage-set",{originalErrorMessage:(l=c.target.error)==null?void 0:l.message}))}})}async function mn(t){const n=(await hn()).transaction(ue,"readonly"),s=n.objectStore(ue).get(t);return new Promise((r,a)=>{s.onsuccess=i=>{const c=i.target.result;r(c?c.value:void 0)},n.onerror=i=>{var c;a(A.create("storage-get",{originalErrorMessage:(c=i.target.error)==null?void 0:c.message}))}})}function gn(t){return`${t.options.appId}-${t.name}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G=new Ze("@firebase/app-check");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bs(t){if(Xe()){let e;try{e=await xs(t)}catch(n){G.warn(`Failed to read token from IndexedDB. Error: ${n}`)}return e}}function De(t,e){return Xe()?Ms(t,e).catch(n=>{G.warn(`Failed to write token to IndexedDB. Error: ${n}`)}):Promise.resolve()}async function Us(t){let e;try{e=await $s()}catch{}if(e)return e;{const n=crypto.randomUUID();let o=`To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${n}

`;const s=t==null?void 0:t.options.appId,r=t==null?void 0:t.options.projectId;return r&&s?o+=`You can do so in the Firebase Console:
https://console.firebase.google.com/project/${r}/appcheck/apps?selectedAppId=${s}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${n} --project ${r} --app ${s}

`:o+=`You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`,o+=`Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`,console.log(o),Ps(n).catch(a=>G.warn(`Failed to persist debug token to IndexedDB. Error: ${a}`)),n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(){return ve().enabled}async function rt(){const t=ve();if(t.enabled&&t.token)return t.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function Fs(t){const e=Je(),n=ve();if(n.initialized=!0,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&e.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;n.enabled=!0;const o=new le;n.token=o,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?o.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN):o.resolve(Us(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hs={error:"UNKNOWN_ERROR"};function Gs(t){return Ye.encodeString(JSON.stringify(t),!1)}async function qe(t,e=!1,n=!1){const o=t.app;nt(o);const s=C(o);let r=s.token,a;if(r&&!ne(r)&&(s.token=void 0,r=void 0),!r){const l=await s.cachedTokenPromise;l&&(ne(l)?r=l:await De(o,void 0))}if(!e&&r&&ne(r))return{token:r.token};let i=!1;if(st())try{const l=await rt();s.exchangeTokenPromise||(s.exchangeTokenPromise=ot(un(o,l),t.heartbeatServiceProvider).finally(()=>{s.exchangeTokenPromise=void 0}),i=!0);const m=await s.exchangeTokenPromise;return await De(o,m),s.token=m,{token:m.token}}catch(l){return l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?G.warn(l.message):n&&G.error(l),Ne(l)}try{s.exchangeTokenPromise||(s.exchangeTokenPromise=s.provider.getToken().finally(()=>{s.exchangeTokenPromise=void 0}),i=!0),r=await C(o).exchangeTokenPromise}catch(l){l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?G.warn(l.message):n&&G.error(l),a=l}let c;return r?a?ne(r)?c={token:r.token,internalError:a}:c=Ne(a):(c={token:r.token},s.token=r,await De(o,r)):c=Ne(a),i&&wn(o,c),c}async function Vs(t){const e=t.app;nt(e);const{provider:n}=C(e);if(st()){const o=await rt(),s=un(e,o);s.body.limited_use=!0;const{token:r}=await ot(s,t.heartbeatServiceProvider);return{token:r}}else{const{token:o}=await n.getToken(!0);return{token:o}}}function bn(t,e,n,o){const{app:s}=t,r=C(s),a={next:n,error:o,type:e};if(r.tokenObservers=[...r.tokenObservers,a],r.token&&ne(r.token)){const i=r.token;Promise.resolve().then(()=>{n({token:i.token}),Dt(t)}).catch(()=>{})}r.cachedTokenPromise.then(()=>Dt(t))}function yn(t,e){const n=C(t),o=n.tokenObservers.filter(s=>s.next!==e);o.length===0&&n.tokenRefresher&&n.tokenRefresher.isRunning()&&n.tokenRefresher.stop(),n.tokenObservers=o}function Dt(t){const{app:e}=t,n=C(e);let o=n.tokenRefresher;o||(o=js(t),n.tokenRefresher=o),!o.isRunning()&&n.isTokenAutoRefreshEnabled&&o.start()}function js(t){const{app:e}=t;return new Is(async()=>{const n=C(e);let o;if(n.token?o=await qe(t,!0):o=await qe(t),o.error)throw o.error;if(o.internalError)throw o.internalError},()=>!0,()=>{const n=C(e);if(n.token){let o=n.token.issuedAtTimeMillis+(n.token.expireTimeMillis-n.token.issuedAtTimeMillis)*.5+3e5;const s=n.token.expireTimeMillis-300*1e3;return o=Math.min(o,s),Math.max(0,o-Date.now())}else return 0},Ot.RETRIAL_MIN_WAIT,Ot.RETRIAL_MAX_WAIT)}function wn(t,e){const n=C(t).tokenObservers;for(const o of n)try{o.type==="EXTERNAL"&&e.error!=null?o.error(e.error):o.next(e)}catch{}}function ne(t){return t.expireTimeMillis-Date.now()>0}function Ne(t){return{token:Gs(Hs),error:t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e,n){this.app=e,this.heartbeatServiceProvider=n}_delete(){const{tokenObservers:e}=C(this.app);for(const n of e)yn(this.app,n.next);return Promise.resolve()}}function Ws(t,e){return new qs(t,e)}function Ks(t){return{getToken:e=>qe(t,e),getLimitedUseToken:()=>Vs(t),addTokenListener:e=>bn(t,"INTERNAL",e),removeTokenListener:e=>yn(t.app,e)}}const zs="@firebase/app-check",Ys="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js="https://www.google.com/recaptcha/api.js";function Xs(t,e){const n=new le,o=C(t);o.reCAPTCHAState={initialized:n};const s=Qs(t),r=Rt(!1);return r?Nt(t,e,r,s,n):tr(()=>{const a=Rt(!1);if(!a)throw new Error("no recaptcha");Nt(t,e,a,s,n)}),n.promise}function Nt(t,e,n,o,s){n.ready(()=>{er(t,e,n,o),s.resolve(n)})}function Qs(t){const e=`fire_app_check_${t.name}`,n=document.createElement("div");return n.id=e,n.style.display="none",document.body.appendChild(n),e}async function Zs(t){nt(t);const n=await C(t).reCAPTCHAState.initialized.promise;return new Promise((o,s)=>{const r=C(t).reCAPTCHAState;n.ready(()=>{o(n.execute(r.widgetId,{action:"fire_app_check"}))})})}function er(t,e,n,o){const s=n.render(o,{sitekey:e,size:"invisible",callback:()=>{C(t).reCAPTCHAState.succeeded=!0},"error-callback":()=>{C(t).reCAPTCHAState.succeeded=!1}}),r=C(t);r.reCAPTCHAState={...r.reCAPTCHAState,widgetId:s}}function tr(t){const e=document.createElement("script");Es(e,Js),e.onload=t,document.head.appendChild(e)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(e=!1){var s,r,a;or(this._throttleData);const n=await Zs(this._app).catch(i=>{throw A.create("recaptcha-error")});if(!((s=C(this._app).reCAPTCHAState)!=null&&s.succeeded))throw A.create("recaptcha-error");let o;try{const i=Ds(this._app,n);e&&(i.body.limited_use=!0),o=await ot(i,this._heartbeatServiceProvider)}catch(i){throw(r=i.code)!=null&&r.includes("fetch-status-error")?(this._throttleData=nr(Number((a=i.customData)==null?void 0:a.httpStatus),this._throttleData),A.create("initial-throttle",{time:dn(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):i}return this._throttleData=null,o}initialize(e){this._app=e,this._heartbeatServiceProvider=tt(e,"heartbeat"),Xs(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof at?this._siteKey===e._siteKey:!1}}function nr(t,e){if(t===404||t===403)return{backoffCount:1,allowRequestsAfter:Date.now()+As,httpStatus:t};{const n=e?e.backoffCount:0,o=io(n,1e3,2);return{backoffCount:n+1,allowRequestsAfter:Date.now()+o,httpStatus:t}}}function or(t){if(t&&Date.now()-t.allowRequestsAfter<=0)throw A.create("throttled",{time:dn(t.allowRequestsAfter-Date.now()),httpStatus:t.httpStatus})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sr(t=nn(),e){var s;t=Qt(t);const n=tt(t,"app-check");if(ve().initialized||Fs(t),st()&&rt().then(r=>{console.log(`Firebase App Check debug token: ${r}`)}),n.isInitialized()){const r=n.getImmediate(),a=n.getOptions();if(a&&!!a.isTokenAutoRefreshEnabled==!!e.isTokenAutoRefreshEnabled&&((s=a.provider)!=null&&s.isEqual(e.provider)))return r;throw A.create("already-initialized",{appName:t.name})}const o=n.initialize({options:e});return rr(t,e.provider,e.isTokenAutoRefreshEnabled),C(t).isTokenAutoRefreshEnabled&&bn(o,"INTERNAL",()=>{}),o}function rr(t,e,n=!1){const o=vs(t,{...cn});o.activated=!0,o.provider=e,o.cachedTokenPromise=Bs(t).then(s=>(s&&ne(s)&&(o.token=s,wn(t,{token:s.token})),s)),o.isTokenAutoRefreshEnabled=n&&t.automaticDataCollectionEnabled,!t.automaticDataCollectionEnabled&&n&&G.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),o.provider.initialize(t)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ar="app-check",Lt="app-check-internal";function ir(){se(new J(ar,t=>{const e=t.getProvider("app").getImmediate(),n=t.getProvider("heartbeat");return Ws(e,n)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider(Lt).initialize()})),se(new J(Lt,t=>{const e=t.getProvider("app-check").getImmediate();return Ks(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),Y(zs,Ys)}ir();var xt="@firebase/ai",We="3.1.0";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const re="AI",cr="global",lr="firebasevertexai.googleapis.com",ke="v1beta",Mt=We,dr="gl-js",ur="hybrid",fr=180*1e3,hr="gemini-3.5-flash-lite";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h extends ae{constructor(e,n,o){const s=re,r=`${s}/${e}`,a=`${s}: ${n} (${r})`;super(e,a),this.code=e,this.customErrorData=o,Error.captureStackTrace&&Error.captureStackTrace(this,h),Object.setPrototypeOf(this,h.prototype),this.toString=()=>a}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt=["user","model","function","system"],En={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},S={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},I={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},H={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",ALREADY_INITIALIZED:"already-initialized",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X={STRING:"string",NUMBER:"number",INTEGER:"integer",BOOLEAN:"boolean",ARRAY:"array",OBJECT:"object"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F={AGENT_PLATFORM:"AGENT_PLATFORM",GOOGLE_AI:"GOOGLE_AI"};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e){this.backendType=e}}class Se extends kn{constructor(){super(F.GOOGLE_AI)}_getModelPath(e,n){return`/${ke}/projects/${e}/${n}`}_getTemplatePath(e,n){return`/${ke}/projects/${e}/templates/${n}`}}class _n extends kn{constructor(e){super(F.AGENT_PLATFORM),this.location=cr,e&&(this.location=e)}_getModelPath(e,n){return`/${ke}/projects/${e}/locations/${this.location}/${n}`}_getTemplatePath(e,n){return`/${ke}/projects/${e}/locations/${this.location}/templates/${n}`}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pr(t){if(t instanceof Se)return`${re}/googleai`;if(t instanceof _n)return`${re}/agentplatform/${t.location}`;throw new h(u.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function mr(t){const e=t.split("/");if(e[0]!==re)throw new h(u.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"agentplatform":const o=e[2];if(!o)throw new h(u.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new _n(o);case"googleai":return new Se;default:throw new h(u.ERROR,`Invalid instance identifier string: '${t}'`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _=new Ze("@firebase/ai");var B;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(B||(B={}));/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn={type:"text",languages:["en"]},Le=[Cn,{type:"image"}],xe=[Cn];class L{constructor(e,n,o){this.languageModelProvider=e,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:Le,expectedOutputs:xe}},o&&(this.onDeviceParams=o,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=Le),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=xe)):this.onDeviceParams.createOptions={expectedInputs:Le,expectedOutputs:xe})}async isAvailable(e){var o;if(!this.mode)return _.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===I.ONLY_IN_CLOUD)return _.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const n=await((o=this.languageModelProvider)==null?void 0:o.availability(this.onDeviceParams.createOptions));if(this.mode===I.ONLY_ON_DEVICE){if(n===B.UNAVAILABLE)throw new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===B.DOWNLOADABLE||n===B.DOWNLOADING){_.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(s){throw new h(u.ERROR,s.message)}return!0}return!0}return n!==B.AVAILABLE?(_.debug(`On-device inference unavailable because availability is "${n}".`),!1):L.isOnDeviceRequest(e)?!0:(_.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){const n=await this.createSession(),o=await Promise.all(e.contents.map(L.toLanguageModelMessage)),s=await n.prompt(o,this.onDeviceParams.promptOptions);return L.toResponse(s)}async generateContentStream(e){const n=await this.createSession(),o=await Promise.all(e.contents.map(L.toLanguageModelMessage)),s=n.promptStreaming(o,this.onDeviceParams.promptOptions);return L.toStreamResponse(s)}async countTokens(e){throw new h(u.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return _.debug("Empty prompt rejected for on-device inference."),!1;for(const n of e.contents){if(n.parts.some(o=>"functionResponse"in o))return _.debug("Content with a function response part rejected for on-device inference."),!1;for(const o of n.parts)if("inlineData"in o&&o.inlineData&&L.SUPPORTED_MIME_TYPES.indexOf(o.inlineData.mimeType)===-1)return _.debug(`Unsupported mime type "${o.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){var o;const n=await((o=this.languageModelProvider)==null?void 0:o.availability(this.onDeviceParams.createOptions));return(n===B.DOWNLOADABLE||n===B.DOWNLOADING)&&this.download(e),n}download(e){var o;if(this.downloadPromise)return;const n={...this.onDeviceParams.createOptions};n&&!n.monitor&&e&&(n.monitor=s=>{s.addEventListener("downloadprogress",r=>{e(r.loaded)})}),this.downloadPromise=(o=this.languageModelProvider)==null?void 0:o.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){const n=await Promise.all(e.parts.map(L.toLanguageModelMessageContent));return{role:L.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if("text"in e&&typeof e.text=="string")return{type:"text",value:e.text};if("inlineData"in e&&e.inlineData){const o=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(o)}}throw new h(u.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new h(u.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){const n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(o,s){const r=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:o}]}}]});s.enqueue(n.encode(`data: ${r}

`))}}))}}}L.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function gr(t,e,n){const s=(e||Je()).LanguageModel;if(s&&t)return new L(s,t,n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,n,o,s,r){this.app=e,this.backend=n,this.chromeAdapterFactory=r;const a=s==null?void 0:s.getImmediate({optional:!0}),i=o==null?void 0:o.getImmediate({optional:!0});this.auth=i||null,this.appCheck=a||null}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yr(t,{instanceIdentifier:e}){if(!e)throw new h(u.ERROR,"AIService instance identifier is undefined.");const n=mr(e),o=t.getProvider("app").getImmediate(),s=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new br(o,n,s,r,gr)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wr(t){var n,o,s,r,a,i,c;if((o=(n=t.app)==null?void 0:n.options)!=null&&o.apiKey)if((r=(s=t.app)==null?void 0:s.options)!=null&&r.projectId){if(!((i=(a=t.app)==null?void 0:a.options)!=null&&i.appId))throw new h(u.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new h(u.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new h(u.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const e={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,backend:t.backend};if(rs(t.app)&&t.app.settings.appCheckToken){const l=t.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:l})}else t.appCheck&&((c=t.options)!=null&&c.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(e.getAuthToken=()=>t.auth.getToken()),e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,n){this._apiSettings=wr(e),this.model=ce.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(e,n){return n===F.GOOGLE_AI?ce.normalizeGoogleAIModelName(e):ce.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Er="Timeout has expired.",Me="AbortError";class kr{constructor(e){this.params=e}toString(){const e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){var e;return((e=this.params.singleRequestOptions)==null?void 0:e.baseUrl)??`https://${lr}`}get queryParams(){const e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}}function _r(t){const e=[];return e.push(`${dr}/${Mt}`),e.push(`fire/${Mt}`),(t.params.apiSettings.inferenceMode===I.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===I.PREFER_IN_CLOUD)&&e.push(ur),e.join(" ")}async function Cr(t){const e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",_r(t)),e.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){const n=await t.params.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&_.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.params.apiSettings.getAuthToken){const n=await t.params.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function it(t,e){var l,m;const n=new kr(t);let o;const s=(l=t.singleRequestOptions)==null?void 0:l.signal,r=((m=t.singleRequestOptions)==null?void 0:m.timeout)!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:fr,a=new AbortController,i=setTimeout(()=>{a.abort(new DOMException(Er,Me)),_.debug(`Aborting request to ${n} due to timeout (${r}ms)`)},r),c=AbortSignal.any(s?[s,a.signal]:[a.signal]);if(s&&s.aborted)throw clearTimeout(i),new DOMException(s.reason??"Aborted externally before fetch",Me);try{const f={method:"POST",headers:await Cr(n),signal:c,body:e};if(o=await fetch(n.toString(),f),!o.ok){let y="",b;try{const w=await o.json();y=w.error.message,w.error.details&&(y+=` ${JSON.stringify(w.error.details)}`,b=w.error.details)}catch{}throw o.status===403&&b&&b.some(w=>w.reason==="SERVICE_DISABLED")&&b.some(w=>{var x,Q;return(Q=(x=w.links)==null?void 0:x[0])==null?void 0:Q.description.includes("Google developers console API activation")})?new h(u.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:o.status,statusText:o.statusText,errorDetails:b}):new h(u.FETCH_ERROR,`Error fetching from ${n}: [${o.status} ${o.statusText}] ${y}`,{status:o.status,statusText:o.statusText,errorDetails:b})}}catch(f){let y=f;throw f.code!==u.FETCH_ERROR&&f.code!==u.API_NOT_ENABLED&&f instanceof Error&&f.name!==Me&&(y=new h(u.ERROR,`Error fetching from ${n.toString()}: ${f.message}`),y.stack=f.stack),y}finally{clearTimeout(i)}return o}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&_.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),Sn(t.candidates[0]))throw new h(u.RESPONSE_ERROR,`Response error: ${K(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function P(t){return"type"in t&&t.type?t:t.text!==void 0?{...t,type:"text"}:t.inlineData!==void 0?{...t,type:"inlineData"}:t.functionCall!==void 0?{...t,type:"functionCall"}:t.functionResponse!==void 0?{...t,type:"functionResponse"}:t.fileData!==void 0?{...t,type:"fileData"}:t.executableCode!==void 0?{...t,type:"executableCode"}:t.codeExecutionResult!==void 0?{...t,type:"codeExecutionResult"}:t}function _e(t,e=H.IN_CLOUD){var o,s;if((o=t.candidates)!=null&&o[0]&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0),t.candidates)for(const r of t.candidates)(s=r.content)!=null&&s.parts&&(r.content.parts=r.content.parts.map(P));const n=vr(t);return n.inferenceSource=e,n}function vr(t){return t.text=()=>{if(ge(t))return $t(t,e=>!("thought"in e&&e.thought));if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Text not available. ${K(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(ge(t)){const e=$t(t,n=>!!("thought"in n&&n.thought));return e===""?void 0:e}else if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Thought summary not available. ${K(t)}`,{response:t})},t.inlineDataParts=()=>{if(ge(t))return Sr(t);if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Data not available. ${K(t)}`,{response:t})},t.functionCalls=()=>{if(ge(t))return vn(t);if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Function call not available. ${K(t)}`,{response:t})},t}function $t(t,e){var o,s,r,a;const n=[];if((s=(o=t.candidates)==null?void 0:o[0].content)!=null&&s.parts)for(const i of(a=(r=t.candidates)==null?void 0:r[0].content)==null?void 0:a.parts){const c=P(i);c.type==="text"&&e(c)&&n.push(c.text)}return n.length>0?n.join(""):""}function vn(t){var n,o,s,r;if(!t)return;const e=[];if((o=(n=t.candidates)==null?void 0:n[0].content)!=null&&o.parts)for(const a of(r=(s=t.candidates)==null?void 0:s[0].content)==null?void 0:r.parts){const i=P(a);i.type==="functionCall"&&e.push(i.functionCall)}if(e.length>0)return e}function Sr(t){var n,o,s,r;const e=[];if((o=(n=t.candidates)==null?void 0:n[0].content)!=null&&o.parts)for(const a of(r=(s=t.candidates)==null?void 0:s[0].content)==null?void 0:r.parts){const i=P(a);i.type==="inlineData"&&e.push(i)}if(e.length>0)return e}const Tr=[S.RECITATION,S.SAFETY,S.BLOCKLIST,S.PROHIBITED_CONTENT,S.SPII,S.MALFORMED_FUNCTION_CALL,S.IMAGE_SAFETY,S.IMAGE_PROHIBITED_CONTENT,S.IMAGE_OTHER,S.NO_IMAGE,S.IMAGE_RECITATION,S.LANGUAGE,S.UNEXPECTED_TOOL_CALL,S.TOO_MANY_TOOL_CALLS,S.MISSING_THOUGHT_SIGNATURE,S.MALFORMED_RESPONSE];function Sn(t){return!!t.finishReason&&Tr.some(e=>e===t.finishReason)}function K(t){var n,o,s;let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",(n=t.promptFeedback)!=null&&n.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),(o=t.promptFeedback)!=null&&o.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if((s=t.candidates)!=null&&s[0]){const r=t.candidates[0];Sn(r)&&(e+=`Candidate was blocked due to ${r.finishReason}`,r.finishMessage&&(e+=`: ${r.finishMessage}`))}return e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ct(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{type:"text",text:t}]};if(t.type==="text"||"text"in t&&typeof t.text=="string")return{role:"system",parts:[z(P(t))]};if(t.parts){const e=t.parts.map(n=>z(P(n)));return t.role?{...t,parts:e}:{role:"system",parts:e}}}}function ie(t){let e=[];if(typeof t=="string")e=[{type:"text",text:t}];else for(const n of t)typeof n=="string"?e.push({type:"text",text:n}):e.push(z(P(n)));return Ar(e)}function Ar(t){const e={role:"user",parts:[]};let n=!1,o=!1;for(const s of t)s.type==="functionResponse"||"functionResponse"in s?o=!0:n=!0,e.parts.push(s);if(n&&o)throw new h(u.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!n&&!o)throw new h(u.INVALID_CONTENT,"No Content is provided for sending chat message.");return e}function Pe(t){let e;if(t.contents){const n=t;e={...n,contents:n.contents.map(o=>({...o,parts:o.parts?o.parts.map(P):[]}))}}else e={contents:[ie(t)]};return t.systemInstruction&&(e.systemInstruction=ct(t.systemInstruction)),e}function Ir(t){return t.parts&&Array.isArray(t.parts)?{...t,parts:t.parts.map(lt)}:t}function lt(t){let e;if("type"in t){const{type:n,...o}=t;e=o}else e=t;return e.functionResponse&&(e={...e,functionResponse:Ir(e.functionResponse)}),e}function dt(t){return t.parts?{...t,parts:t.parts.map(lt)}:t}function Tn(t){return t==null||typeof t=="string"?t:"parts"in t&&Array.isArray(t.parts)?dt(t):lt(t)}function An(t){const e={...t};return e.contents&&(e.contents=e.contents.map(dt)),e.systemInstruction&&(e.systemInstruction=Tn(e.systemInstruction)),e}function Or(t){const e={...t};return e.contents&&(e.contents=e.contents.map(dt)),e.systemInstruction&&(e.systemInstruction=Tn(e.systemInstruction)),e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function In(t){var e,n;if((e=t.safetySettings)==null||e.forEach(o=>{if(o.method)throw new h(u.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),(n=t.generationConfig)!=null&&n.topK){const o=Math.round(t.generationConfig.topK);o!==t.generationConfig.topK&&(_.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=o)}return t}function ut(t){return{candidates:t.candidates?Dr(t.candidates):void 0,promptFeedback:t.promptFeedback?Nr(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function Rr(t,e){return{generateContentRequest:{model:e,...t}}}function Dr(t){const e=[];let n;return e&&t.forEach(o=>{var a,i;let s;if(o.citationMetadata&&(s={citations:o.citationMetadata.citationSources}),o.safetyRatings&&(n=o.safetyRatings.map(c=>({...c,severity:c.severity??En.HARM_SEVERITY_UNSUPPORTED,probabilityScore:c.probabilityScore??0,severityScore:c.severityScore??0}))),(i=(a=o.content)==null?void 0:a.parts)!=null&&i.some(c=>"videoMetadata"in c&&c.videoMetadata))throw new h(u.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const r={index:o.index,content:o.content,finishReason:o.finishReason,finishMessage:o.finishMessage,safetyRatings:n,citationMetadata:s,groundingMetadata:o.groundingMetadata,urlContextMetadata:o.urlContextMetadata};e.push(r)}),e}function Nr(t){const e=[];return(t.safetyRatings??[]).forEach(o=>{e.push({category:o.category,probability:o.probability,severity:o.severity??En.HARM_SEVERITY_UNSUPPORTED,probabilityScore:o.probabilityScore??0,severityScore:o.severityScore??0,blocked:o.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function Lr(t,e,n){const o=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),s=$r(o),[r,a]=s.tee(),{response:i,firstValue:c}=await xr(a,e,n);return{stream:Pr(r,e,n),response:i,firstValue:c}}async function xr(t,e,n){const[o,s]=t.tee(),r=o.getReader(),{value:a}=await r.read();return{firstValue:a,response:Mr(s,e,n)}}async function Mr(t,e,n){const o=[],s=t.getReader();for(;;){const{done:r,value:a}=await s.read();if(r){let i=Br(o);return e.backend.backendType===F.GOOGLE_AI&&(i=ut(i)),_e(i,n)}o.push(a)}}async function*Pr(t,e,n){var s,r;const o=t.getReader();for(;;){const{value:a,done:i}=await o.read();if(i)break;let c;e.backend.backendType===F.GOOGLE_AI?c=_e(ut(a),n):c=_e(a,n);const l=(s=c.candidates)==null?void 0:s[0];!((r=l==null?void 0:l.content)!=null&&r.parts)&&!(l!=null&&l.finishReason)&&!(l!=null&&l.citationMetadata)&&!(l!=null&&l.urlContextMetadata)||(yield c)}}function $r(t){const e=t.getReader();return new ReadableStream({start(o){let s="";return r();function r(){return e.read().then(({value:a,done:i})=>{if(i){if(s.trim()){o.error(new h(u.PARSE_FAILED,"Failed to parse stream"));return}o.close();return}s+=a;let c=s.match(Bt),l;for(;c;){try{l=JSON.parse(c[1])}catch{o.error(new h(u.PARSE_FAILED,`Error parsing JSON response: "${c[1]}`));return}o.enqueue(l),s=s.substring(c[0].length),c=s.match(Bt)}return r()})}}})}function Br(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const o of t)if(o.candidates)for(const s of o.candidates){const r=s.index||0;n.candidates||(n.candidates=[]),n.candidates[r]||(n.candidates[r]={index:s.index}),n.candidates[r].citationMetadata=s.citationMetadata,n.candidates[r].finishReason=s.finishReason,n.candidates[r].finishMessage=s.finishMessage,n.candidates[r].safetyRatings=s.safetyRatings,n.candidates[r].groundingMetadata=s.groundingMetadata;const a=s.urlContextMetadata;if(typeof a=="object"&&a!==null&&Object.keys(a).length>0&&(n.candidates[r].urlContextMetadata=a),s.content){if(!s.content.parts)continue;n.candidates[r].content||(n.candidates[r].content={role:s.content.role||"user",parts:[]});for(const i of s.content.parts){if("text"in i&&i.text==="")continue;if(Object.keys(i).length===0)throw new h(u.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");const c=P({...i});Object.keys(c).length>0&&n.candidates[r].content.parts.push(c)}}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ur=[u.FETCH_ERROR,u.ERROR,u.API_NOT_ENABLED];async function On(t,e,n,o){if(!e)return{response:await o(),inferenceSource:H.IN_CLOUD};switch(e.mode){case I.ONLY_ON_DEVICE:if(await e.isAvailable(t))return{response:await n(),inferenceSource:H.ON_DEVICE};throw new h(u.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case I.ONLY_IN_CLOUD:return{response:await o(),inferenceSource:H.IN_CLOUD};case I.PREFER_IN_CLOUD:try{return{response:await o(),inferenceSource:H.IN_CLOUD}}catch(s){if(s instanceof h&&Ur.includes(s.code)&&await e.isAvailable(t))return{response:await n(),inferenceSource:H.ON_DEVICE};throw s}case I.PREFER_ON_DEVICE:return await e.isAvailable(t)?{response:await n(),inferenceSource:H.ON_DEVICE}:{response:await o(),inferenceSource:H.IN_CLOUD};default:throw new h(u.ERROR,`Unexpected infererence mode: ${e.mode}`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fr(t,e,n,o){return n=An(n),t.backend.backendType===F.GOOGLE_AI&&(n=In(n)),it({task:"streamGenerateContent",model:e,apiSettings:t,stream:!0,singleRequestOptions:o},JSON.stringify(n))}async function Rn(t,e,n,o,s){const r=await On(n,o,()=>o.generateContentStream(n),()=>Fr(t,e,n,s));return Lr(r.response,t,r.inferenceSource)}async function Hr(t,e,n,o){return n=An(n),t.backend.backendType===F.GOOGLE_AI&&(n=In(n)),it({model:e,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:o},JSON.stringify(n))}async function Dn(t,e,n,o,s){const r=await On(n,o,()=>o.generateContent(n),()=>Hr(t,e,n,s)),a=await Gr(r.response,t);return{response:_e(a,r.inferenceSource)}}async function Gr(t,e){const n=await t.json();return e.backend.backendType===F.GOOGLE_AI?ut(n):n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut="SILENT_ERROR",Ft=10;class Vr{constructor(e,n,o){this.params=n,this.requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,z(this._history).map(e=>({...e,parts:e.parts?e.parts.map(P):[]}))}async _sendMessage(e,n){let o={};await this._sendPromise;const s=[];return this._sendPromise=this._sendPromise.then(async()=>{var c,l,m;let r,a=0;const i=((c=this.requestOptions)==null?void 0:c.maxSequentialFunctionCalls)??Ft;do{let f;if(r){a++;const w=await this._callFunctionsAsNeeded(r);f=ie(w)}else f=ie(e);const y=this._formatRequest(f,[...s]);s.push(f);const b=await this._callGenerateContent(y,n);if(b)if(o=b,r=this._getCallableFunctionCalls(b.response),b.response.candidates&&b.response.candidates.length>0){const w={parts:((l=b.response.candidates)==null?void 0:l[0].content.parts)||[],role:((m=b.response.candidates)==null?void 0:m[0].content.role)||"model"};s.push(z(w))}else{const w=K(b.response);w&&_.warn(`sendMessage() was unsuccessful. ${w}. Inspect response object for details.`)}else r=void 0}while(r&&a<i);r&&a>=i&&_.warn(`Automatic function calling exceeded the limit of ${i} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(s),o}async _sendMessageStream(e,n){await this._sendPromise;const o=[],r=(async()=>{var m;let a,i=0;const c=((m=this.requestOptions)==null?void 0:m.maxSequentialFunctionCalls)??Ft;let l;do{let f;if(a){i++;const b=await this._callFunctionsAsNeeded(a);f=ie(b)}else f=ie(e);const y=this._formatRequest(f,[...o]);if(o.push(f),l=await this._callGenerateContentStream(y,n),a=this._getCallableFunctionCalls(l.firstValue),a&&l.firstValue&&l.firstValue.candidates&&l.firstValue.candidates.length>0){const b={...l.firstValue.candidates[0].content};b.role||(b.role="model"),o.push(b)}}while(a&&i<c);return a&&i>=c&&_.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`),{stream:l.stream,response:l.response}})();return this._sendPromise=this._sendPromise.then(async()=>r).catch(a=>{throw new Error(Ut)}).then(a=>a.response).then(a=>{if(a.candidates&&a.candidates.length>0){this._history=this._history.concat(o);const i={...a.candidates[0].content};i.role||(i.role="model"),this._history.push(z(i))}else{const i=K(a);i&&_.warn(`sendMessageStream() was unsuccessful. ${i}. Inspect response object for details.`)}}).catch(a=>{a.message!==Ut&&a.name!=="AbortError"&&_.error(a)}),r}_getCallableFunctionCalls(e){var s,r,a;const n=(r=(s=this.params)==null?void 0:s.tools)==null?void 0:r.find(i=>i.functionDeclarations);if(!(n!=null&&n.functionDeclarations))return;const o=vn(e);if(o){for(const i of o)if(!((a=n.functionDeclarations)==null?void 0:a.some(l=>l.name===i.name&&typeof l.functionReference=="function")))return;return o}}async _callFunctionsAsNeeded(e){var r,a;const n=[],o=[],s=(a=(r=this.params)==null?void 0:r.tools)==null?void 0:a.find(i=>i.functionDeclarations);if(s&&s.functionDeclarations){for(const c of e){const l=s.functionDeclarations.find(m=>m.name===c.name);if(l!=null&&l.functionReference){const m=Promise.resolve(l.functionReference(c.args)).catch(f=>{const y=new h(u.ERROR,`Error in user-defined function "${l.name}": ${f.message}`);throw y.stack=f.stack,y});n.push({name:c.name,id:c.id,results:m}),o.push(m)}}await Promise.all(o);const i=[];for(const{name:c,id:l,results:m}of n){const f={name:c,response:await m};l&&(f.id=l),i.push({type:"functionResponse",functionResponse:f})}return i}else throw new h(u.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jr=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],qr={user:["text","inlineData","functionResponse"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},Ht={user:["model"],function:["model"],model:["user","function"],system:[]};function Wr(t){let e=null;for(const n of t){const{role:o,parts:s}=n;if(!e&&o!=="user")throw new h(u.INVALID_CONTENT,`First Content should be with role 'user', got ${o}`);if(!Pt.includes(o))throw new h(u.INVALID_CONTENT,`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(Pt)}`);if(!Array.isArray(s))throw new h(u.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(s.length===0)throw new h(u.INVALID_CONTENT,"Each Content should have at least one part");const r={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const i of s){if(i.type)r[i.type]+=1;else for(const c of["text","inlineData","functionCall","functionResponse","fileData","executableCode","codeExecutionResult"])c in i&&(r[c]+=1);"thought"in i&&i.thought&&(r.thought+=1),"thoughtSignature"in i&&i.thoughtSignature&&(r.thoughtSignature+=1)}const a=qr[o];for(const i of jr)if(!a.includes(i)&&r[i]>0)throw new h(u.INVALID_CONTENT,`Content with role '${o}' can't contain '${i}' part`);if(e&&!Ht[o].includes(e.role))throw new h(u.INVALID_CONTENT,`Content with role '${o}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(Ht)}`);e=n}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr extends Vr{constructor(e,n,o,s,r){var a;super(e,s,r),this.model=n,this.chromeAdapter=o,this.params=s,this.requestOptions=r,s!=null&&s.history&&(Wr(s.history),this._history=z(s.history)),((a=this.params)==null?void 0:a.systemInstruction)!=null&&(this.params={...this.params,systemInstruction:ct(this.params.systemInstruction)})}_formatRequest(e,n){var o,s,r,a,i;return{safetySettings:(o=this.params)==null?void 0:o.safetySettings,generationConfig:(s=this.params)==null?void 0:s.generationConfig,tools:(r=this.params)==null?void 0:r.tools,toolConfig:(a=this.params)==null?void 0:a.toolConfig,systemInstruction:(i=this.params)==null?void 0:i.systemInstruction,contents:[...this._history,...n,e]}}_callGenerateContent(e,n){return Dn(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(e,n){return Rn(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(e,n){return this._sendMessage(e,n)}async sendMessageStream(e,n){return this._sendMessageStream(e,n)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zr(t,e,n,o){n=Or(n);let s="";if(t.backend.backendType===F.GOOGLE_AI){const a=Rr(n,e);s=JSON.stringify(a)}else s=JSON.stringify(n);return(await it({model:e,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:o},s)).json()}async function Yr(t,e,n,o,s){if((o==null?void 0:o.mode)===I.ONLY_ON_DEVICE)throw new h(u.UNSUPPORTED,"countTokens() is not supported for on-device models.");return zr(t,e,n,s)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr extends ce{constructor(e,n,o,s){super(e,n.model),this.chromeAdapter=s,this.generationConfig=n.generationConfig||{},Xr(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=ct(n.systemInstruction),this.requestOptions=o||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===I.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===B.UNAVAILABLE){const o=new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===I.ONLY_ON_DEVICE)throw o;_.debug(o.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,n){const o=Pe(e);return Dn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...o},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(e,n){const o=Pe(e),{stream:s,response:r}=await Rn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...o},this.chromeAdapter,{...this.requestOptions,...n});return{stream:s,response:r}}startChat(e){return new Kr(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,n){const o=Pe(e);return Yr(this._apiSettings,this.model,o,this.chromeAdapter,{...this.requestOptions,...n})}}function Xr(t){var e,n;if(((e=t.thinkingConfig)==null?void 0:e.thinkingBudget)!=null&&((n=t.thinkingConfig)!=null&&n.thinkingLevel))throw new h(u.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new h(u.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json"&&t.responseMimeType!=="text/x.enum")throw new h(u.UNSUPPORTED,'responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.')}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e){if(!e.type&&!e.anyOf)throw new h(u.INVALID_SCHEMA,"A schema must have either a 'type' or an 'anyOf' array of sub-schemas.");for(const n in e)this[n]=e[n];this.type=e.type,this.format=e.hasOwnProperty("format")?e.format:void 0,this.nullable=e.hasOwnProperty("nullable")?!!e.nullable:!1}toJSON(){const e={type:this.type};for(const n in this)this.hasOwnProperty(n)&&this[n]!==void 0&&(n!=="required"||this.type===X.OBJECT)&&(e[n]=this[n]);return e}static array(e){return new ta(e,e.items)}static object(e){return new na(e,e.properties,e.optionalProperties)}static string(e){return new Gt(e)}static enumString(e){return new Gt(e,e.enum)}static integer(e){return new Qr(e)}static number(e){return new Zr(e)}static boolean(e){return new ea(e)}static anyOf(e){return new oa(e)}}class Qr extends O{constructor(e){super({type:X.INTEGER,...e})}}class Zr extends O{constructor(e){super({type:X.NUMBER,...e})}}class ea extends O{constructor(e){super({type:X.BOOLEAN,...e})}}class Gt extends O{constructor(e,n){super({type:X.STRING,...e}),this.enum=n}toJSON(){const e=super.toJSON();return this.enum&&(e.enum=this.enum),e}}class ta extends O{constructor(e,n){super({type:X.ARRAY,...e}),this.items=n}toJSON(){const e=super.toJSON();return e.items=this.items.toJSON(),e}}class na extends O{constructor(e,n,o=[]){super({type:X.OBJECT,...e}),this.properties=n,this.optionalProperties=o}toJSON(){const e=super.toJSON();e.properties={...this.properties};const n=[];if(this.optionalProperties){for(const o of this.optionalProperties)if(!this.properties.hasOwnProperty(o))throw new h(u.INVALID_SCHEMA,`Property "${o}" specified in "optionalProperties" does not exist.`)}for(const o in this.properties)this.properties.hasOwnProperty(o)&&(e.properties[o]=this.properties[o].toJSON(),this.optionalProperties.includes(o)||n.push(o));return n.length>0&&(e.required=n),delete e.optionalProperties,e}}class oa extends O{constructor(e){if(e.anyOf.length===0)throw new h(u.INVALID_SCHEMA,"The 'anyOf' array must not be empty.");super({...e,type:void 0}),this.anyOf=e.anyOf}toJSON(){const e=super.toJSON();return this.anyOf&&Array.isArray(this.anyOf)&&(e.anyOf=this.anyOf.map(n=>n.toJSON())),e}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sa(t=nn(),e){t=Qt(t);const n=tt(t,re),o=(e==null?void 0:e.backend)??new Se,s=pr(o),r=n.getImmediate({identifier:s}),a=r.options;if(a){const i=e==null?void 0:e.useLimitedUseAppCheckTokens,c=!!a.useLimitedUseAppCheckTokens;if(i!=null&&!!i!==c)throw new h(u.ALREADY_INITIALIZED,`getAI() has already been called for app "${t.name}" and this backend with useLimitedUseAppCheckTokens: ${c}. This option cannot be changed after the AI instance has been initialized. Pass the desired options to the first getAI() call for this app and backend, or omit useLimitedUseAppCheckTokens to reuse the existing instance.`);return r}return r.options={useLimitedUseAppCheckTokens:(e==null?void 0:e.useLimitedUseAppCheckTokens)??!1},r}const ra=["mode","onDeviceParams","inCloudParams"];function ft(t,e,n){var i;const o=e;let s;if(o.mode){for(const c of Object.keys(e))ra.includes(c)||_.warn(`When a hybrid inference mode is specified (mode is currently set to ${o.mode}), "${c}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);s=o.inCloudParams||{model:hr}}else s=e;if(!s.model)throw new h(u.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const r=(i=t.chromeAdapterFactory)==null?void 0:i.call(t,o.mode,typeof window>"u"?void 0:window,o.onDeviceParams),a=new Jr(t,s,n,r);return a._apiSettings.inferenceMode=o.mode,a}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aa(){se(new J(re,yr,"PUBLIC").setMultipleInstances(!0)),Y(xt,We),Y(xt,We,"esm2020")}aa();const we={apiKey:"AIzaSyD3wiyfoBE2QLSeZU0nkzRHDRcc93oRrV4",authDomain:"fluid-guard.firebaseapp.com",projectId:"fluid-guard",storageBucket:"fluid-guard.firebasestorage.app",messagingSenderId:"161610398780",appId:"1:161610398780:web:043260846d8040f7f71739"},ia=!0,ca="gemini-3.8-flash";function la(){return[we.apiKey,we.projectId,we.appId].every(e=>typeof e=="string"&&!e.includes("REPLACE_WITH"))}const da=[{code:"seed_phrase_request",label:"Asks for a seed phrase or private key",severity:3,pattern:/seed phrase|recovery phrase|private key|secret recovery|12[-\s]?word|24[-\s]?word|mnemonic/i,advice:"No legitimate wallet, exchange or support team will ever ask for your seed phrase or private key. Anyone who has it can take everything, and no one can undo that."},{code:"drainer_pattern",label:"Matches a known wallet-drainer pattern",severity:3,pattern:/verify your (wallet|account|seed)|claim your (airdrop|reward|refund)|wallet (has been|is) flagged|connect your wallet to (verify|claim)|double your (btc|eth|crypto)/i,advice:"“Verify”, “claim” and “flagged wallet” pages are the standard front end of a wallet drainer: the site gets you to sign or connect, then empties the wallet in one transaction."},{code:"unlimited_approval",label:"Unlimited token approval",severity:3,pattern:/unlimited|infinite approval|max(?:imum)?\s*(?:amount|approval)|115792089237316195423570985008687907853269984665640564039457584007913129639935/i,advice:"An unlimited approval lets the spender move your tokens at any time, without asking again — including months later, or after the site is sold or hacked. Approving a limited amount, or refusing, is far safer."},{code:"urgency_pressure",label:"Urgency and pressure tactics",severity:2,pattern:/urgent|act now|immediately|within \d+\s*(minutes|mins|hours)|will be frozen|will be (closed|suspended|deleted)|last chance|expires (in|soon)|do not (tell|share)/i,advice:"Real security processes do not rush you with countdowns. Pressure is there to stop you checking — treat any deadline in a message as a red flag in itself."},{code:"unverified_contract",label:"Unverified or unknown contract",severity:2,pattern:/unverified contract|unknown contract|not verified|new contract|unaudited/i,advice:"An unverified contract means nobody can read what the code actually does. Interacting with one is trusting a stranger's say-so with your funds."},{code:"unknown_spender",label:"Spender you cannot identify",severity:2,pattern:/spender|approve|allowance/i,advice:"Before approving, make sure you can name exactly who or what will be able to move your tokens, and why. If the spender is not a service you deliberately chose, do not approve.",needsApprovalContext:!0},{code:"unusual_amount",label:"Unusually large amount",severity:1,pattern:/\b\d{1,3}(?:,\d{3}){2,}\b|\b\d{7,}\b/,advice:"Very large amounts deserve a second look: check the digits, the destination and whether a smaller test transaction should go first."}];function ua(t){return/approv|allowance|spender|setApprovalForAll/i.test(t)}function fa(t,e){return!(e.length>0||!/transfer|send|sending/i.test(t)||/approval request|interact with|interaction with|sign this message/i.test(t))}function Ce(t){const e=da.filter(l=>l.needsApprovalContext&&!ua(t)?!1:l.pattern.test(t)),n=e.reduce((l,m)=>l+m.severity,0),o=e.some(l=>l.severity>=3);let s;o||n>=4?s="danger":e.length>0?s="caution":s="safe";const r=e.length?e.map(l=>l.code):["none"],a=e.map(l=>l.label);let i,c;return s==="danger"?(i="This looks dangerous. Do not sign, approve or act on it until you understand exactly what it does.",c=["Guard's checks found serious red flags here.",...e.map(l=>l.advice),"The safe move is to stop, close the page or message, and check through a route you trust — type the official address yourself rather than following any link in the message."].join(" ")):s==="caution"?(i="There are things here worth a careful second look before you go ahead.",c=["Nothing here is proof of a scam, but Guard's checks found points to verify.",...e.map(l=>l.advice),"If everything checks out — the site is the real one, the amounts are what you expect, and you chose this action yourself — it is reasonable to proceed carefully."].join(" ")):fa(t,e)?(i="This looks like an ordinary transfer.",c="This reads as a plain transfer of funds to an address, with no token approval, no contract interaction and none of the usual scam patterns — no seed-phrase request, no urgency pressure, no suspicious link. As always, confirm the destination address character by character before sending: transfers cannot be reversed."):(i="No known red flags were found in this text.",c="Guard's checks found none of the common scam patterns here — no seed-phrase request, no unlimited approval, no urgency pressure and no drainer-style wording. That is not a guarantee of safety: always confirm you are on the real site or app, and that the amounts and destination are exactly what you intend."),{riskLevel:s,reasonCodes:r,reasons:a,summary:i,explanation:c}}function ha(t){return t.replace(/https?:\/\/[^\s)]+/gi,"[link]").replace(/\bwww\.[^\s)]+/gi,"[link]").replace(/\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|xyz|site|online|info|app|dev|co|example|finance|exchange|pro|live|click|link|page|space|fun|club|vip|top|icu)\b(?:\/[^\s)]*)?/gi,"[link]").replace(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g,"[email]").replace(/0x[0-9a-fA-F]{6,}/g,"[address]").replace(/\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,"[address]").replace(/\bbc1[a-z0-9]{20,}\b/gi,"[address]").replace(/\b\d{1,3}(?:,\d{3}){2,}(?:\.\d+)?\b/g,"[large amount]").replace(/\b\d{7,}\b/g,"[large number]").replace(/\s+/g," ").trim()}function pa(t){const{riskLevel:e,reasons:n}=Ce(t);return["Redacted summary of a wallet item a user is about to act on.",`Initial on-device verdict: ${e.toUpperCase()}.`,n.length?`Red flags found: ${n.join("; ")}.`:"Red flags found: none.","Content with identifiers removed:",ha(t)].join(`
`)}const D=!la();class ht extends Error{constructor(){super("Deep analysis is unavailable in demo mode (Firebase not configured)."),this.name="DemoModeError",this.code="demo-mode"}}let be=null,Nn=!1;const Ln=15e3,ma=45e3;function pt(t,e,n){let o;const s=new Promise((r,a)=>{o=setTimeout(()=>{const i=new Error(n+" timed out after "+e+" ms.");i.name="TimeoutError",i.code="timeout",a(i)},e)});return Promise.race([t,s]).finally(()=>clearTimeout(o))}function mt(){if(be)return be;const t=tn(we);return self.FIREBASE_APPCHECK_DEBUG_TOKEN="806a95ec-021a-4995-9159-966afbad65db",sr(t,{provider:new at("fluid-guard-debug-token-flow"),isTokenAutoRefreshEnabled:!0}),be=sa(t,{backend:new Se}),be}const ga=O.object({properties:{riskLevel:O.enumString({enum:["safe","caution","danger"],description:"Overall risk of the transaction, approval or message."}),reasonCodes:O.array({items:O.enumString({enum:["unlimited_approval","unknown_spender","drainer_pattern","urgency_pressure","lookalike_address","unverified_contract","seed_phrase_request","unusual_amount","none"]}),description:"Machine-readable red flags found in the input."}),summary:O.string({description:"One or two plain-language sentences explaining the verdict for a non-technical wallet user."})},required:["riskLevel","reasonCodes","summary"]});function xn(){return ft(mt(),{mode:I.ONLY_ON_DEVICE,onDeviceParams:{promptOptions:{responseConstraint:ga}}})}function ba(){return ft(mt(),{mode:I.PREFER_ON_DEVICE})}function ya(){return ft(mt(),{mode:I.ONLY_IN_CLOUD,inCloudParams:{model:ca}})}async function Mn(t){await xn().initializeDeviceModel(n=>{t&&t(n)}),Nn=!0}async function wa(t){if(D)return{ok:!1,demoMode:!0};try{return await Mn(t),{ok:!0}}catch(e){return{ok:!1,error:e}}}async function Ea(){if(D)return"demo";try{if(typeof LanguageModel<"u"&&LanguageModel.availability)return await LanguageModel.availability()}catch{}return"unknown"}function Vt(t){const{riskLevel:e,reasonCodes:n,summary:o}=Ce(t);return{riskLevel:e,reasonCodes:n,summary:o}}async function ka(t){const e="ONLY_ON_DEVICE";if(D)return{verdict:Vt(t),inferenceSource:"LOCAL_FALLBACK",requestedMode:e,degraded:!0,demoMode:!0};try{Nn||await Mn();const n=xn(),o=["You are a security checker inside a crypto wallet.","Classify the following transaction, approval request or message.","Respond only with the structured verdict.","",t].join(`
`),s=await pt(n.generateContent(o),Ln,"On-device classification");return{verdict:JSON.parse(s.response.text()),inferenceSource:s.response.inferenceSource,requestedMode:e,degraded:!1,demoMode:!1}}catch(n){return console.warn("On-device classification unavailable, using local checks:",n),{verdict:Vt(t),inferenceSource:"LOCAL_FALLBACK",requestedMode:e,degraded:!0,demoMode:!1}}}async function _a(t,e){const n="PREFER_ON_DEVICE";if(D)return{text:Ce(t).explanation,inferenceSource:"LOCAL_FALLBACK",requestedMode:n,degraded:!0,demoMode:!0};try{const o=ba(),s=["Explain, in plain language a beginner can understand, what this wallet","transaction or message is and why it was rated "+e.riskLevel+".","Keep it under 120 words. Do not repeat the raw input verbatim.","",t].join(`
`),r=await pt(o.generateContent(s),Ln,"Explanation");return{text:r.response.text(),inferenceSource:r.response.inferenceSource,requestedMode:n,degraded:!1,demoMode:!1}}catch(o){return console.warn("Model explanation unavailable, using local checks:",o),{text:Ce(t).explanation,inferenceSource:"LOCAL_FALLBACK",requestedMode:n,degraded:!0,demoMode:!1}}}async function Pn(t){const e="ONLY_IN_CLOUD";if(D)throw new ht;const n=ya(),o=["You are a smart-contract security analyst. Analyse this redacted summary","of a wallet transaction or approval. Explain what it actually does, the","worst case if signed, and the exact steps the user should take next.","",t].join(`
`),s=await pt(n.generateContent(o),ma,"Deep analysis");return{text:s.response.text(),inferenceSource:s.response.inferenceSource,requestedMode:e,degraded:!1,demoMode:!1}}const Ca=[{id:"approval",label:"Malicious approval",kind:"Token approval request",text:["Token approval request","From: swap-rewards.example.com — unverified contract","Action: approve — give spender 0x7f3a9c4b2d8e1f0a5c6b9d3e7f2a4c8b1d5e9f03 permission to spend your USDT.","Amount: UNLIMITED (115792089237316195423570985008687907853269984665640564039457584007913129639935)","Your tokens stay in your wallet, but the spender can move them at any time without asking again."].join(`
`)},{id:"message",label:"Drainer message",kind:"Suspicious message",text:["URGENT — Fluid Security Team: your wallet has been flagged for suspicious activity.","Verify your seed phrase within 10 minutes at fluid-verify.example.com or your funds will be frozen permanently.","Act now. Do not share this message with anyone."].join(`
`)},{id:"plain",label:"Ordinary transfer",kind:"Plain transfer",text:["Send 0.05 ETH to 0x0EBf5563F905E3B9D58718E28E08143511DC763b (saved contact) on Ethereum mainnet.","Network fee: about 0.0004 ETH.","This is a plain transfer — no token approval and no contract interaction."].join(`
`)}],ye={"0x000000000022d473030f116ddee9f6b43ac78ba3":"Uniswap Permit2","0x111111125421ca6dc452d289314280a0f8842a65":"1inch Aggregation Router V6","0x1111111254fb6c44bac0bed2854e76f90643097d":"1inch Aggregation Router V5"},va={ethereum:{...ye,"0xe592427a0aece92de3edee1f18e0157c05861564":"Uniswap V3 SwapRouter","0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45":"Uniswap SwapRouter02","0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad":"Uniswap Universal Router","0x66a9893cc07d91d95644aedd05d03f95e1dba8af":"Uniswap Universal Router","0x23617e59a5925b2a4bf75d73ff6711cd0b29de85":"Uniswap Universal Router 2.1.2","0x7a250d5630b4cf539739df2c5dacb4c659f2488d":"Uniswap V2 Router02"},base:{...ye,"0x2626664c2603336e57b271c5c0b26f421741e481":"Uniswap SwapRouter02","0x6ff5693b99212da76ad316178a184ab56d299b43":"Uniswap Universal Router","0x198ef79f1f515f02dfe9e3115ed9fc07183f02fc":"Uniswap Universal Router","0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43":"Aerodrome Router"},arbitrum:{...ye,"0xe592427a0aece92de3edee1f18e0157c05861564":"Uniswap V3 SwapRouter","0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45":"Uniswap SwapRouter02","0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad":"Uniswap Universal Router","0xa51afafe0263b40edaef0df8781ea9aa03e381a3":"Uniswap Universal Router v2","0x2d01411773c8c24805306e89a41f7855c3c4fe65":"Uniswap Universal Router 2.1.2"},bsc:{...ye,"0x10ed43c718714eb63d5aa57b78b54704e256024e":"PancakeSwap V2 Router","0x13f4ea83d0bd40e75c8222255bc855a974568dd4":"PancakeSwap V3 Smart Router","0x1b81d678ffb9c0263b24a97847620c99d213eb14":"PancakeSwap V3 SwapRouter","0xb971ef87ede563556b2ed4b1c0b0019111dd85d2":"Uniswap SwapRouter02","0x5302086a3a25d473aabbd0356eff8dd811a4d89b":"Uniswap Universal Router"}};function Sa(t,e){const n=va[t];return!n||typeof e!="string"?null:n[e.toLowerCase()]||null}const Ta={ethereum:{"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48":{symbol:"USDC",name:"USD Coin"},"0xdac17f958d2ee523a2206206994597c13d831ec7":{symbol:"USDT",name:"Tether USD"},"0x6b175474e89094c44da98b954eedeac495271d0f":{symbol:"DAI",name:"Dai Stablecoin"},"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2":{symbol:"WETH",name:"Wrapped Ether"},"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599":{symbol:"WBTC",name:"Wrapped BTC"}},base:{"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913":{symbol:"USDC",name:"USD Coin"},"0x4200000000000000000000000000000000000006":{symbol:"WETH",name:"Wrapped Ether"},"0x50c5725949a6f0c72e6c4a641f24049a917db0cb":{symbol:"DAI",name:"Dai Stablecoin"},"0x940181a94a35a4569e4529a3cdfb74e38fd98631":{symbol:"AERO",name:"Aerodrome"}},arbitrum:{"0xaf88d065e77c8cc2239327c5edb3a432268e5831":{symbol:"USDC",name:"USD Coin"},"0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9":{symbol:"USD₮0",name:"Tether USD"},"0x82af49447d8a07e3bd95bd0d56f35241523fbab1":{symbol:"WETH",name:"Wrapped Ether"},"0xda10009cbd5d07dd0cecc66161fc93d7c9000da1":{symbol:"DAI",name:"Dai Stablecoin"},"0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f":{symbol:"WBTC",name:"Wrapped BTC"},"0x912ce59144191c1204e64559fe8253a0e49e6548":{symbol:"ARB",name:"Arbitrum"}},bsc:{"0x55d398326f99059ff775485246999027b3197955":{symbol:"USDT",name:"Tether USD"},"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d":{symbol:"USDC",name:"USD Coin"},"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c":{symbol:"WBNB",name:"Wrapped BNB"},"0xe9e7cea3dedca5984780bafc599bd69add087d56":{symbol:"BUSD",name:"Binance USD"},"0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82":{symbol:"Cake",name:"PancakeSwap Token"},"0x2170ed0880ac9a755fd29b2688956bd959f933f8":{symbol:"ETH",name:"Ethereum Token"}}};function Aa(t,e){const n=Ta[t];return!n||typeof e!="string"?null:n[e.toLowerCase()]||null}const Ia="0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",Oa=1n<<255n,Ra="0xdd62ed3e",Da="0x95d89b41",Na="0x06fdde03",La="0x313ce567",xa={ethereum:{id:"ethereum",name:"Ethereum",chainId:1,blockSeconds:12,lookbackBlocks:2628e3,lookbackLabel:"about 12 months",explorer:"https://etherscan.io",endpoints:[{url:"https://eth.blockscout.com/api/eth-rpc",chunk:1e6},{url:"https://eth.api.onfinality.io/public",chunk:1e5},{url:"https://rpc.mevblocker.io",chunk:9999},{url:"https://eth.llamarpc.com",chunk:1e5}]},base:{id:"base",name:"Base",chainId:8453,blockSeconds:2,lookbackBlocks:15768e3,lookbackLabel:"about 12 months",explorer:"https://basescan.org",endpoints:[{url:"https://mainnet.base.org",chunk:1e4},{url:"https://base.llamarpc.com",chunk:1e5},{url:"https://base-rpc.publicnode.com",chunk:5e4}]},arbitrum:{id:"arbitrum",name:"Arbitrum One",chainId:42161,blockSeconds:.25,lookbackBlocks:10368e3,lookbackLabel:"about 30 days",explorer:"https://arbiscan.io",endpoints:[{url:"https://arb1.arbitrum.io/rpc",chunk:25e3},{url:"https://arbitrum.llamarpc.com",chunk:1e5}]},bsc:{id:"bsc",name:"BNB Smart Chain",chainId:56,blockSeconds:3,lookbackBlocks:2592e3,lookbackLabel:"about 90 days",explorer:"https://bscscan.com",endpoints:[{url:"https://bsc-dataseed.binance.org",chunk:5e3},{url:"https://bsc-dataseed1.binance.org",chunk:5e3},{url:"https://bsc-dataseed2.binance.org",chunk:5e3},{url:"https://bsc-dataseed3.binance.org",chunk:5e3}]}};function Ma(t){return typeof t=="string"&&/^0x[0-9a-fA-F]{40}$/.test(t.trim())}const Ke=t=>"0x"+t.toString(16),ze=t=>"0".repeat(24)+t.toLowerCase().replace(/^0x/,"");function Pa(t){const e=String(t||"").toLowerCase();return/429|too many requests|rate limit|ratelimit|throttl|quota|request limit reached|over your current rate/.test(e)?"rate":/range|too large|too many results|exceed|limited to|response size|query spans|more than \d+/.test(e)?"range":"other"}function $a(t,e){return{chain:t,fetchImpl:e,nextId:1,rotate:0,state:t.endpoints.map(()=>({cooldownUntil:0}))}}async function $n(t,e,n,o){const s=new AbortController,r=setTimeout(()=>s.abort(),2e4);try{const a=await t.fetchImpl(e.url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:t.nextId++,method:n,params:o}),signal:s.signal});if(!a.ok){const c=new Error("HTTP "+a.status);throw c.kind=a.status===429?"rate":a.status===413?"range":"other",c}const i=await a.json();if(i.error){const c=new Error(i.error.message||JSON.stringify(i.error));throw c.kind=Pa(c.message),c}return i.result}catch(a){if(a&&a.kind)throw a;const i=new Error(String(a&&a.message||a));throw i.kind=a&&a.name==="AbortError"?"rate":"other",i}finally{clearTimeout(r)}}async function oe(t,e,n){const o=t.chain.endpoints.length;let s=null;for(let r=0;r<2;r++){r>0&&await gt(2e3);for(let a=0;a<o;a++){const i=(t.rotate+a)%o;if(!(r===0&&t.state[i].cooldownUntil>Date.now()))try{const c=await $n(t,t.chain.endpoints[i],e,n);return t.rotate=i,c}catch(c){s=c,t.state[i].cooldownUntil=Date.now()+(c.kind==="rate"?6e3:1500)}}}throw s||new Error("No RPC endpoint available")}const gt=t=>new Promise(e=>setTimeout(e,t));async function Ba(t,e,n,o,s){const r=t.chain,a="0x"+ze(e),i=Math.max(...r.endpoints.map(g=>g.chunk)),c=o-n+1,l=[],m=[];let f=0;const y=[];for(let g=n;g<=o;g+=i)y.push({from:g,to:Math.min(g+i-1,o),attempts:0});let b=0,w=0;const x=()=>s&&s({scanned:f,total:c,gaps:m.length}),Q=r.endpoints.map((g,p)=>p).sort((g,p)=>r.endpoints[p].chunk-r.endpoints[g].chunk),Z=r.endpoints.map(()=>0),q=g=>Z[g]<3||Z.every(p=>p>=3);async function fe(g){if(w===0&&b>=24)throw new Error("No public node would serve this chain's approval history right now");const p=g.to-g.from+1;let v=null,N=-1;for(const k of Q)if(q(k)&&t.state[k].cooldownUntil<=Date.now()){v=r.endpoints[k],N=k;break}if(!v){if(g.attempts>=4){m.push([g.from,g.to]),f+=p,x();return}g.attempts++,y.push(g),await gt(1200);return}if(p>v.chunk){for(let k=g.from;k<=g.to;k+=v.chunk)y.push({from:k,to:Math.min(k+v.chunk-1,g.to),attempts:g.attempts});return}b++;try{const k=await $n(t,v,"eth_getLogs",[{fromBlock:Ke(g.from),toBlock:Ke(g.to),topics:[Ia,a]}]);w++;for(const $ of k)l.push($);f+=p,x()}catch(k){if(k.kind!=="range"&&Z[N]++,k.kind==="range"&&p>2e3){const $=g.from+Math.floor(p/2);y.push({from:g.from,to:$-1,attempts:g.attempts}),y.push({from:$,to:g.to,attempts:g.attempts});return}if(t.state[N].cooldownUntil=Date.now()+(k.kind==="rate"?6e3:2e4),g.attempts++,g.attempts>4||k.kind==="range"&&p<=2e3){m.push([g.from,g.to]),f+=p,x();return}y.push(g)}}const ee=[],Te=2;for(let g=0;g<Te;g++)ee.push((async()=>{for(;y.length;){const p=y.shift();await fe(p)}})());return await Promise.all(ee),m.sort((g,p)=>g[0]-p[0]),{logs:l,gaps:m}}function Ua(t){const e=new Map;for(const n of t){if(!n||!Array.isArray(n.topics)||n.topics.length<3)continue;const o=String(n.address||"").toLowerCase(),s="0x"+String(n.topics[2]).slice(26).toLowerCase();if(!/^0x[0-9a-f]{40}$/.test(o)||!/^0x[0-9a-f]{40}$/.test(s))continue;const r=o+"|"+s,a=parseInt(n.blockNumber||"0x0",16),i=e.get(r);i?(i.events++,i.lastBlock=Math.max(i.lastBlock,a)):e.set(r,{token:o,spender:s,events:1,lastBlock:a})}return[...e.values()]}async function jt(t,e,n){const o=new Array(t.length);let s=0;async function r(){for(;s<t.length;){const a=s++;o[a]=await n(t[a],a)}}return await Promise.all(Array.from({length:Math.min(e,t.length)},r)),o}async function Fa(t,e,n){try{const o=await oe(t,"eth_call",[{to:e,data:n},"latest"]);return typeof o!="string"||o==="0x"?null:BigInt(o)}catch{return null}}function qt(t){if(typeof t!="string"||t==="0x"||t.length<66)return null;const e=t.slice(2);try{const n=Number(BigInt("0x"+e.slice(0,64)));if(n*2+64<=e.length){const o=Number(BigInt("0x"+e.slice(n*2,n*2+64))),s=e.slice(n*2+64,n*2+64+o*2);if(s.length===o*2&&o>0&&o<200){const r=new Uint8Array(s.match(/.{2}/g).map(i=>parseInt(i,16))),a=new TextDecoder().decode(r).trim();if(a)return a}}}catch{}try{const n=new Uint8Array(e.slice(0,64).match(/.{2}/g).map(s=>parseInt(s,16)));return new TextDecoder().decode(n).replace(/\0/g,"").trim()||null}catch{return null}}async function Ha(t,e){const[n,o,s]=await Promise.all([oe(t,"eth_call",[{to:e,data:Da},"latest"]).catch(()=>null),oe(t,"eth_call",[{to:e,data:Na},"latest"]).catch(()=>null),oe(t,"eth_call",[{to:e,data:La},"latest"]).catch(()=>null)]);let r=null;if(typeof s=="string"&&s!=="0x"){const a=Number(BigInt(s));Number.isFinite(a)&&a>=0&&a<=36&&(r=a)}return{symbol:qt(n),name:qt(o),decimals:r}}async function Wt(t,e){try{const n=await oe(t,"eth_getBlockByNumber",[Ke(e),!1]);if(n&&n.timestamp)return parseInt(n.timestamp,16)*1e3}catch{}return null}function Bn(t){return t>=Oa}function Ga({allowance:t,decimals:e=null,spenderKnown:n}){const o=[],s=[],r=Bn(t);r&&(o.push("unlimited_approval"),s.push("Unlimited allowance — this spender can move any amount of the token, at any time, without asking you again.")),n||(o.push("unknown_spender"),s.push("Guard does not recognise this spender — it is not one of the well-known protocol contracts on its list. Unknown is not proof of wrongdoing, but you should be able to say exactly who this is and why they can move your tokens."));let a=!1;if(!r&&e!==null&&e!==void 0){const c=1000000n*10n**BigInt(e);t>=c&&(a=!0,o.push("unusual_amount"),s.push("The allowance is very large — at least 1,000,000 tokens — far more than a single ordinary swap needs."))}let i="safe";return!n&&r?i="danger":(!n||r||a)&&(i="caution"),{level:i,reasonCodes:o,reasons:s,unlimited:r}}function Un(t,e){if(Bn(t))return"Unlimited";if(e==null)return t.toString()+" (smallest units — token decimals unknown)";const n=10n**BigInt(e),o=t/n,s=t%n,r=o.toLocaleString("en-GB");if(s===0n)return r;const a=s.toString().padStart(e,"0").replace(/0+$/,"").slice(0,4);return a?`${r}.${a}`:r}async function Va(t,e,n={}){const o=n.fetchImpl||((p,v)=>fetch(p,v)),s=n.onProgress||null,r=e.trim().toLowerCase(),a=$a(t,o),i=Number(BigInt(await oe(a,"eth_blockNumber",[]))),c=i,l=Math.max(0,i-t.lookbackBlocks),{logs:m,gaps:f}=await Ba(a,r,l,c,s?p=>s({phase:"logs",...p,total:p.total}):null),y=Ua(m),b=await jt(y,4,async p=>{const v=Ra+ze(r)+ze(p.spender);let N=null;for(let k=0;k<3&&N===null;k++)k>0&&await gt(800),N=await Fa(a,p.token,v);return{...p,allowance:N}});s&&s({phase:"allowances",done:b.length,total:b.length});const w=b.filter(p=>p.allowance===null||p.allowance>0n),x=b.length-w.length,Q=[...new Set(w.map(p=>p.token))],Z=new Map;await jt(Q,4,async p=>{Z.set(p,await Ha(a,p))});const q=w.map(p=>{const v=Z.get(p.token)||{symbol:null,name:null,decimals:null},N=Sa(t.id,p.spender),k=Aa(t.id,p.token);if(p.allowance===null)return{...p,tokenMeta:v,tokenKnown:!!k,spenderName:N,level:"caution",reasonCodes:["unverified_contract"],reasons:["Guard could not read the current allowance for this pair on-chain — the token may not be a standard ERC-20. Treat it as unconfirmed rather than safe."],unlimited:!1,verified:!1};const $=Ga({allowance:p.allowance,decimals:v.decimals,spenderKnown:!!N});return{...p,tokenMeta:v,tokenKnown:!!k,spenderName:N,level:$.level,reasonCodes:$.reasonCodes,reasons:$.reasons,unlimited:$.unlimited,verified:!0}}),fe={danger:3,caution:2,safe:1};q.sort((p,v)=>fe[v.level]-fe[p.level]||Number(v.unlimited)-Number(p.unlimited)||p.token.localeCompare(v.token));let ee="safe";q.some(p=>p.level==="danger")?ee="danger":q.some(p=>p.level==="caution")&&(ee="caution");const[Te,g]=await Promise.all([Wt(a,l),Wt(a,c)]);return{owner:r,chain:t,overall:ee,approvals:q,coverage:{fromBlock:l,toBlock:c,fromTime:Te,toTime:g,eventsFound:m.length,pairsChecked:b.length,activeCount:q.length,inactiveCount:x,gaps:f,complete:f.length===0}}}function Fn(t){return t.slice(0,6)+"…"+t.slice(-4)}function ja(t){const{chain:e,owner:n,overall:o,approvals:s,coverage:r}=t,a=c=>c?new Date(c).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"unknown date",i=["Wallet approval scan summary — public on-chain data only.",`Chain: ${e.name}. Wallet: ${n}.`,`Coverage: blocks ${r.fromBlock} to ${r.toBlock} (${a(r.fromTime)} – ${a(r.toTime)}). ${r.eventsFound} approval events found; ${r.pairsChecked} token/spender pairs checked; ${r.activeCount} approvals still active; ${r.inactiveCount} now zero (revoked or used up).`,r.complete?"Coverage gaps: none — every block in the range was scanned.":`Coverage gaps: ${r.gaps.map(([c,l])=>`blocks ${c}–${l}`).join(", ")} could not be scanned (public endpoints refused them), so approvals granted in those ranges may be missing.`,`Overall verdict: ${o.toUpperCase()}.`,"","Active approvals:"];s.length||i.push("- None found in the scanned range.");for(const c of s){const l=c.tokenMeta.symbol?`${c.tokenMeta.symbol} (${c.token})`:`unknown token ${c.token}`,m=c.spenderName?`${c.spenderName} (${c.spender})`:`unknown spender ${c.spender}`;i.push(`- ${l} -> ${m}: allowance ${c.verified?Un(c.allowance,c.tokenMeta.decimals):"could not be read"} — verdict ${c.level.toUpperCase()} (${c.reasonCodes.join(", ")||"no flags"}).`)}return i.push("","Explain what the dangerous approvals would let someone do, the worst case for this wallet, and the exact steps to revoke or reduce the risky ones."),i.join(`
`)}const qa={unlimited_approval:"Unlimited token approval",unknown_spender:"Spender you cannot identify",drainer_pattern:"Matches a known wallet-drainer pattern",urgency_pressure:"Urgency and pressure tactics",lookalike_address:"Address that imitates a known one",unverified_contract:"Unverified or unknown contract",seed_phrase_request:"Asks for a seed phrase or private key",unusual_amount:"Unusually large amount",none:"No red flags found"},d=t=>document.getElementById(t),T={currentText:"",currentVerdict:null,redactedSummary:"",warmedUp:!1,routeLog:[],counts:{ON_DEVICE:0,IN_CLOUD:0,LOCAL_FALLBACK:0,NOT_SENT:0}};Ca.forEach(t=>{const e=document.createElement("button");e.type="button",e.textContent=t.label,e.addEventListener("click",()=>{d("input").value=t.text,yt()}),d("fixtures").appendChild(e)});const Wa={ON_DEVICE:"On-device",IN_CLOUD:"In cloud",LOCAL_FALLBACK:"Local fallback",NOT_SENT:"Not sent"};function R({task:t,requestedMode:e,source:n,ms:o,note:s}){const r={task:t,requestedMode:e,source:n,ms:o,note:s||"",time:new Date().toLocaleTimeString("en-GB")};T.routeLog.unshift(r),T.counts[n]=(T.counts[n]||0)+1,Hn()}function Hn(){const{ON_DEVICE:t,IN_CLOUD:e,LOCAL_FALLBACK:n,NOT_SENT:o}=T.counts,s=[];t&&s.push(`${t} on-device`),e&&s.push(`${e} in cloud`),n&&s.push(`${n} local fallback`),o&&s.push(`${o} not sent`),d("route-summary").textContent=s.length?`So far this session: ${s.join(" · ")}.`:"No checks yet. Every AI call Guard makes will be listed here with the mode it requested and the route that actually answered.",d("route-log").innerHTML=T.routeLog.map(r=>`<li class="route-entry ${r.source.toLowerCase().replace("_","-")}"><span class="route-task">${r.task}</span><span class="route-meta">${r.time} · requested ${r.requestedMode} · <strong>${Wa[r.source]||r.source}</strong>`+(typeof r.ms=="number"?` · ${Math.round(r.ms)} ms`:"")+"</span>"+(r.note?`<span class="route-note-line">${r.note}</span>`:"")+"</li>").join("")}function bt(){const t=navigator.onLine,e=d("pill-conn");e.textContent=t?"Connection: online":"Connection: offline — on-device checks still work",e.classList.toggle("pill-warn",!t)}async function Gn(){const t=d("pill-mode");t.textContent=D?"Mode: demo — Firebase not configured":"Mode: live — Firebase AI Logic",t.classList.toggle("pill-warn",D),d("demo-banner").hidden=!D;const e=d("pill-nano"),n=await Ea(),o={demo:"On-device model: not configured (demo mode)",available:"On-device model: Gemini Nano available",downloadable:"On-device model: Gemini Nano will download on first use",downloading:"On-device model: Gemini Nano downloading…",unavailable:"On-device model: not available in this browser",unknown:"On-device model: availability not confirmed"};e.textContent=o[n]||o.unknown}window.addEventListener("online",bt);window.addEventListener("offline",bt);function Ka(t){return t==="ON_DEVICE"?{text:"Answered on your device — nothing was sent anywhere",cls:"badge on-device"}:t==="IN_CLOUD"?{text:"Answered in the cloud",cls:"badge in-cloud"}:{text:D?"Answered by built-in local checks (demo mode)":"Answered by built-in local checks (no model available)",cls:"badge fallback"}}function za(t,e){const n=[];return t.demoMode?n.push("Demo mode: no Firebase project is configured, so classification ran on Guard's built-in local checks. No AI model was called and nothing left this device."):t.inferenceSource==="ON_DEVICE"?n.push("Classification ran on your device with Gemini Nano — your raw input never left it."):n.push("The on-device model is not available in this browser, so Guard's built-in local checks ran instead. Your input was not sent anywhere."),e.inferenceSource==="IN_CLOUD"?n.push("The explanation below was answered in the cloud."):e.inferenceSource==="ON_DEVICE"&&n.push("The explanation below was also answered on your device."),n.join(" ")}async function yt(){const t=d("input").value.trim();if(!t){d("status").textContent="Paste something to check first, or tap an example.";return}T.currentText=t,T.currentVerdict=null,d("check").disabled=!0,d("result").hidden=!0,Ya();try{!D&&!T.warmedUp&&(T.warmedUp=!0,d("status").textContent="Preparing the on-device model…",await wa(c=>{typeof c=="number"&&c<1&&(d("status").textContent="Downloading the on-device model… "+Math.round(c*100)+"%")}),Gn()),d("status").textContent="Checking on your device…";const e=performance.now(),n=await ka(t);R({task:"Risk classification",requestedMode:n.requestedMode,source:n.inferenceSource,ms:performance.now()-e,note:n.demoMode?"Demo mode — built-in local checks answered.":n.degraded?"On-device model unavailable — local checks answered.":""});const o=n.verdict;T.currentVerdict=o;const s=performance.now(),r=await _a(t,o);R({task:"Explanation",requestedMode:r.requestedMode,source:r.inferenceSource,ms:performance.now()-s,note:r.degraded&&!r.demoMode?"Model route unavailable — local checks answered.":""}),d("verdict").textContent=o.riskLevel.toUpperCase(),d("verdict").className="verdict "+o.riskLevel;const a=Ka(r.inferenceSource);d("route-badge").textContent=a.text,d("route-badge").className=a.cls,d("route-note").textContent=za(n,r),d("explanation").textContent=r.text||o.summary;const i=o.reasonCodes&&o.reasonCodes.length?o.reasonCodes:["none"];d("reasons").innerHTML=i.map(c=>`<li>${qa[c]||c.replaceAll("_"," ")}</li>`).join(""),d("deep").hidden=o.riskLevel==="safe",d("result").hidden=!1,d("status").textContent="",d("result").scrollIntoView({behavior:"smooth",block:"nearest"})}catch(e){console.error("Check failed:",e),d("status").textContent="The check could not run in this browser. Nothing was sent anywhere — please try again."}finally{d("check").disabled=!1}}d("check").addEventListener("click",yt);d("input").addEventListener("keydown",t=>{(t.ctrlKey||t.metaKey)&&t.key==="Enter"&&yt()});function Ya(){T.redactedSummary="",d("consent").hidden=!0,d("deep-result-wrap").hidden=!0,d("deep-status").textContent="",d("deep-prepare").hidden=!1}d("deep-prepare").addEventListener("click",()=>{T.currentText&&(T.redactedSummary=pa(T.currentText),d("redacted").textContent=T.redactedSummary,d("consent").hidden=!1,d("deep-status").textContent=D?"Demo mode: you can review and approve the summary, but with no Firebase project configured there is no cloud to send it to — approving will show exactly where the flow stops, and nothing will be sent.":"")});d("deep-cancel").addEventListener("click",()=>{d("consent").hidden=!0,d("deep-status").textContent="Cancelled — nothing was sent."});d("deep-approve").addEventListener("click",async()=>{const t=T.redactedSummary;if(!t)return;d("deep-approve").disabled=!0,d("deep-status").textContent="Running deep analysis in the cloud…";const e=performance.now();try{if(!navigator.onLine){R({task:"Deep analysis",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"You are offline — deep analysis needs a connection. Nothing was sent."}),d("deep-status").textContent="You are offline, so deep analysis cannot run. Nothing was sent — try again when you are back online.";return}const n=await Pn(t);R({task:"Deep analysis",requestedMode:n.requestedMode,source:n.inferenceSource,ms:performance.now()-e}),d("deep-badge").textContent="Answered in the cloud",d("deep-badge").className="badge in-cloud",d("deep-result").textContent=n.text,d("deep-result-wrap").hidden=!1,d("consent").hidden=!0,d("deep-status").textContent=""}catch(n){n instanceof ht||n&&n.code==="demo-mode"?(R({task:"Deep analysis",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"Demo mode — Firebase is not configured, so the approved summary was not sent."}),d("deep-status").textContent="Demo mode: the summary above is exactly what would be sent, but no Firebase project is configured, so nothing was sent anywhere. Configure Firebase (see the README) to run the real cloud analysis."):(console.error("Deep analysis failed:",n),R({task:"Deep analysis",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"The cloud call failed — nothing was analysed."}),d("deep-status").textContent="Deep analysis could not run just now. Nothing was analysed in the cloud — you can try again.")}finally{d("deep-approve").disabled=!1}});const V={result:null,summary:""};function te(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function Kt(t){return t?new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):null}function Ja(){V.summary="",d("scan-consent").hidden=!0,d("scan-deep-wrap").hidden=!0,d("scan-deep-status").textContent="",d("scan-deep-prepare").hidden=!1}function Xa(t){const{chain:e,overall:n,approvals:o,coverage:s}=t,r=o.filter(l=>l.level==="danger").length,a=o.filter(l=>l.level==="caution").length;d("scan-verdict").textContent=n.toUpperCase(),d("scan-verdict").className="verdict "+n,n==="danger"?d("scan-headline").textContent=`This wallet is in danger: ${r} approval${r===1?"":"s"} give an unrecognised spender unlimited access to a token. Whoever controls that spender can take the full balance at any time.`:n==="caution"?d("scan-headline").textContent=`No dangerous approvals found, but ${a} approval${a===1?"":"s"} below deserve a second look before you trust this wallet with more funds.`:o.length?d("scan-headline").textContent="No dangerous or unusual approvals found — every active approval in the scanned range is a finite amount to a protocol Guard recognises.":d("scan-headline").textContent="No active approvals were found in the scanned range. Read the coverage note — that is not the same as a guarantee.";const i=Kt(s.fromTime),c=Kt(s.toTime);d("scan-coverage").textContent=`Scanned ${e.name}, blocks ${s.fromBlock.toLocaleString("en-GB")} to ${s.toBlock.toLocaleString("en-GB")}`+(i&&c?` (${i} – ${c}; ${e.lookbackLabel})`:` (${e.lookbackLabel})`)+`. Found ${s.eventsFound} approval event${s.eventsFound===1?"":"s"} and checked ${s.pairsChecked} token/spender pair${s.pairsChecked===1?"":"s"}: ${s.activeCount} still active, ${s.inactiveCount} now zero (revoked or used up). Not covered: approvals granted before block ${s.fromBlock.toLocaleString("en-GB")}, approvals on other chains, and NFT collection approvals (setApprovalForAll). Check each chain separately.`,s.complete?d("scan-gaps").hidden=!0:(d("scan-gaps").hidden=!1,d("scan-gaps").textContent="Warning — this scan is incomplete: block ranges "+s.gaps.map(([l,m])=>`${l.toLocaleString("en-GB")}–${m.toLocaleString("en-GB")}`).join(", ")+" could not be read from any public node after retries. Approvals granted in those ranges may be missing from this result."),d("scan-rows").innerHTML=o.map(l=>{const m=l.tokenMeta.symbol,f=m?te(m)+(l.tokenMeta.name?` · ${te(l.tokenMeta.name)}`:""):"Unknown token",y=l.spenderName?te(l.spenderName):"Unknown spender — not a protocol Guard recognises",b=l.verified?te(Un(l.allowance,l.tokenMeta.decimals))+(m?" "+te(m):""):"Could not be read on-chain",w=l.reasons.map(x=>`<li>${te(x)}</li>`).join("");return`<article class="approval level-${l.level}"><div class="approval-head"><span class="verdict-chip ${l.level}">${l.level.toUpperCase()}</span><strong class="approval-token">${f}</strong>`+(l.tokenKnown?'<span class="badge">Major asset</span>':"")+`</div><p class="approval-line">Token: <a class="mono" href="${e.explorer}/address/${l.token}" target="_blank" rel="noopener">${l.token}</a></p><p class="approval-line">Spender: <strong>${y}</strong> <a class="mono" href="${e.explorer}/address/${l.spender}" target="_blank" rel="noopener">${Fn(l.spender)}</a></p><p class="approval-line">They can move: <strong>${b}</strong></p>`+(w?`<ul class="approval-reasons">${w}</ul>`:"")+"</article>"}).join(""),d("scan-deep").hidden=o.length===0,d("scan-result").hidden=!1}async function Vn(){const t=d("scan-address").value.trim(),e=xa[d("scan-chain").value];if(!Ma(t)){d("scan-status").textContent="That does not look like a wallet address — it should start with 0x and be 42 characters long. Nothing was scanned.";return}d("scan-run").disabled=!0,d("scan-result").hidden=!0,Ja(),V.result=null;const n=d("scan-progress");n.hidden=!1,n.value=0,d("scan-status").textContent=`Scanning ${e.name}… reading approval history for ${Fn(t)}.`;const o=performance.now();try{const s=await Va(e,t,{onProgress:r=>{if(r.phase==="logs"){const a=r.total?Math.floor(r.scanned/r.total*100):0;n.value=a,d("scan-status").textContent=`Scanning ${e.name}… ${a}% of blocks read`+(r.gaps?` · ${r.gaps} range(s) refused so far`:"")+"."}else r.phase==="allowances"&&(n.value=100,d("scan-status").textContent="History read — checking which approvals are still active…")}});V.result=s,R({task:"Wallet approval scan",requestedMode:"LOCAL (public chain reads)",source:"LOCAL_FALLBACK",ms:performance.now()-o,note:`${e.name}: ${s.coverage.activeCount} active approval(s) from ${s.coverage.pairsChecked} pair(s) checked. `+(s.coverage.complete?"Full range scanned.":"PARTIAL — some ranges could not be read; the gaps are listed in the result.")}),Xa(s),d("scan-status").textContent="",d("scan-result").scrollIntoView({behavior:"smooth",block:"nearest"})}catch(s){console.error("Wallet scan failed:",s),R({task:"Wallet approval scan",requestedMode:"LOCAL (public chain reads)",source:"NOT_SENT",note:"The public chain nodes could not be reached — the scan did not run."}),d("scan-status").textContent="The scan could not read the chain — the public nodes are unreachable or throttling right now. Nothing was sent anywhere; try again in a moment."}finally{d("scan-run").disabled=!1,n.hidden=!0}}d("scan-run").addEventListener("click",Vn);d("scan-address").addEventListener("keydown",t=>{t.key==="Enter"&&Vn()});d("scan-deep-prepare").addEventListener("click",()=>{V.result&&(V.summary=ja(V.result),d("scan-summary").textContent=V.summary,d("scan-consent").hidden=!1,d("scan-deep-status").textContent=D?"Demo mode: you can review and approve the summary, but with no Firebase project configured there is no cloud to send it to — approving will show exactly where the flow stops, and nothing will be sent.":"")});d("scan-deep-cancel").addEventListener("click",()=>{d("scan-consent").hidden=!0,d("scan-deep-status").textContent="Cancelled — nothing was sent."});d("scan-deep-approve").addEventListener("click",async()=>{const t=V.summary;if(!t)return;d("scan-deep-approve").disabled=!0,d("scan-deep-status").textContent="Running deep analysis in the cloud…";const e=performance.now();try{if(!navigator.onLine){R({task:"Deep analysis (wallet scan)",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"You are offline — deep analysis needs a connection. Nothing was sent."}),d("scan-deep-status").textContent="You are offline, so deep analysis cannot run. Nothing was sent — try again when you are back online.";return}const n=await Pn(t);R({task:"Deep analysis (wallet scan)",requestedMode:n.requestedMode,source:n.inferenceSource,ms:performance.now()-e}),d("scan-deep-badge").textContent="Answered in the cloud",d("scan-deep-badge").className="badge in-cloud",d("scan-deep-result").textContent=n.text,d("scan-deep-wrap").hidden=!1,d("scan-consent").hidden=!0,d("scan-deep-status").textContent=""}catch(n){n instanceof ht||n&&n.code==="demo-mode"?(R({task:"Deep analysis (wallet scan)",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"Demo mode — Firebase is not configured, so the approved scan summary was not sent."}),d("scan-deep-status").textContent="Demo mode: the summary above is exactly what would be sent, but no Firebase project is configured, so nothing was sent anywhere. Configure Firebase (see the README) to run the real cloud analysis."):(console.error("Scan deep analysis failed:",n),R({task:"Deep analysis (wallet scan)",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"The cloud call failed — nothing was analysed."}),d("scan-deep-status").textContent="Deep analysis could not run just now. Nothing was analysed in the cloud — you can try again.")}finally{d("scan-deep-approve").disabled=!1}});bt();Gn();Hn();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(t=>{console.warn("Service worker registration failed:",t)})});
