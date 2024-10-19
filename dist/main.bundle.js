(()=>{"use strict";var e,n={954:(e,n,t)=>{var a,o,r,i,s,d,c,l=t(437),w=!1,h={},u=new l.Pq0(0,1,5);function p(e){d.stopAllAction(),h[e]&&(h[e].play(),w="walk"===e)}function f(){var e;requestAnimationFrame(f),d&&d.update(c.getDelta()),w&&s&&(e=s.position,o.position.set(e.x+u.x,e.y+u.y,e.z+u.z),o.lookAt(e)),i.update(),r.render(a,o)}function v(){var e=document.getElementById("threejs-container"),n=e.clientWidth,t=e.clientHeight;r.setSize(n,t),o.aspect=n/t,o.updateProjectionMatrix()}!function(){var e=document.getElementById("threejs-container");(r=new l.JeP({antialias:!1})).setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setSize(window.innerWidth,window.innerHeight),r.shadowMap.enabled=!0,r.shadowMap.type=l.Wk7,e.appendChild(r.domElement),(o=new l.ubm(45,window.innerWidth/window.innerHeight,.1,1e3)).position.set(0,-1,5),(a=new l.Z58).background=new l.Q1f(0);var n=new l.eaF(new l.iNn(2e3,.1,2e3),new l._4j({color:2039842,roughness:.8,metalness:.8}));n.receiveShadow=!0,a.add(n),c=new l.zD7,t.e(96).then(t.bind(t,92)).then((function(e){var n=new(0,e.GLTFLoader);t.e(96).then(t.bind(t,728)).then((function(e){var t=new(0,e.DRACOLoader);t.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"),n.setDRACOLoader(t),n.load("./clownV.glb",(function(e){(s=e.scene).position.set(0,.02,0),s.scale.set(1.5,1.5,1.5),s.traverse((function(e){e.isMesh&&(e.castShadow=!0,e.material&&e.material.isMeshStandardMaterial&&(e.material.roughness=.6,e.material.metalness=.2))})),d=new l.Iw4(s),e.animations.forEach((function(e){h[e.name.toLowerCase()]=d.clipAction(e)})),p("idle"),a.add(s),i.target.set(0,1.5,0),i.update()}))}))})),t.e(96).then(t.bind(t,24)).then((function(e){var n=e.OrbitControls;(i=new n(o,r.domElement)).enableDamping=!0,i.dampingFactor=.25,i.minDistance=4,i.maxDistance=20,i.maxPolarAngle=Math.PI/2}));var w=new l.ZyN(16777215,4);w.position.set(5,10,10),w.castShadow=!0,w.shadow.mapSize.set(1024,1024),a.add(w),a.add(new l.dth(16777215,4473924,.8));var u=new l.ure(16777215,2.5,5,5);u.position.set(0,5,10),u.rotation.y=Math.PI,a.add(u),a.add(new l.$p8(16777215,.3)),f(),window.addEventListener("resize",v)}(),document.addEventListener("DOMContentLoaded",(function(){var e=new IntersectionObserver((function(e){e.forEach((function(e){if(e.isIntersecting){var n=e.target.id;switch(n){case"hello":p("hello");break;case"giveaway":p("break");break;case"capabilities":p("pose");break;case"store":p("walk");break;case"thanks":p("thanks");break;case"contactForm":p("phone");break;default:console.log("No animation for section: ".concat(n))}}}))}));document.querySelectorAll("section").forEach((function(n){return e.observe(n)}))}))}},t={};function a(e){var o=t[e];if(void 0!==o)return o.exports;var r=t[e]={exports:{}};return n[e](r,r.exports,a),r.exports}a.m=n,e=[],a.O=(n,t,o,r)=>{if(!t){var i=1/0;for(l=0;l<e.length;l++){for(var[t,o,r]=e[l],s=!0,d=0;d<t.length;d++)(!1&r||i>=r)&&Object.keys(a.O).every((e=>a.O[e](t[d])))?t.splice(d--,1):(s=!1,r<i&&(i=r));if(s){e.splice(l--,1);var c=o();void 0!==c&&(n=c)}}return n}r=r||0;for(var l=e.length;l>0&&e[l-1][2]>r;l--)e[l]=e[l-1];e[l]=[t,o,r]},a.d=(e,n)=>{for(var t in n)a.o(n,t)&&!a.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},a.e=()=>Promise.resolve(),a.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={792:0};a.O.j=n=>0===e[n];var n=(n,t)=>{var o,r,[i,s,d]=t,c=0;if(i.some((n=>0!==e[n]))){for(o in s)a.o(s,o)&&(a.m[o]=s[o]);if(d)var l=d(a)}for(n&&n(t);c<i.length;c++)r=i[c],a.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return a.O(l)},t=self.webpackChunkthreejs_webflow_clown=self.webpackChunkthreejs_webflow_clown||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))})();var o=a.O(void 0,[96],(()=>a(954)));o=a.O(o)})();