(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const mn=()=>{};var et={};/**
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
 */const Tt=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},yn=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=t[n++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=t[n++],a=t[n++],i=t[n++],c=((s&7)<<18|(o&63)<<12|(a&63)<<6|i&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const o=t[n++],a=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},Re={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const o=t[s],a=s+1<t.length,i=a?t[s+1]:0,c=s+2<t.length,l=c?t[s+2]:0,p=o>>2,f=(o&3)<<4|i>>4;let y=(i&15)<<2|l>>6,g=l&63;c||(g=64,a||(y=64)),r.push(n[p],n[f],n[y],n[g])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Tt(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):yn(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const o=n[t.charAt(s++)],i=s<t.length?n[t.charAt(s)]:0;++s;const l=s<t.length?n[t.charAt(s)]:64;++s;const f=s<t.length?n[t.charAt(s)]:64;if(++s,o==null||i==null||l==null||f==null)throw new bn;const y=o<<2|i>>4;if(r.push(y),l!==64){const g=i<<4&240|l>>2;if(r.push(g),f!==64){const w=l<<6&192|f;r.push(w)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class bn extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const En=function(t){const e=Tt(t);return Re.encodeByteArray(e,!0)},Ot=function(t){return En(t).replace(/\./g,"")},wn=function(t){try{return Re.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function F(t){return St(void 0,t)}function St(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!_n(n)||(t[n]=St(t[n],e[n]));return t}function _n(t){return t!=="__proto__"}/**
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
 */function De(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Cn=()=>De().__FIREBASE_DEFAULTS__,An=()=>{if(typeof process>"u"||typeof et>"u")return;const t=et.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},In=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&wn(t[1]);return e&&JSON.parse(e)},Tn=()=>{try{return mn()||Cn()||An()||In()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},vt=()=>{var t;return(t=Tn())==null?void 0:t.config};/**
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
 */class Y{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}function Ne(){try{return typeof indexedDB=="object"}catch{return!1}}function On(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var o;e(((o=s.error)==null?void 0:o.message)||"")}}catch(n){e(n)}})}/**
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
 */const Sn="FirebaseError";class z extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Sn,Object.setPrototypeOf(this,z.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Le.prototype.create)}}class Le{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?vn(o,r):"Error",i=`${this.serviceName}: ${a} (${s}).`;return new z(s,i,r)}}function vn(t,e){try{let n=0,r="";for(;n<t.length;){const s=t.indexOf("{$",n);if(s===-1){r+=t.substring(n);break}const o=t.indexOf("}",s+2);if(o===-1){r+=t.substring(n);break}const a=t.substring(s+2,o),i=e[a];r+=t.substring(n,s)+(i!=null?String(i):`<${a}?>`),n=o+1}return r}catch{return t}}function we(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const o=t[s],a=e[s];if(tt(o)&&tt(a)){if(!we(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function tt(t){return t!==null&&typeof t=="object"}/**
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
 */const kn=1e3,Rn=2,Dn=14400*1e3,Nn=.5;function Ln(t,e=kn,n=Rn){const r=e*Math.pow(n,t),s=Math.round(Nn*r*(Math.random()-.5)*2);return Math.min(Dn,r+s)}/**
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
 */function kt(t){return t&&t._delegate?t._delegate:t}class U{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const x="[DEFAULT]";/**
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
 */class Pn{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Y;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(xn(e))try{this.getOrInitializeService({instanceIdentifier:x})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=x){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=x){return this.instances.has(e)}getOptions(e=x){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[o,a]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(o);r===i&&a.resolve(s)}return s}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Mn(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=x){return this.component?this.component.multipleInstances?e:x:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Mn(t){return t===x?void 0:t}function xn(t){return t.instantiationMode==="EAGER"}/**
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
 */class $n{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Pn(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var m;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(m||(m={}));const Fn={debug:m.DEBUG,verbose:m.VERBOSE,info:m.INFO,warn:m.WARN,error:m.ERROR,silent:m.SILENT},Bn=m.INFO,Un={[m.DEBUG]:"log",[m.VERBOSE]:"log",[m.INFO]:"info",[m.WARN]:"warn",[m.ERROR]:"error"},Hn=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=Un[e];if(s)console[s](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Pe{constructor(e){this.name=e,this._logLevel=Bn,this._logHandler=Hn,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in m))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Fn[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,m.DEBUG,...e),this._logHandler(this,m.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,m.VERBOSE,...e),this._logHandler(this,m.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,m.INFO,...e),this._logHandler(this,m.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,m.WARN,...e),this._logHandler(this,m.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,m.ERROR,...e),this._logHandler(this,m.ERROR,...e)}}const Gn=(t,e)=>e.some(n=>t instanceof n);let nt,rt;function Vn(){return nt||(nt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function jn(){return rt||(rt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Rt=new WeakMap,_e=new WeakMap,Dt=new WeakMap,de=new WeakMap,Me=new WeakMap;function qn(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",o),t.removeEventListener("error",a)},o=()=>{n(M(t.result)),s()},a=()=>{r(t.error),s()};t.addEventListener("success",o),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Rt.set(n,t)}).catch(()=>{}),Me.set(e,t),e}function zn(t){if(_e.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",a),t.removeEventListener("abort",a)},o=()=>{n(),s()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",o),t.addEventListener("error",a),t.addEventListener("abort",a)});_e.set(t,e)}let Ce={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return _e.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Dt.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return M(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Kn(t){Ce=t(Ce)}function Wn(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(ue(this),e,...n);return Dt.set(r,e.sort?e.sort():[e]),M(r)}:jn().includes(t)?function(...e){return t.apply(ue(this),e),M(Rt.get(this))}:function(...e){return M(t.apply(ue(this),e))}}function Yn(t){return typeof t=="function"?Wn(t):(t instanceof IDBTransaction&&zn(t),Gn(t,Vn())?new Proxy(t,Ce):t)}function M(t){if(t instanceof IDBRequest)return qn(t);if(de.has(t))return de.get(t);const e=Yn(t);return e!==t&&(de.set(t,e),Me.set(e,t)),e}const ue=t=>Me.get(t);function Jn(t,e,{blocked:n,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(t,e),i=M(a);return r&&a.addEventListener("upgradeneeded",c=>{r(M(a.result),c.oldVersion,c.newVersion,M(a.transaction),c)}),n&&a.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),i.then(c=>{o&&c.addEventListener("close",()=>o()),s&&c.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),i}const Xn=["get","getKey","getAll","getAllKeys","count"],Qn=["put","add","delete","clear"],he=new Map;function st(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(he.get(e))return he.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=Qn.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Xn.includes(n)))return;const o=async function(a,...i){const c=this.transaction(a,s?"readwrite":"readonly");let l=c.store;return r&&(l=l.index(i.shift())),(await Promise.all([l[n](...i),s&&c.done]))[0]};return he.set(e,o),o}Kn(t=>({...t,get:(e,n,r)=>st(e,n)||t.get(e,n,r),has:(e,n)=>!!st(e,n)||t.has(e,n)}));/**
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
 */class Zn{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(er(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function er(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ae="@firebase/app",ot="0.16.7";/**
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
 */const v=new Pe("@firebase/app"),tr="@firebase/app-compat",nr="@firebase/analytics-compat",rr="@firebase/analytics",sr="@firebase/app-check-compat",or="@firebase/app-check",ar="@firebase/auth",ir="@firebase/auth-compat",cr="@firebase/crashlytics",lr="@firebase/database",dr="@firebase/data-connect",ur="@firebase/database-compat",hr="@firebase/functions",fr="@firebase/functions-compat",pr="@firebase/installations",gr="@firebase/installations-compat",mr="@firebase/messaging",yr="@firebase/messaging-compat",br="@firebase/performance",Er="@firebase/performance-compat",wr="@firebase/remote-config",_r="@firebase/remote-config-compat",Cr="@firebase/storage",Ar="@firebase/storage-compat",Ir="@firebase/firestore",Tr="@firebase/ai",Or="@firebase/firestore-compat",Sr="firebase";/**
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
 */const Ie="[DEFAULT]",vr={[Ae]:"fire-core",[tr]:"fire-core-compat",[rr]:"fire-analytics",[nr]:"fire-analytics-compat",[or]:"fire-app-check",[sr]:"fire-app-check-compat",[ar]:"fire-auth",[ir]:"fire-auth-compat",[cr]:"fire-cls",[lr]:"fire-rtdb",[dr]:"fire-data-connect",[ur]:"fire-rtdb-compat",[hr]:"fire-fn",[fr]:"fire-fn-compat",[pr]:"fire-iid",[gr]:"fire-iid-compat",[mr]:"fire-fcm",[yr]:"fire-fcm-compat",[br]:"fire-perf",[Er]:"fire-perf-compat",[wr]:"fire-rc",[_r]:"fire-rc-compat",[Cr]:"fire-gcs",[Ar]:"fire-gcs-compat",[Ir]:"fire-fst",[Or]:"fire-fst-compat",[Tr]:"fire-vertex","fire-js":"fire-js",[Sr]:"fire-js-all"};/**
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
 */const se=new Map,kr=new Map,Te=new Map;function at(t,e){try{t.container.addComponent(e)}catch(n){v.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function j(t){const e=t.name;if(Te.has(e))return v.debug(`There were multiple attempts to register component ${e}.`),!1;Te.set(e,t);for(const n of se.values())at(n,t);for(const n of kr.values())at(n,t);return!0}function xe(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Rr(t){return t==null?!1:t.settings!==void 0}/**
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
 */const Dr={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},D=new Le("app","Firebase",Dr);/**
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
 */class Nr{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new U("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw D.create("app-deleted",{appName:this._name})}}function Nt(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Ie,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw D.create("bad-app-name",{appName:String(s)});if(n||(n=vt()),!n)throw D.create("no-options");const o=se.get(s);if(o)if(we(n,o.options)){if(we(r,o.config))return o;throw D.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(o.config),newValue:JSON.stringify(r)})}else throw D.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(o.options),newValue:JSON.stringify(n)});const a=new $n(s);for(const c of Te.values())a.addComponent(c);const i=new Nr(n,r,a);return se.set(s,i),i}function Lt(t=Ie){const e=se.get(t);if(!e&&t===Ie&&vt())return Nt();if(!e)throw D.create("no-app",{appName:t});return e}function B(t,e,n){let r=vr[t]??t;n&&(r+=`-${n}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),v.warn(a.join(" "));return}j(new U(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Lr="firebase-heartbeat-database",Pr=1,J="firebase-heartbeat-store";let fe=null;function Pt(){return fe||(fe=Jn(Lr,Pr,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(J)}catch(n){console.warn(n)}}}}).catch(t=>{throw D.create("idb-open",{originalErrorMessage:t.message})})),fe}async function Mr(t){try{const n=(await Pt()).transaction(J),r=await n.objectStore(J).get(Mt(t));return await n.done,r}catch(e){if(e instanceof z)v.warn(e.message);else{const n=D.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});v.warn(n.message)}}}async function it(t,e){try{const r=(await Pt()).transaction(J,"readwrite");await r.objectStore(J).put(e,Mt(t)),await r.done}catch(n){if(n instanceof z)v.warn(n.message);else{const r=D.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});v.warn(r.message)}}}function Mt(t){return`${t.name}!${t.options.appId}`}/**
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
 */const xr=1024,$r=30;class Fr{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Ur(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=ct();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>$r){const a=Hr(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){v.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=ct(),{heartbeatsToSend:r,unsentEntries:s}=Br(this._heartbeatsCache.heartbeats),o=Ot(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(n){return v.warn(n),""}}}function ct(){return new Date().toISOString().substring(0,10)}function Br(t,e=xr){const n=[];let r=t.slice();for(const s of t){const o=n.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),lt(n)>e){o.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),lt(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Ur{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ne()?On().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Mr(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return it(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return it(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function lt(t){return Ot(JSON.stringify({version:2,heartbeats:t})).length}function Hr(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function Gr(t){j(new U("platform-logger",e=>new Zn(e),"PRIVATE")),j(new U("heartbeat",e=>new Fr(e),"PRIVATE")),B(Ae,ot,t),B(Ae,ot,"esm2020"),B("fire-js","")}/**
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
 */const Oe="firebase-js-sdk-policy",Vr=["https://www.googletagmanager.com/gtag/js","https://apis.google.com/js/api.js","https://www.google.com/recaptcha/api.js","https://www.google.com/recaptcha/enterprise.js"];let Q,xt=!1;function $t(t){if(!Vr.some(n=>t.startsWith(n)&&(t.length===n.length||t.charAt(n.length)==="?")))throw new TypeError(`Firebase: Refusing to load untrusted script URL: ${t}`);return t}function jr(){if(Q===void 0){Q=null;const t=typeof window<"u"?window.trustedTypes:void 0;if(t!=null&&t.createPolicy)try{Q=t.createPolicy(Oe,{createScriptURL:$t})}catch{xt=!0}}return Q}function qr(t,e){$t(e);const n=jr();if(n){t.src=n.createScriptURL(e);return}try{t.src=e}catch(r){throw xt&&v.error(`Unable to load ${e} because this page requires Trusted Types for scripts but does not allow the "${Oe}" Trusted Types policy. To fix this, add "${Oe}" to the trusted-types directive of the page's Content-Security-Policy.`),r}}/**
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
 */Gr("");var zr="firebase",Kr="13.4.0";/**
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
 */B(zr,Kr,"app");/**
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
 */const Se=new Map,Ft={activated:!1,tokenObservers:[]},Wr={initialized:!1,enabled:!1};function E(t){return Se.get(t)||{...Ft}}function Yr(t,e){return Se.set(t,e),Se.get(t)}function ce(){return Wr}/**
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
 */const Bt="https://content-firebaseappcheck.googleapis.com/v1",Jr="exchangeRecaptchaV3Token",Xr="exchangeDebugToken",dt={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},Qr=1440*60*1e3;/**
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
 */class Zr{constructor(e,n,r,s,o){if(this.operation=e,this.retryPolicy=n,this.getWaitDuration=r,this.lowerBound=s,this.upperBound=o,this.pending=null,this.nextErrorWaitInterval=s,s>o)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new Y,this.pending.promise.catch(n=>{}),await es(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new Y,this.pending.promise.catch(n=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(n){this.retryPolicy(n)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const n=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),n}}}function es(t){return new Promise(e=>{setTimeout(e,t)})}/**
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
 */const ts={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},A=new Le("appCheck","AppCheck",ts);/**
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
 */function ut(t=!1){var e;return t?(e=self.grecaptcha)==null?void 0:e.enterprise:self.grecaptcha}function $e(t){if(!E(t).activated)throw A.create("use-before-activation",{appName:t.name})}function Ut(t){const e=Math.round(t/1e3),n=Math.floor(e/(3600*24)),r=Math.floor((e-n*3600*24)/3600),s=Math.floor((e-n*3600*24-r*3600)/60),o=e-n*3600*24-r*3600-s*60;let a="";return n&&(a+=Z(n)+"d:"),r&&(a+=Z(r)+"h:"),a+=Z(s)+"m:"+Z(o)+"s",a}function Z(t){return t===0?"00":t>=10?t.toString():"0"+t}/**
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
 */async function Fe({url:t,body:e},n){const r={"Content-Type":"application/json"},s=n.getImmediate({optional:!0});if(s){const f=await s.getHeartbeatsHeader();f&&(r["X-Firebase-Client"]=f)}const o={method:"POST",body:JSON.stringify(e),headers:r};let a;try{a=await fetch(t,o)}catch(f){throw A.create("fetch-network-error",{originalErrorMessage:f==null?void 0:f.message})}if(a.status!==200)throw A.create("fetch-status-error",{httpStatus:a.status});let i;try{i=await a.json()}catch(f){throw A.create("fetch-parse-error",{originalErrorMessage:f==null?void 0:f.message})}const c=i.ttl.match(/^([\d.]+)(s)$/);if(!c||!c[2]||isNaN(Number(c[1])))throw A.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${i.ttl}`});const l=Number(c[1])*1e3,p=Date.now();return{token:i.token,expireTimeMillis:p+l,issuedAtTimeMillis:p}}function ns(t,e){const{projectId:n,appId:r,apiKey:s}=t.options;return{url:`${Bt}/projects/${n}/apps/${r}:${Jr}?key=${s}`,body:{recaptcha_v3_token:e}}}function Ht(t,e){const{projectId:n,appId:r,apiKey:s}=t.options;return{url:`${Bt}/projects/${n}/apps/${r}:${Xr}?key=${s}`,body:{debug_token:e}}}/**
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
 */const rs="firebase-app-check-database",ss=1,X="firebase-app-check-store",Gt="debug-token";let ee=null;function Vt(){return ee||(ee=new Promise((t,e)=>{try{const n=indexedDB.open(rs,ss);n.onsuccess=r=>{t(r.target.result)},n.onerror=r=>{var s;e(A.create("storage-open",{originalErrorMessage:(s=r.target.error)==null?void 0:s.message}))},n.onupgradeneeded=r=>{const s=r.target.result;switch(r.oldVersion){case 0:s.createObjectStore(X,{keyPath:"compositeKey"})}}}catch(n){e(A.create("storage-open",{originalErrorMessage:n==null?void 0:n.message}))}}),ee)}function os(t){return qt(zt(t))}function as(t,e){return jt(zt(t),e)}function is(t){return jt(Gt,t)}function cs(){return qt(Gt)}async function jt(t,e){const r=(await Vt()).transaction(X,"readwrite"),o=r.objectStore(X).put({compositeKey:t,value:e});return new Promise((a,i)=>{o.onsuccess=c=>{a()},r.onerror=c=>{var l;i(A.create("storage-set",{originalErrorMessage:(l=c.target.error)==null?void 0:l.message}))}})}async function qt(t){const n=(await Vt()).transaction(X,"readonly"),s=n.objectStore(X).get(t);return new Promise((o,a)=>{s.onsuccess=i=>{const c=i.target.result;o(c?c.value:void 0)},n.onerror=i=>{var c;a(A.create("storage-get",{originalErrorMessage:(c=i.target.error)==null?void 0:c.message}))}})}function zt(t){return`${t.options.appId}-${t.name}`}/**
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
 */const P=new Pe("@firebase/app-check");/**
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
 */async function ls(t){if(Ne()){let e;try{e=await os(t)}catch(n){P.warn(`Failed to read token from IndexedDB. Error: ${n}`)}return e}}function pe(t,e){return Ne()?as(t,e).catch(n=>{P.warn(`Failed to write token to IndexedDB. Error: ${n}`)}):Promise.resolve()}async function ds(t){let e;try{e=await cs()}catch{}if(e)return e;{const n=crypto.randomUUID();let r=`To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${n}

`;const s=t==null?void 0:t.options.appId,o=t==null?void 0:t.options.projectId;return o&&s?r+=`You can do so in the Firebase Console:
https://console.firebase.google.com/project/${o}/appcheck/apps?selectedAppId=${s}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${n} --project ${o} --app ${s}

`:r+=`You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`,r+=`Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`,console.log(r),is(n).catch(a=>P.warn(`Failed to persist debug token to IndexedDB. Error: ${a}`)),n}}/**
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
 */function Be(){return ce().enabled}async function Ue(){const t=ce();if(t.enabled&&t.token)return t.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function us(t){const e=De(),n=ce();if(n.initialized=!0,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&e.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;n.enabled=!0;const r=new Y;n.token=r,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?r.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN):r.resolve(ds(t))}/**
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
 */const hs={error:"UNKNOWN_ERROR"};function fs(t){return Re.encodeString(JSON.stringify(t),!1)}async function ve(t,e=!1,n=!1){const r=t.app;$e(r);const s=E(r);let o=s.token,a;if(o&&!G(o)&&(s.token=void 0,o=void 0),!o){const l=await s.cachedTokenPromise;l&&(G(l)?o=l:await pe(r,void 0))}if(!e&&o&&G(o))return{token:o.token};let i=!1;if(Be())try{const l=await Ue();s.exchangeTokenPromise||(s.exchangeTokenPromise=Fe(Ht(r,l),t.heartbeatServiceProvider).finally(()=>{s.exchangeTokenPromise=void 0}),i=!0);const p=await s.exchangeTokenPromise;return await pe(r,p),s.token=p,{token:p.token}}catch(l){return l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?P.warn(l.message):n&&P.error(l),ge(l)}try{s.exchangeTokenPromise||(s.exchangeTokenPromise=s.provider.getToken().finally(()=>{s.exchangeTokenPromise=void 0}),i=!0),o=await E(r).exchangeTokenPromise}catch(l){l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?P.warn(l.message):n&&P.error(l),a=l}let c;return o?a?G(o)?c={token:o.token,internalError:a}:c=ge(a):(c={token:o.token},s.token=o,await pe(r,o)):c=ge(a),i&&Yt(r,c),c}async function ps(t){const e=t.app;$e(e);const{provider:n}=E(e);if(Be()){const r=await Ue(),s=Ht(e,r);s.body.limited_use=!0;const{token:o}=await Fe(s,t.heartbeatServiceProvider);return{token:o}}else{const{token:r}=await n.getToken(!0);return{token:r}}}function Kt(t,e,n,r){const{app:s}=t,o=E(s),a={next:n,error:r,type:e};if(o.tokenObservers=[...o.tokenObservers,a],o.token&&G(o.token)){const i=o.token;Promise.resolve().then(()=>{n({token:i.token}),ht(t)}).catch(()=>{})}o.cachedTokenPromise.then(()=>ht(t))}function Wt(t,e){const n=E(t),r=n.tokenObservers.filter(s=>s.next!==e);r.length===0&&n.tokenRefresher&&n.tokenRefresher.isRunning()&&n.tokenRefresher.stop(),n.tokenObservers=r}function ht(t){const{app:e}=t,n=E(e);let r=n.tokenRefresher;r||(r=gs(t),n.tokenRefresher=r),!r.isRunning()&&n.isTokenAutoRefreshEnabled&&r.start()}function gs(t){const{app:e}=t;return new Zr(async()=>{const n=E(e);let r;if(n.token?r=await ve(t,!0):r=await ve(t),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{const n=E(e);if(n.token){let r=n.token.issuedAtTimeMillis+(n.token.expireTimeMillis-n.token.issuedAtTimeMillis)*.5+3e5;const s=n.token.expireTimeMillis-300*1e3;return r=Math.min(r,s),Math.max(0,r-Date.now())}else return 0},dt.RETRIAL_MIN_WAIT,dt.RETRIAL_MAX_WAIT)}function Yt(t,e){const n=E(t).tokenObservers;for(const r of n)try{r.type==="EXTERNAL"&&e.error!=null?r.error(e.error):r.next(e)}catch{}}function G(t){return t.expireTimeMillis-Date.now()>0}function ge(t){return{token:fs(hs),error:t}}/**
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
 */class ms{constructor(e,n){this.app=e,this.heartbeatServiceProvider=n}_delete(){const{tokenObservers:e}=E(this.app);for(const n of e)Wt(this.app,n.next);return Promise.resolve()}}function ys(t,e){return new ms(t,e)}function bs(t){return{getToken:e=>ve(t,e),getLimitedUseToken:()=>ps(t),addTokenListener:e=>Kt(t,"INTERNAL",e),removeTokenListener:e=>Wt(t.app,e)}}const Es="@firebase/app-check",ws="0.13.2";/**
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
 */const _s="https://www.google.com/recaptcha/api.js";function Cs(t,e){const n=new Y,r=E(t);r.reCAPTCHAState={initialized:n};const s=As(t),o=ut(!1);return o?ft(t,e,o,s,n):Os(()=>{const a=ut(!1);if(!a)throw new Error("no recaptcha");ft(t,e,a,s,n)}),n.promise}function ft(t,e,n,r,s){n.ready(()=>{Ts(t,e,n,r),s.resolve(n)})}function As(t){const e=`fire_app_check_${t.name}`,n=document.createElement("div");return n.id=e,n.style.display="none",document.body.appendChild(n),e}async function Is(t){$e(t);const n=await E(t).reCAPTCHAState.initialized.promise;return new Promise((r,s)=>{const o=E(t).reCAPTCHAState;n.ready(()=>{r(n.execute(o.widgetId,{action:"fire_app_check"}))})})}function Ts(t,e,n,r){const s=n.render(r,{sitekey:e,size:"invisible",callback:()=>{E(t).reCAPTCHAState.succeeded=!0},"error-callback":()=>{E(t).reCAPTCHAState.succeeded=!1}}),o=E(t);o.reCAPTCHAState={...o.reCAPTCHAState,widgetId:s}}function Os(t){const e=document.createElement("script");qr(e,_s),e.onload=t,document.head.appendChild(e)}/**
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
 */class He{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(e=!1){var s,o,a;vs(this._throttleData);const n=await Is(this._app).catch(i=>{throw A.create("recaptcha-error")});if(!((s=E(this._app).reCAPTCHAState)!=null&&s.succeeded))throw A.create("recaptcha-error");let r;try{const i=ns(this._app,n);e&&(i.body.limited_use=!0),r=await Fe(i,this._heartbeatServiceProvider)}catch(i){throw(o=i.code)!=null&&o.includes("fetch-status-error")?(this._throttleData=Ss(Number((a=i.customData)==null?void 0:a.httpStatus),this._throttleData),A.create("initial-throttle",{time:Ut(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):i}return this._throttleData=null,r}initialize(e){this._app=e,this._heartbeatServiceProvider=xe(e,"heartbeat"),Cs(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof He?this._siteKey===e._siteKey:!1}}function Ss(t,e){if(t===404||t===403)return{backoffCount:1,allowRequestsAfter:Date.now()+Qr,httpStatus:t};{const n=e?e.backoffCount:0,r=Ln(n,1e3,2);return{backoffCount:n+1,allowRequestsAfter:Date.now()+r,httpStatus:t}}}function vs(t){if(t&&Date.now()-t.allowRequestsAfter<=0)throw A.create("throttled",{time:Ut(t.allowRequestsAfter-Date.now()),httpStatus:t.httpStatus})}/**
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
 */function ks(t=Lt(),e){var s;t=kt(t);const n=xe(t,"app-check");if(ce().initialized||us(t),Be()&&Ue().then(o=>{console.log(`Firebase App Check debug token: ${o}`)}),n.isInitialized()){const o=n.getImmediate(),a=n.getOptions();if(a&&!!a.isTokenAutoRefreshEnabled==!!e.isTokenAutoRefreshEnabled&&((s=a.provider)!=null&&s.isEqual(e.provider)))return o;throw A.create("already-initialized",{appName:t.name})}const r=n.initialize({options:e});return Rs(t,e.provider,e.isTokenAutoRefreshEnabled),E(t).isTokenAutoRefreshEnabled&&Kt(r,"INTERNAL",()=>{}),r}function Rs(t,e,n=!1){const r=Yr(t,{...Ft});r.activated=!0,r.provider=e,r.cachedTokenPromise=ls(t).then(s=>(s&&G(s)&&(r.token=s,Yt(t,{token:s.token})),s)),r.isTokenAutoRefreshEnabled=n&&t.automaticDataCollectionEnabled,!t.automaticDataCollectionEnabled&&n&&P.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),r.provider.initialize(t)}/**
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
 */const Ds="app-check",pt="app-check-internal";function Ns(){j(new U(Ds,t=>{const e=t.getProvider("app").getImmediate(),n=t.getProvider("heartbeat");return ys(e,n)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider(pt).initialize()})),j(new U(pt,t=>{const e=t.getProvider("app-check").getImmediate();return bs(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),B(Es,ws)}Ns();var gt="@firebase/ai",ke="3.1.0";/**
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
 */const q="AI",Ls="global",Ps="firebasevertexai.googleapis.com",oe="v1beta",mt=ke,Ms="gl-js",xs="hybrid",$s=180*1e3,Fs="gemini-3.5-flash-lite";/**
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
 */class h extends z{constructor(e,n,r){const s=q,o=`${s}/${e}`,a=`${s}: ${n} (${o})`;super(e,a),this.code=e,this.customErrorData=r,Error.captureStackTrace&&Error.captureStackTrace(this,h),Object.setPrototypeOf(this,h.prototype),this.toString=()=>a}}/**
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
 */const yt=["user","model","function","system"],Jt={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},_={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},I={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},L={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
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
 */const H={STRING:"string",NUMBER:"number",INTEGER:"integer",BOOLEAN:"boolean",ARRAY:"array",OBJECT:"object"};/**
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
 */const N={AGENT_PLATFORM:"AGENT_PLATFORM",GOOGLE_AI:"GOOGLE_AI"};/**
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
 */class Xt{constructor(e){this.backendType=e}}class le extends Xt{constructor(){super(N.GOOGLE_AI)}_getModelPath(e,n){return`/${oe}/projects/${e}/${n}`}_getTemplatePath(e,n){return`/${oe}/projects/${e}/templates/${n}`}}class Qt extends Xt{constructor(e){super(N.AGENT_PLATFORM),this.location=Ls,e&&(this.location=e)}_getModelPath(e,n){return`/${oe}/projects/${e}/locations/${this.location}/${n}`}_getTemplatePath(e,n){return`/${oe}/projects/${e}/locations/${this.location}/templates/${n}`}}/**
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
 */function Bs(t){if(t instanceof le)return`${q}/googleai`;if(t instanceof Qt)return`${q}/agentplatform/${t.location}`;throw new h(u.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function Us(t){const e=t.split("/");if(e[0]!==q)throw new h(u.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"agentplatform":const r=e[2];if(!r)throw new h(u.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new Qt(r);case"googleai":return new le;default:throw new h(u.ERROR,`Invalid instance identifier string: '${t}'`)}}/**
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
 */const b=new Pe("@firebase/ai");var R;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(R||(R={}));/**
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
 */const Zt={type:"text",languages:["en"]},me=[Zt,{type:"image"}],ye=[Zt];class O{constructor(e,n,r){this.languageModelProvider=e,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:me,expectedOutputs:ye}},r&&(this.onDeviceParams=r,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=me),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=ye)):this.onDeviceParams.createOptions={expectedInputs:me,expectedOutputs:ye})}async isAvailable(e){var r;if(!this.mode)return b.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===I.ONLY_IN_CLOUD)return b.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const n=await((r=this.languageModelProvider)==null?void 0:r.availability(this.onDeviceParams.createOptions));if(this.mode===I.ONLY_ON_DEVICE){if(n===R.UNAVAILABLE)throw new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===R.DOWNLOADABLE||n===R.DOWNLOADING){b.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(s){throw new h(u.ERROR,s.message)}return!0}return!0}return n!==R.AVAILABLE?(b.debug(`On-device inference unavailable because availability is "${n}".`),!1):O.isOnDeviceRequest(e)?!0:(b.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){const n=await this.createSession(),r=await Promise.all(e.contents.map(O.toLanguageModelMessage)),s=await n.prompt(r,this.onDeviceParams.promptOptions);return O.toResponse(s)}async generateContentStream(e){const n=await this.createSession(),r=await Promise.all(e.contents.map(O.toLanguageModelMessage)),s=n.promptStreaming(r,this.onDeviceParams.promptOptions);return O.toStreamResponse(s)}async countTokens(e){throw new h(u.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return b.debug("Empty prompt rejected for on-device inference."),!1;for(const n of e.contents){if(n.parts.some(r=>"functionResponse"in r))return b.debug("Content with a function response part rejected for on-device inference."),!1;for(const r of n.parts)if("inlineData"in r&&r.inlineData&&O.SUPPORTED_MIME_TYPES.indexOf(r.inlineData.mimeType)===-1)return b.debug(`Unsupported mime type "${r.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){var r;const n=await((r=this.languageModelProvider)==null?void 0:r.availability(this.onDeviceParams.createOptions));return(n===R.DOWNLOADABLE||n===R.DOWNLOADING)&&this.download(e),n}download(e){var r;if(this.downloadPromise)return;const n={...this.onDeviceParams.createOptions};n&&!n.monitor&&e&&(n.monitor=s=>{s.addEventListener("downloadprogress",o=>{e(o.loaded)})}),this.downloadPromise=(r=this.languageModelProvider)==null?void 0:r.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){const n=await Promise.all(e.parts.map(O.toLanguageModelMessageContent));return{role:O.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if("text"in e&&typeof e.text=="string")return{type:"text",value:e.text};if("inlineData"in e&&e.inlineData){const r=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(r)}}throw new h(u.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new h(u.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){const n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(r,s){const o=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:r}]}}]});s.enqueue(n.encode(`data: ${o}

`))}}))}}}O.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function Hs(t,e,n){const s=(e||De()).LanguageModel;if(s&&t)return new O(s,t,n)}/**
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
 */class Gs{constructor(e,n,r,s,o){this.app=e,this.backend=n,this.chromeAdapterFactory=o;const a=s==null?void 0:s.getImmediate({optional:!0}),i=r==null?void 0:r.getImmediate({optional:!0});this.auth=i||null,this.appCheck=a||null}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}}/**
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
 */function Vs(t,{instanceIdentifier:e}){if(!e)throw new h(u.ERROR,"AIService instance identifier is undefined.");const n=Us(e),r=t.getProvider("app").getImmediate(),s=t.getProvider("auth-internal"),o=t.getProvider("app-check-internal");return new Gs(r,n,s,o,Hs)}/**
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
 */function js(t){var n,r,s,o,a,i,c;if((r=(n=t.app)==null?void 0:n.options)!=null&&r.apiKey)if((o=(s=t.app)==null?void 0:s.options)!=null&&o.projectId){if(!((i=(a=t.app)==null?void 0:a.options)!=null&&i.appId))throw new h(u.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new h(u.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new h(u.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const e={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,backend:t.backend};if(Rr(t.app)&&t.app.settings.appCheckToken){const l=t.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:l})}else t.appCheck&&((c=t.options)!=null&&c.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(e.getAuthToken=()=>t.auth.getToken()),e}/**
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
 */class W{constructor(e,n){this._apiSettings=js(e),this.model=W.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(e,n){return n===N.GOOGLE_AI?W.normalizeGoogleAIModelName(e):W.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}}/**
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
 */const qs="Timeout has expired.",be="AbortError";class zs{constructor(e){this.params=e}toString(){const e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){var e;return((e=this.params.singleRequestOptions)==null?void 0:e.baseUrl)??`https://${Ps}`}get queryParams(){const e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}}function Ks(t){const e=[];return e.push(`${Ms}/${mt}`),e.push(`fire/${mt}`),(t.params.apiSettings.inferenceMode===I.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===I.PREFER_IN_CLOUD)&&e.push(xs),e.join(" ")}async function Ws(t){const e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",Ks(t)),e.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){const n=await t.params.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&b.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.params.apiSettings.getAuthToken){const n=await t.params.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function Ge(t,e){var l,p;const n=new zs(t);let r;const s=(l=t.singleRequestOptions)==null?void 0:l.signal,o=((p=t.singleRequestOptions)==null?void 0:p.timeout)!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:$s,a=new AbortController,i=setTimeout(()=>{a.abort(new DOMException(qs,be)),b.debug(`Aborting request to ${n} due to timeout (${o}ms)`)},o),c=AbortSignal.any(s?[s,a.signal]:[a.signal]);if(s&&s.aborted)throw clearTimeout(i),new DOMException(s.reason??"Aborted externally before fetch",be);try{const f={method:"POST",headers:await Ws(n),signal:c,body:e};if(r=await fetch(n.toString(),f),!r.ok){let y="",g;try{const w=await r.json();y=w.error.message,w.error.details&&(y+=` ${JSON.stringify(w.error.details)}`,g=w.error.details)}catch{}throw r.status===403&&g&&g.some(w=>w.reason==="SERVICE_DISABLED")&&g.some(w=>{var Qe,Ze;return(Ze=(Qe=w.links)==null?void 0:Qe[0])==null?void 0:Ze.description.includes("Google developers console API activation")})?new h(u.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:r.status,statusText:r.statusText,errorDetails:g}):new h(u.FETCH_ERROR,`Error fetching from ${n}: [${r.status} ${r.statusText}] ${y}`,{status:r.status,statusText:r.statusText,errorDetails:g})}}catch(f){let y=f;throw f.code!==u.FETCH_ERROR&&f.code!==u.API_NOT_ENABLED&&f instanceof Error&&f.name!==be&&(y=new h(u.ERROR,`Error fetching from ${n.toString()}: ${f.message}`),y.stack=f.stack),y}finally{clearTimeout(i)}return r}/**
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
 */function te(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&b.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),tn(t.candidates[0]))throw new h(u.RESPONSE_ERROR,`Response error: ${$(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function k(t){return"type"in t&&t.type?t:t.text!==void 0?{...t,type:"text"}:t.inlineData!==void 0?{...t,type:"inlineData"}:t.functionCall!==void 0?{...t,type:"functionCall"}:t.functionResponse!==void 0?{...t,type:"functionResponse"}:t.fileData!==void 0?{...t,type:"fileData"}:t.executableCode!==void 0?{...t,type:"executableCode"}:t.codeExecutionResult!==void 0?{...t,type:"codeExecutionResult"}:t}function ae(t,e=L.IN_CLOUD){var r,s;if((r=t.candidates)!=null&&r[0]&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0),t.candidates)for(const o of t.candidates)(s=o.content)!=null&&s.parts&&(o.content.parts=o.content.parts.map(k));const n=Ys(t);return n.inferenceSource=e,n}function Ys(t){return t.text=()=>{if(te(t))return bt(t,e=>!("thought"in e&&e.thought));if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Text not available. ${$(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(te(t)){const e=bt(t,n=>!!("thought"in n&&n.thought));return e===""?void 0:e}else if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Thought summary not available. ${$(t)}`,{response:t})},t.inlineDataParts=()=>{if(te(t))return Js(t);if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Data not available. ${$(t)}`,{response:t})},t.functionCalls=()=>{if(te(t))return en(t);if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Function call not available. ${$(t)}`,{response:t})},t}function bt(t,e){var r,s,o,a;const n=[];if((s=(r=t.candidates)==null?void 0:r[0].content)!=null&&s.parts)for(const i of(a=(o=t.candidates)==null?void 0:o[0].content)==null?void 0:a.parts){const c=k(i);c.type==="text"&&e(c)&&n.push(c.text)}return n.length>0?n.join(""):""}function en(t){var n,r,s,o;if(!t)return;const e=[];if((r=(n=t.candidates)==null?void 0:n[0].content)!=null&&r.parts)for(const a of(o=(s=t.candidates)==null?void 0:s[0].content)==null?void 0:o.parts){const i=k(a);i.type==="functionCall"&&e.push(i.functionCall)}if(e.length>0)return e}function Js(t){var n,r,s,o;const e=[];if((r=(n=t.candidates)==null?void 0:n[0].content)!=null&&r.parts)for(const a of(o=(s=t.candidates)==null?void 0:s[0].content)==null?void 0:o.parts){const i=k(a);i.type==="inlineData"&&e.push(i)}if(e.length>0)return e}const Xs=[_.RECITATION,_.SAFETY,_.BLOCKLIST,_.PROHIBITED_CONTENT,_.SPII,_.MALFORMED_FUNCTION_CALL,_.IMAGE_SAFETY,_.IMAGE_PROHIBITED_CONTENT,_.IMAGE_OTHER,_.NO_IMAGE,_.IMAGE_RECITATION,_.LANGUAGE,_.UNEXPECTED_TOOL_CALL,_.TOO_MANY_TOOL_CALLS,_.MISSING_THOUGHT_SIGNATURE,_.MALFORMED_RESPONSE];function tn(t){return!!t.finishReason&&Xs.some(e=>e===t.finishReason)}function $(t){var n,r,s;let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",(n=t.promptFeedback)!=null&&n.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),(r=t.promptFeedback)!=null&&r.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if((s=t.candidates)!=null&&s[0]){const o=t.candidates[0];tn(o)&&(e+=`Candidate was blocked due to ${o.finishReason}`,o.finishMessage&&(e+=`: ${o.finishMessage}`))}return e}/**
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
 */function Ve(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{type:"text",text:t}]};if(t.type==="text"||"text"in t&&typeof t.text=="string")return{role:"system",parts:[F(k(t))]};if(t.parts){const e=t.parts.map(n=>F(k(n)));return t.role?{...t,parts:e}:{role:"system",parts:e}}}}function K(t){let e=[];if(typeof t=="string")e=[{type:"text",text:t}];else for(const n of t)typeof n=="string"?e.push({type:"text",text:n}):e.push(F(k(n)));return Qs(e)}function Qs(t){const e={role:"user",parts:[]};let n=!1,r=!1;for(const s of t)s.type==="functionResponse"||"functionResponse"in s?r=!0:n=!0,e.parts.push(s);if(n&&r)throw new h(u.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!n&&!r)throw new h(u.INVALID_CONTENT,"No Content is provided for sending chat message.");return e}function Ee(t){let e;if(t.contents){const n=t;e={...n,contents:n.contents.map(r=>({...r,parts:r.parts?r.parts.map(k):[]}))}}else e={contents:[K(t)]};return t.systemInstruction&&(e.systemInstruction=Ve(t.systemInstruction)),e}function Zs(t){return t.parts&&Array.isArray(t.parts)?{...t,parts:t.parts.map(je)}:t}function je(t){let e;if("type"in t){const{type:n,...r}=t;e=r}else e=t;return e.functionResponse&&(e={...e,functionResponse:Zs(e.functionResponse)}),e}function qe(t){return t.parts?{...t,parts:t.parts.map(je)}:t}function nn(t){return t==null||typeof t=="string"?t:"parts"in t&&Array.isArray(t.parts)?qe(t):je(t)}function rn(t){const e={...t};return e.contents&&(e.contents=e.contents.map(qe)),e.systemInstruction&&(e.systemInstruction=nn(e.systemInstruction)),e}function eo(t){const e={...t};return e.contents&&(e.contents=e.contents.map(qe)),e.systemInstruction&&(e.systemInstruction=nn(e.systemInstruction)),e}/**
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
 */function sn(t){var e,n;if((e=t.safetySettings)==null||e.forEach(r=>{if(r.method)throw new h(u.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),(n=t.generationConfig)!=null&&n.topK){const r=Math.round(t.generationConfig.topK);r!==t.generationConfig.topK&&(b.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=r)}return t}function ze(t){return{candidates:t.candidates?no(t.candidates):void 0,promptFeedback:t.promptFeedback?ro(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function to(t,e){return{generateContentRequest:{model:e,...t}}}function no(t){const e=[];let n;return e&&t.forEach(r=>{var a,i;let s;if(r.citationMetadata&&(s={citations:r.citationMetadata.citationSources}),r.safetyRatings&&(n=r.safetyRatings.map(c=>({...c,severity:c.severity??Jt.HARM_SEVERITY_UNSUPPORTED,probabilityScore:c.probabilityScore??0,severityScore:c.severityScore??0}))),(i=(a=r.content)==null?void 0:a.parts)!=null&&i.some(c=>"videoMetadata"in c&&c.videoMetadata))throw new h(u.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const o={index:r.index,content:r.content,finishReason:r.finishReason,finishMessage:r.finishMessage,safetyRatings:n,citationMetadata:s,groundingMetadata:r.groundingMetadata,urlContextMetadata:r.urlContextMetadata};e.push(o)}),e}function ro(t){const e=[];return(t.safetyRatings??[]).forEach(r=>{e.push({category:r.category,probability:r.probability,severity:r.severity??Jt.HARM_SEVERITY_UNSUPPORTED,probabilityScore:r.probabilityScore??0,severityScore:r.severityScore??0,blocked:r.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}/**
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
 */const Et=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function so(t,e,n){const r=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),s=co(r),[o,a]=s.tee(),{response:i,firstValue:c}=await oo(a,e,n);return{stream:io(o,e,n),response:i,firstValue:c}}async function oo(t,e,n){const[r,s]=t.tee(),o=r.getReader(),{value:a}=await o.read();return{firstValue:a,response:ao(s,e,n)}}async function ao(t,e,n){const r=[],s=t.getReader();for(;;){const{done:o,value:a}=await s.read();if(o){let i=lo(r);return e.backend.backendType===N.GOOGLE_AI&&(i=ze(i)),ae(i,n)}r.push(a)}}async function*io(t,e,n){var s,o;const r=t.getReader();for(;;){const{value:a,done:i}=await r.read();if(i)break;let c;e.backend.backendType===N.GOOGLE_AI?c=ae(ze(a),n):c=ae(a,n);const l=(s=c.candidates)==null?void 0:s[0];!((o=l==null?void 0:l.content)!=null&&o.parts)&&!(l!=null&&l.finishReason)&&!(l!=null&&l.citationMetadata)&&!(l!=null&&l.urlContextMetadata)||(yield c)}}function co(t){const e=t.getReader();return new ReadableStream({start(r){let s="";return o();function o(){return e.read().then(({value:a,done:i})=>{if(i){if(s.trim()){r.error(new h(u.PARSE_FAILED,"Failed to parse stream"));return}r.close();return}s+=a;let c=s.match(Et),l;for(;c;){try{l=JSON.parse(c[1])}catch{r.error(new h(u.PARSE_FAILED,`Error parsing JSON response: "${c[1]}`));return}r.enqueue(l),s=s.substring(c[0].length),c=s.match(Et)}return o()})}}})}function lo(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const r of t)if(r.candidates)for(const s of r.candidates){const o=s.index||0;n.candidates||(n.candidates=[]),n.candidates[o]||(n.candidates[o]={index:s.index}),n.candidates[o].citationMetadata=s.citationMetadata,n.candidates[o].finishReason=s.finishReason,n.candidates[o].finishMessage=s.finishMessage,n.candidates[o].safetyRatings=s.safetyRatings,n.candidates[o].groundingMetadata=s.groundingMetadata;const a=s.urlContextMetadata;if(typeof a=="object"&&a!==null&&Object.keys(a).length>0&&(n.candidates[o].urlContextMetadata=a),s.content){if(!s.content.parts)continue;n.candidates[o].content||(n.candidates[o].content={role:s.content.role||"user",parts:[]});for(const i of s.content.parts){if("text"in i&&i.text==="")continue;if(Object.keys(i).length===0)throw new h(u.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");const c=k({...i});Object.keys(c).length>0&&n.candidates[o].content.parts.push(c)}}}return n}/**
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
 */const uo=[u.FETCH_ERROR,u.ERROR,u.API_NOT_ENABLED];async function on(t,e,n,r){if(!e)return{response:await r(),inferenceSource:L.IN_CLOUD};switch(e.mode){case I.ONLY_ON_DEVICE:if(await e.isAvailable(t))return{response:await n(),inferenceSource:L.ON_DEVICE};throw new h(u.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case I.ONLY_IN_CLOUD:return{response:await r(),inferenceSource:L.IN_CLOUD};case I.PREFER_IN_CLOUD:try{return{response:await r(),inferenceSource:L.IN_CLOUD}}catch(s){if(s instanceof h&&uo.includes(s.code)&&await e.isAvailable(t))return{response:await n(),inferenceSource:L.ON_DEVICE};throw s}case I.PREFER_ON_DEVICE:return await e.isAvailable(t)?{response:await n(),inferenceSource:L.ON_DEVICE}:{response:await r(),inferenceSource:L.IN_CLOUD};default:throw new h(u.ERROR,`Unexpected infererence mode: ${e.mode}`)}}/**
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
 */async function ho(t,e,n,r){return n=rn(n),t.backend.backendType===N.GOOGLE_AI&&(n=sn(n)),Ge({task:"streamGenerateContent",model:e,apiSettings:t,stream:!0,singleRequestOptions:r},JSON.stringify(n))}async function an(t,e,n,r,s){const o=await on(n,r,()=>r.generateContentStream(n),()=>ho(t,e,n,s));return so(o.response,t,o.inferenceSource)}async function fo(t,e,n,r){return n=rn(n),t.backend.backendType===N.GOOGLE_AI&&(n=sn(n)),Ge({model:e,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:r},JSON.stringify(n))}async function cn(t,e,n,r,s){const o=await on(n,r,()=>r.generateContent(n),()=>fo(t,e,n,s)),a=await po(o.response,t);return{response:ae(a,o.inferenceSource)}}async function po(t,e){const n=await t.json();return e.backend.backendType===N.GOOGLE_AI?ze(n):n}/**
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
 */const wt="SILENT_ERROR",_t=10;class go{constructor(e,n,r){this.params=n,this.requestOptions=r,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,F(this._history).map(e=>({...e,parts:e.parts?e.parts.map(k):[]}))}async _sendMessage(e,n){let r={};await this._sendPromise;const s=[];return this._sendPromise=this._sendPromise.then(async()=>{var c,l,p;let o,a=0;const i=((c=this.requestOptions)==null?void 0:c.maxSequentialFunctionCalls)??_t;do{let f;if(o){a++;const w=await this._callFunctionsAsNeeded(o);f=K(w)}else f=K(e);const y=this._formatRequest(f,[...s]);s.push(f);const g=await this._callGenerateContent(y,n);if(g)if(r=g,o=this._getCallableFunctionCalls(g.response),g.response.candidates&&g.response.candidates.length>0){const w={parts:((l=g.response.candidates)==null?void 0:l[0].content.parts)||[],role:((p=g.response.candidates)==null?void 0:p[0].content.role)||"model"};s.push(F(w))}else{const w=$(g.response);w&&b.warn(`sendMessage() was unsuccessful. ${w}. Inspect response object for details.`)}else o=void 0}while(o&&a<i);o&&a>=i&&b.warn(`Automatic function calling exceeded the limit of ${i} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(s),r}async _sendMessageStream(e,n){await this._sendPromise;const r=[],o=(async()=>{var p;let a,i=0;const c=((p=this.requestOptions)==null?void 0:p.maxSequentialFunctionCalls)??_t;let l;do{let f;if(a){i++;const g=await this._callFunctionsAsNeeded(a);f=K(g)}else f=K(e);const y=this._formatRequest(f,[...r]);if(r.push(f),l=await this._callGenerateContentStream(y,n),a=this._getCallableFunctionCalls(l.firstValue),a&&l.firstValue&&l.firstValue.candidates&&l.firstValue.candidates.length>0){const g={...l.firstValue.candidates[0].content};g.role||(g.role="model"),r.push(g)}}while(a&&i<c);return a&&i>=c&&b.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`),{stream:l.stream,response:l.response}})();return this._sendPromise=this._sendPromise.then(async()=>o).catch(a=>{throw new Error(wt)}).then(a=>a.response).then(a=>{if(a.candidates&&a.candidates.length>0){this._history=this._history.concat(r);const i={...a.candidates[0].content};i.role||(i.role="model"),this._history.push(F(i))}else{const i=$(a);i&&b.warn(`sendMessageStream() was unsuccessful. ${i}. Inspect response object for details.`)}}).catch(a=>{a.message!==wt&&a.name!=="AbortError"&&b.error(a)}),o}_getCallableFunctionCalls(e){var s,o,a;const n=(o=(s=this.params)==null?void 0:s.tools)==null?void 0:o.find(i=>i.functionDeclarations);if(!(n!=null&&n.functionDeclarations))return;const r=en(e);if(r){for(const i of r)if(!((a=n.functionDeclarations)==null?void 0:a.some(l=>l.name===i.name&&typeof l.functionReference=="function")))return;return r}}async _callFunctionsAsNeeded(e){var o,a;const n=[],r=[],s=(a=(o=this.params)==null?void 0:o.tools)==null?void 0:a.find(i=>i.functionDeclarations);if(s&&s.functionDeclarations){for(const c of e){const l=s.functionDeclarations.find(p=>p.name===c.name);if(l!=null&&l.functionReference){const p=Promise.resolve(l.functionReference(c.args)).catch(f=>{const y=new h(u.ERROR,`Error in user-defined function "${l.name}": ${f.message}`);throw y.stack=f.stack,y});n.push({name:c.name,id:c.id,results:p}),r.push(p)}}await Promise.all(r);const i=[];for(const{name:c,id:l,results:p}of n){const f={name:c,response:await p};l&&(f.id=l),i.push({type:"functionResponse",functionResponse:f})}return i}else throw new h(u.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
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
 */const mo=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],yo={user:["text","inlineData","functionResponse"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},Ct={user:["model"],function:["model"],model:["user","function"],system:[]};function bo(t){let e=null;for(const n of t){const{role:r,parts:s}=n;if(!e&&r!=="user")throw new h(u.INVALID_CONTENT,`First Content should be with role 'user', got ${r}`);if(!yt.includes(r))throw new h(u.INVALID_CONTENT,`Each item should include role field. Got ${r} but valid roles are: ${JSON.stringify(yt)}`);if(!Array.isArray(s))throw new h(u.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(s.length===0)throw new h(u.INVALID_CONTENT,"Each Content should have at least one part");const o={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const i of s){if(i.type)o[i.type]+=1;else for(const c of["text","inlineData","functionCall","functionResponse","fileData","executableCode","codeExecutionResult"])c in i&&(o[c]+=1);"thought"in i&&i.thought&&(o.thought+=1),"thoughtSignature"in i&&i.thoughtSignature&&(o.thoughtSignature+=1)}const a=yo[r];for(const i of mo)if(!a.includes(i)&&o[i]>0)throw new h(u.INVALID_CONTENT,`Content with role '${r}' can't contain '${i}' part`);if(e&&!Ct[r].includes(e.role))throw new h(u.INVALID_CONTENT,`Content with role '${r}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(Ct)}`);e=n}}/**
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
 */class Eo extends go{constructor(e,n,r,s,o){var a;super(e,s,o),this.model=n,this.chromeAdapter=r,this.params=s,this.requestOptions=o,s!=null&&s.history&&(bo(s.history),this._history=F(s.history)),((a=this.params)==null?void 0:a.systemInstruction)!=null&&(this.params={...this.params,systemInstruction:Ve(this.params.systemInstruction)})}_formatRequest(e,n){var r,s,o,a,i;return{safetySettings:(r=this.params)==null?void 0:r.safetySettings,generationConfig:(s=this.params)==null?void 0:s.generationConfig,tools:(o=this.params)==null?void 0:o.tools,toolConfig:(a=this.params)==null?void 0:a.toolConfig,systemInstruction:(i=this.params)==null?void 0:i.systemInstruction,contents:[...this._history,...n,e]}}_callGenerateContent(e,n){return cn(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(e,n){return an(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(e,n){return this._sendMessage(e,n)}async sendMessageStream(e,n){return this._sendMessageStream(e,n)}}/**
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
 */async function wo(t,e,n,r){n=eo(n);let s="";if(t.backend.backendType===N.GOOGLE_AI){const a=to(n,e);s=JSON.stringify(a)}else s=JSON.stringify(n);return(await Ge({model:e,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:r},s)).json()}async function _o(t,e,n,r,s){if((r==null?void 0:r.mode)===I.ONLY_ON_DEVICE)throw new h(u.UNSUPPORTED,"countTokens() is not supported for on-device models.");return wo(t,e,n,s)}/**
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
 */class Co extends W{constructor(e,n,r,s){super(e,n.model),this.chromeAdapter=s,this.generationConfig=n.generationConfig||{},Ao(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Ve(n.systemInstruction),this.requestOptions=r||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===I.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===R.UNAVAILABLE){const r=new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===I.ONLY_ON_DEVICE)throw r;b.debug(r.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,n){const r=Ee(e);return cn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...r},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(e,n){const r=Ee(e),{stream:s,response:o}=await an(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...r},this.chromeAdapter,{...this.requestOptions,...n});return{stream:s,response:o}}startChat(e){return new Eo(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,n){const r=Ee(e);return _o(this._apiSettings,this.model,r,this.chromeAdapter,{...this.requestOptions,...n})}}function Ao(t){var e,n;if(((e=t.thinkingConfig)==null?void 0:e.thinkingBudget)!=null&&((n=t.thinkingConfig)!=null&&n.thinkingLevel))throw new h(u.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new h(u.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json"&&t.responseMimeType!=="text/x.enum")throw new h(u.UNSUPPORTED,'responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.')}/**
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
 */class T{constructor(e){if(!e.type&&!e.anyOf)throw new h(u.INVALID_SCHEMA,"A schema must have either a 'type' or an 'anyOf' array of sub-schemas.");for(const n in e)this[n]=e[n];this.type=e.type,this.format=e.hasOwnProperty("format")?e.format:void 0,this.nullable=e.hasOwnProperty("nullable")?!!e.nullable:!1}toJSON(){const e={type:this.type};for(const n in this)this.hasOwnProperty(n)&&this[n]!==void 0&&(n!=="required"||this.type===H.OBJECT)&&(e[n]=this[n]);return e}static array(e){return new So(e,e.items)}static object(e){return new vo(e,e.properties,e.optionalProperties)}static string(e){return new At(e)}static enumString(e){return new At(e,e.enum)}static integer(e){return new Io(e)}static number(e){return new To(e)}static boolean(e){return new Oo(e)}static anyOf(e){return new ko(e)}}class Io extends T{constructor(e){super({type:H.INTEGER,...e})}}class To extends T{constructor(e){super({type:H.NUMBER,...e})}}class Oo extends T{constructor(e){super({type:H.BOOLEAN,...e})}}class At extends T{constructor(e,n){super({type:H.STRING,...e}),this.enum=n}toJSON(){const e=super.toJSON();return this.enum&&(e.enum=this.enum),e}}class So extends T{constructor(e,n){super({type:H.ARRAY,...e}),this.items=n}toJSON(){const e=super.toJSON();return e.items=this.items.toJSON(),e}}class vo extends T{constructor(e,n,r=[]){super({type:H.OBJECT,...e}),this.properties=n,this.optionalProperties=r}toJSON(){const e=super.toJSON();e.properties={...this.properties};const n=[];if(this.optionalProperties){for(const r of this.optionalProperties)if(!this.properties.hasOwnProperty(r))throw new h(u.INVALID_SCHEMA,`Property "${r}" specified in "optionalProperties" does not exist.`)}for(const r in this.properties)this.properties.hasOwnProperty(r)&&(e.properties[r]=this.properties[r].toJSON(),this.optionalProperties.includes(r)||n.push(r));return n.length>0&&(e.required=n),delete e.optionalProperties,e}}class ko extends T{constructor(e){if(e.anyOf.length===0)throw new h(u.INVALID_SCHEMA,"The 'anyOf' array must not be empty.");super({...e,type:void 0}),this.anyOf=e.anyOf}toJSON(){const e=super.toJSON();return this.anyOf&&Array.isArray(this.anyOf)&&(e.anyOf=this.anyOf.map(n=>n.toJSON())),e}}/**
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
 */function Ro(t=Lt(),e){t=kt(t);const n=xe(t,q),r=(e==null?void 0:e.backend)??new le,s=Bs(r),o=n.getImmediate({identifier:s}),a=o.options;if(a){const i=e==null?void 0:e.useLimitedUseAppCheckTokens,c=!!a.useLimitedUseAppCheckTokens;if(i!=null&&!!i!==c)throw new h(u.ALREADY_INITIALIZED,`getAI() has already been called for app "${t.name}" and this backend with useLimitedUseAppCheckTokens: ${c}. This option cannot be changed after the AI instance has been initialized. Pass the desired options to the first getAI() call for this app and backend, or omit useLimitedUseAppCheckTokens to reuse the existing instance.`);return o}return o.options={useLimitedUseAppCheckTokens:(e==null?void 0:e.useLimitedUseAppCheckTokens)??!1},o}const Do=["mode","onDeviceParams","inCloudParams"];function Ke(t,e,n){var i;const r=e;let s;if(r.mode){for(const c of Object.keys(e))Do.includes(c)||b.warn(`When a hybrid inference mode is specified (mode is currently set to ${r.mode}), "${c}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);s=r.inCloudParams||{model:Fs}}else s=e;if(!s.model)throw new h(u.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const o=(i=t.chromeAdapterFactory)==null?void 0:i.call(t,r.mode,typeof window>"u"?void 0:window,r.onDeviceParams),a=new Co(t,s,n,o);return a._apiSettings.inferenceMode=r.mode,a}/**
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
 */function No(){j(new U(q,Vs,"PUBLIC").setMultipleInstances(!0)),B(gt,ke),B(gt,ke,"esm2020")}No();const re={apiKey:"AIzaSyD3wiyfoBE2QLSeZU0nkzRHDRcc93oRrV4",authDomain:"fluid-guard.firebaseapp.com",projectId:"fluid-guard",storageBucket:"fluid-guard.firebasestorage.app",messagingSenderId:"161610398780",appId:"1:161610398780:web:043260846d8040f7f71739"},Lo="806a95ec-021a-4995-9159-966afbad65db",Po="gemini-3.8-flash";function Mo(){return[re.apiKey,re.projectId,re.appId].every(e=>typeof e=="string"&&!e.includes("REPLACE_WITH"))}const xo=[{code:"seed_phrase_request",label:"Asks for a seed phrase or private key",severity:3,pattern:/seed phrase|recovery phrase|private key|secret recovery|12[-\s]?word|24[-\s]?word|mnemonic/i,advice:"No legitimate wallet, exchange or support team will ever ask for your seed phrase or private key. Anyone who has it can take everything, and no one can undo that."},{code:"drainer_pattern",label:"Matches a known wallet-drainer pattern",severity:3,pattern:/verify your (wallet|account|seed)|claim your (airdrop|reward|refund)|wallet (has been|is) flagged|connect your wallet to (verify|claim)|double your (btc|eth|crypto)/i,advice:"“Verify”, “claim” and “flagged wallet” pages are the standard front end of a wallet drainer: the site gets you to sign or connect, then empties the wallet in one transaction."},{code:"unlimited_approval",label:"Unlimited token approval",severity:3,pattern:/unlimited|infinite approval|max(?:imum)?\s*(?:amount|approval)|115792089237316195423570985008687907853269984665640564039457584007913129639935/i,advice:"An unlimited approval lets the spender move your tokens at any time, without asking again — including months later, or after the site is sold or hacked. Approving a limited amount, or refusing, is far safer."},{code:"urgency_pressure",label:"Urgency and pressure tactics",severity:2,pattern:/urgent|act now|immediately|within \d+\s*(minutes|mins|hours)|will be frozen|will be (closed|suspended|deleted)|last chance|expires (in|soon)|do not (tell|share)/i,advice:"Real security processes do not rush you with countdowns. Pressure is there to stop you checking — treat any deadline in a message as a red flag in itself."},{code:"unverified_contract",label:"Unverified or unknown contract",severity:2,pattern:/unverified contract|unknown contract|not verified|new contract|unaudited/i,advice:"An unverified contract means nobody can read what the code actually does. Interacting with one is trusting a stranger's say-so with your funds."},{code:"unknown_spender",label:"Spender you cannot identify",severity:2,pattern:/spender|approve|allowance/i,advice:"Before approving, make sure you can name exactly who or what will be able to move your tokens, and why. If the spender is not a service you deliberately chose, do not approve.",needsApprovalContext:!0},{code:"unusual_amount",label:"Unusually large amount",severity:1,pattern:/\b\d{1,3}(?:,\d{3}){2,}\b|\b\d{7,}\b/,advice:"Very large amounts deserve a second look: check the digits, the destination and whether a smaller test transaction should go first."}];function $o(t){return/approv|allowance|spender|setApprovalForAll/i.test(t)}function Fo(t,e){return!(e.length>0||!/transfer|send|sending/i.test(t)||/approval request|interact with|interaction with|sign this message/i.test(t))}function ie(t){const e=xo.filter(l=>l.needsApprovalContext&&!$o(t)?!1:l.pattern.test(t)),n=e.reduce((l,p)=>l+p.severity,0),r=e.some(l=>l.severity>=3);let s;r||n>=4?s="danger":e.length>0?s="caution":s="safe";const o=e.length?e.map(l=>l.code):["none"],a=e.map(l=>l.label);let i,c;return s==="danger"?(i="This looks dangerous. Do not sign, approve or act on it until you understand exactly what it does.",c=["Guard's checks found serious red flags here.",...e.map(l=>l.advice),"The safe move is to stop, close the page or message, and check through a route you trust — type the official address yourself rather than following any link in the message."].join(" ")):s==="caution"?(i="There are things here worth a careful second look before you go ahead.",c=["Nothing here is proof of a scam, but Guard's checks found points to verify.",...e.map(l=>l.advice),"If everything checks out — the site is the real one, the amounts are what you expect, and you chose this action yourself — it is reasonable to proceed carefully."].join(" ")):Fo(t,e)?(i="This looks like an ordinary transfer.",c="This reads as a plain transfer of funds to an address, with no token approval, no contract interaction and none of the usual scam patterns — no seed-phrase request, no urgency pressure, no suspicious link. As always, confirm the destination address character by character before sending: transfers cannot be reversed."):(i="No known red flags were found in this text.",c="Guard's checks found none of the common scam patterns here — no seed-phrase request, no unlimited approval, no urgency pressure and no drainer-style wording. That is not a guarantee of safety: always confirm you are on the real site or app, and that the amounts and destination are exactly what you intend."),{riskLevel:s,reasonCodes:o,reasons:a,summary:i,explanation:c}}function Bo(t){return t.replace(/https?:\/\/[^\s)]+/gi,"[link]").replace(/\bwww\.[^\s)]+/gi,"[link]").replace(/\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|xyz|site|online|info|app|dev|co|example|finance|exchange|pro|live|click|link|page|space|fun|club|vip|top|icu)\b(?:\/[^\s)]*)?/gi,"[link]").replace(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g,"[email]").replace(/0x[0-9a-fA-F]{6,}/g,"[address]").replace(/\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,"[address]").replace(/\bbc1[a-z0-9]{20,}\b/gi,"[address]").replace(/\b\d{1,3}(?:,\d{3}){2,}(?:\.\d+)?\b/g,"[large amount]").replace(/\b\d{7,}\b/g,"[large number]").replace(/\s+/g," ").trim()}function Uo(t){const{riskLevel:e,reasons:n}=ie(t);return["Redacted summary of a wallet item a user is about to act on.",`Initial on-device verdict: ${e.toUpperCase()}.`,n.length?`Red flags found: ${n.join("; ")}.`:"Red flags found: none.","Content with identifiers removed:",Bo(t)].join(`
`)}const S=!Mo();class ln extends Error{constructor(){super("Deep analysis is unavailable in demo mode (Firebase not configured)."),this.name="DemoModeError",this.code="demo-mode"}}let ne=null,dn=!1;const un=15e3,Ho=45e3;function We(t,e,n){let r;const s=new Promise((o,a)=>{r=setTimeout(()=>{const i=new Error(n+" timed out after "+e+" ms.");i.name="TimeoutError",i.code="timeout",a(i)},e)});return Promise.race([t,s]).finally(()=>clearTimeout(r))}function Ye(){if(ne)return ne;const t=Nt(re);return self.FIREBASE_APPCHECK_DEBUG_TOKEN=Lo,ks(t,{provider:new He("fluid-guard-debug-token-flow"),isTokenAutoRefreshEnabled:!0}),ne=Ro(t,{backend:new le}),ne}const Go=T.object({properties:{riskLevel:T.enumString({enum:["safe","caution","danger"],description:"Overall risk of the transaction, approval or message."}),reasonCodes:T.array({items:T.enumString({enum:["unlimited_approval","unknown_spender","drainer_pattern","urgency_pressure","lookalike_address","unverified_contract","seed_phrase_request","unusual_amount","none"]}),description:"Machine-readable red flags found in the input."}),summary:T.string({description:"One or two plain-language sentences explaining the verdict for a non-technical wallet user."})},required:["riskLevel","reasonCodes","summary"]});function hn(){return Ke(Ye(),{mode:I.ONLY_ON_DEVICE,onDeviceParams:{promptOptions:{responseConstraint:Go}}})}function Vo(){return Ke(Ye(),{mode:I.PREFER_ON_DEVICE})}function jo(){return Ke(Ye(),{mode:I.ONLY_IN_CLOUD,inCloudParams:{model:Po}})}async function fn(t){await hn().initializeDeviceModel(n=>{t&&t(n)}),dn=!0}async function qo(t){if(S)return{ok:!1,demoMode:!0};try{return await fn(t),{ok:!0}}catch(e){return{ok:!1,error:e}}}async function zo(){if(S)return"demo";try{if(typeof LanguageModel<"u"&&LanguageModel.availability)return await LanguageModel.availability()}catch{}return"unknown"}function It(t){const{riskLevel:e,reasonCodes:n,summary:r}=ie(t);return{riskLevel:e,reasonCodes:n,summary:r}}async function Ko(t){const e="ONLY_ON_DEVICE";if(S)return{verdict:It(t),inferenceSource:"LOCAL_FALLBACK",requestedMode:e,degraded:!0,demoMode:!0};try{dn||await fn();const n=hn(),r=["You are a security checker inside a crypto wallet.","Classify the following transaction, approval request or message.","Respond only with the structured verdict.","",t].join(`
`),s=await We(n.generateContent(r),un,"On-device classification");return{verdict:JSON.parse(s.response.text()),inferenceSource:s.response.inferenceSource,requestedMode:e,degraded:!1,demoMode:!1}}catch(n){return console.warn("On-device classification unavailable, using local checks:",n),{verdict:It(t),inferenceSource:"LOCAL_FALLBACK",requestedMode:e,degraded:!0,demoMode:!1}}}async function Wo(t,e){const n="PREFER_ON_DEVICE";if(S)return{text:ie(t).explanation,inferenceSource:"LOCAL_FALLBACK",requestedMode:n,degraded:!0,demoMode:!0};try{const r=Vo(),s=["Explain, in plain language a beginner can understand, what this wallet","transaction or message is and why it was rated "+e.riskLevel+".","Keep it under 120 words. Do not repeat the raw input verbatim.","",t].join(`
`),o=await We(r.generateContent(s),un,"Explanation");return{text:o.response.text(),inferenceSource:o.response.inferenceSource,requestedMode:n,degraded:!1,demoMode:!1}}catch(r){return console.warn("Model explanation unavailable, using local checks:",r),{text:ie(t).explanation,inferenceSource:"LOCAL_FALLBACK",requestedMode:n,degraded:!0,demoMode:!1}}}async function Yo(t){const e="ONLY_IN_CLOUD";if(S)throw new ln;const n=jo(),r=["You are a smart-contract security analyst. Analyse this redacted summary","of a wallet transaction or approval. Explain what it actually does, the","worst case if signed, and the exact steps the user should take next.","",t].join(`
`),s=await We(n.generateContent(r),Ho,"Deep analysis");return{text:s.response.text(),inferenceSource:s.response.inferenceSource,requestedMode:e,degraded:!1,demoMode:!1}}const Jo=[{id:"approval",label:"Malicious approval",kind:"Token approval request",text:["Token approval request","From: swap-rewards.example.com — unverified contract","Action: approve — give spender 0x7f3a9c4b2d8e1f0a5c6b9d3e7f2a4c8b1d5e9f03 permission to spend your USDT.","Amount: UNLIMITED (115792089237316195423570985008687907853269984665640564039457584007913129639935)","Your tokens stay in your wallet, but the spender can move them at any time without asking again."].join(`
`)},{id:"message",label:"Drainer message",kind:"Suspicious message",text:["URGENT — Fluid Security Team: your wallet has been flagged for suspicious activity.","Verify your seed phrase within 10 minutes at fluid-verify.example.com or your funds will be frozen permanently.","Act now. Do not share this message with anyone."].join(`
`)},{id:"plain",label:"Ordinary transfer",kind:"Plain transfer",text:["Send 0.05 ETH to 0x0EBf5563F905E3B9D58718E28E08143511DC763b (saved contact) on Ethereum mainnet.","Network fee: about 0.0004 ETH.","This is a plain transfer — no token approval and no contract interaction."].join(`
`)}],Xo={unlimited_approval:"Unlimited token approval",unknown_spender:"Spender you cannot identify",drainer_pattern:"Matches a known wallet-drainer pattern",urgency_pressure:"Urgency and pressure tactics",lookalike_address:"Address that imitates a known one",unverified_contract:"Unverified or unknown contract",seed_phrase_request:"Asks for a seed phrase or private key",unusual_amount:"Unusually large amount",none:"No red flags found"},d=t=>document.getElementById(t),C={currentText:"",currentVerdict:null,redactedSummary:"",warmedUp:!1,routeLog:[],counts:{ON_DEVICE:0,IN_CLOUD:0,LOCAL_FALLBACK:0,NOT_SENT:0}};Jo.forEach(t=>{const e=document.createElement("button");e.type="button",e.textContent=t.label,e.addEventListener("click",()=>{d("input").value=t.text,Xe()}),d("fixtures").appendChild(e)});const Qo={ON_DEVICE:"On-device",IN_CLOUD:"In cloud",LOCAL_FALLBACK:"Local fallback",NOT_SENT:"Not sent"};function V({task:t,requestedMode:e,source:n,ms:r,note:s}){const o={task:t,requestedMode:e,source:n,ms:r,note:s||"",time:new Date().toLocaleTimeString("en-GB")};C.routeLog.unshift(o),C.counts[n]=(C.counts[n]||0)+1,pn()}function pn(){const{ON_DEVICE:t,IN_CLOUD:e,LOCAL_FALLBACK:n,NOT_SENT:r}=C.counts,s=[];t&&s.push(`${t} on-device`),e&&s.push(`${e} in cloud`),n&&s.push(`${n} local fallback`),r&&s.push(`${r} not sent`),d("route-summary").textContent=s.length?`So far this session: ${s.join(" · ")}.`:"No checks yet. Every AI call Guard makes will be listed here with the mode it requested and the route that actually answered.",d("route-log").innerHTML=C.routeLog.map(o=>`<li class="route-entry ${o.source.toLowerCase().replace("_","-")}"><span class="route-task">${o.task}</span><span class="route-meta">${o.time} · requested ${o.requestedMode} · <strong>${Qo[o.source]||o.source}</strong>`+(typeof o.ms=="number"?` · ${Math.round(o.ms)} ms`:"")+"</span>"+(o.note?`<span class="route-note-line">${o.note}</span>`:"")+"</li>").join("")}function Je(){const t=navigator.onLine,e=d("pill-conn");e.textContent=t?"Connection: online":"Connection: offline — on-device checks still work",e.classList.toggle("pill-warn",!t)}async function gn(){const t=d("pill-mode");t.textContent=S?"Mode: demo — Firebase not configured":"Mode: live — Firebase AI Logic",t.classList.toggle("pill-warn",S),d("demo-banner").hidden=!S;const e=d("pill-nano"),n=await zo(),r={demo:"On-device model: not configured (demo mode)",available:"On-device model: Gemini Nano available",downloadable:"On-device model: Gemini Nano will download on first use",downloading:"On-device model: Gemini Nano downloading…",unavailable:"On-device model: not available in this browser",unknown:"On-device model: availability not confirmed"};e.textContent=r[n]||r.unknown}window.addEventListener("online",Je);window.addEventListener("offline",Je);function Zo(t){return t==="ON_DEVICE"?{text:"Answered on your device — nothing was sent anywhere",cls:"badge on-device"}:t==="IN_CLOUD"?{text:"Answered in the cloud",cls:"badge in-cloud"}:{text:S?"Answered by built-in local checks (demo mode)":"Answered by built-in local checks (no model available)",cls:"badge fallback"}}function ea(t,e){const n=[];return t.demoMode?n.push("Demo mode: no Firebase project is configured, so classification ran on Guard's built-in local checks. No AI model was called and nothing left this device."):t.inferenceSource==="ON_DEVICE"?n.push("Classification ran on your device with Gemini Nano — your raw input never left it."):n.push("The on-device model is not available in this browser, so Guard's built-in local checks ran instead. Your input was not sent anywhere."),e.inferenceSource==="IN_CLOUD"?n.push("The explanation below was answered in the cloud."):e.inferenceSource==="ON_DEVICE"&&n.push("The explanation below was also answered on your device."),n.join(" ")}async function Xe(){const t=d("input").value.trim();if(!t){d("status").textContent="Paste something to check first, or tap an example.";return}C.currentText=t,C.currentVerdict=null,d("check").disabled=!0,d("result").hidden=!0,ta();try{!S&&!C.warmedUp&&(C.warmedUp=!0,d("status").textContent="Preparing the on-device model…",await qo(c=>{typeof c=="number"&&c<1&&(d("status").textContent="Downloading the on-device model… "+Math.round(c*100)+"%")}),gn()),d("status").textContent="Checking on your device…";const e=performance.now(),n=await Ko(t);V({task:"Risk classification",requestedMode:n.requestedMode,source:n.inferenceSource,ms:performance.now()-e,note:n.demoMode?"Demo mode — built-in local checks answered.":n.degraded?"On-device model unavailable — local checks answered.":""});const r=n.verdict;C.currentVerdict=r;const s=performance.now(),o=await Wo(t,r);V({task:"Explanation",requestedMode:o.requestedMode,source:o.inferenceSource,ms:performance.now()-s,note:o.degraded&&!o.demoMode?"Model route unavailable — local checks answered.":""}),d("verdict").textContent=r.riskLevel.toUpperCase(),d("verdict").className="verdict "+r.riskLevel;const a=Zo(o.inferenceSource);d("route-badge").textContent=a.text,d("route-badge").className=a.cls,d("route-note").textContent=ea(n,o),d("explanation").textContent=o.text||r.summary;const i=r.reasonCodes&&r.reasonCodes.length?r.reasonCodes:["none"];d("reasons").innerHTML=i.map(c=>`<li>${Xo[c]||c.replaceAll("_"," ")}</li>`).join(""),d("deep").hidden=r.riskLevel==="safe",d("result").hidden=!1,d("status").textContent="",d("result").scrollIntoView({behavior:"smooth",block:"nearest"})}catch(e){console.error("Check failed:",e),d("status").textContent="The check could not run in this browser. Nothing was sent anywhere — please try again."}finally{d("check").disabled=!1}}d("check").addEventListener("click",Xe);d("input").addEventListener("keydown",t=>{(t.ctrlKey||t.metaKey)&&t.key==="Enter"&&Xe()});function ta(){C.redactedSummary="",d("consent").hidden=!0,d("deep-result-wrap").hidden=!0,d("deep-status").textContent="",d("deep-prepare").hidden=!1}d("deep-prepare").addEventListener("click",()=>{C.currentText&&(C.redactedSummary=Uo(C.currentText),d("redacted").textContent=C.redactedSummary,d("consent").hidden=!1,d("deep-status").textContent=S?"Demo mode: you can review and approve the summary, but with no Firebase project configured there is no cloud to send it to — approving will show exactly where the flow stops, and nothing will be sent.":"")});d("deep-cancel").addEventListener("click",()=>{d("consent").hidden=!0,d("deep-status").textContent="Cancelled — nothing was sent."});d("deep-approve").addEventListener("click",async()=>{const t=C.redactedSummary;if(!t)return;d("deep-approve").disabled=!0,d("deep-status").textContent="Running deep analysis in the cloud…";const e=performance.now();try{if(!navigator.onLine){V({task:"Deep analysis",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"You are offline — deep analysis needs a connection. Nothing was sent."}),d("deep-status").textContent="You are offline, so deep analysis cannot run. Nothing was sent — try again when you are back online.";return}const n=await Yo(t);V({task:"Deep analysis",requestedMode:n.requestedMode,source:n.inferenceSource,ms:performance.now()-e}),d("deep-badge").textContent="Answered in the cloud",d("deep-badge").className="badge in-cloud",d("deep-result").textContent=n.text,d("deep-result-wrap").hidden=!1,d("consent").hidden=!0,d("deep-status").textContent=""}catch(n){n instanceof ln||n&&n.code==="demo-mode"?(V({task:"Deep analysis",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"Demo mode — Firebase is not configured, so the approved summary was not sent."}),d("deep-status").textContent="Demo mode: the summary above is exactly what would be sent, but no Firebase project is configured, so nothing was sent anywhere. Configure Firebase (see the README) to run the real cloud analysis."):(console.error("Deep analysis failed:",n),V({task:"Deep analysis",requestedMode:"ONLY_IN_CLOUD",source:"NOT_SENT",note:"The cloud call failed — nothing was analysed."}),d("deep-status").textContent="Deep analysis could not run just now. Nothing was analysed in the cloud — you can try again.")}finally{d("deep-approve").disabled=!1}});Je();gn();pn();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(t=>{console.warn("Service worker registration failed:",t)})});
