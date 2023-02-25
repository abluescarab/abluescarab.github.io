"use strict";
var _a;
function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
    else {
        element.classList.add(className);
    }
}
function closeDrawer() {
    const nav = document.querySelector("nav");
    if (nav === null || nav === void 0 ? void 0 : nav.classList.contains("open")) {
        nav.classList.remove("open");
    }
}
function type(elem, text, length, blinkDelay) {
    let index = 0;
    const typeInterval = setInterval(() => {
        elem.textContent += text[index];
        index++;
        if (index == text.length) {
            clearInterval(typeInterval);
            setTimeout(() => {
                elem.classList.add("blink");
            }, blinkDelay);
        }
    }, length / text.length);
}
(_a = document.querySelector("#menu-icon")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
    const nav = document.querySelector("nav");
    if (nav) {
        toggleClass(nav, "open");
    }
});
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", closeDrawer));
window.addEventListener("load", (e) => {
    const exp = document.querySelector("#experience");
    if (exp) {
        const currentYear = new Date().getFullYear();
        exp.innerText = (currentYear - 2007).toLocaleString();
    }
    const repos = document.querySelector("#repos");
    if (repos) {
        fetch("https://api.github.com/users/abluescarab/repos?type=sources&per_page=1000")
            .then((r) => r.json())
            .then((d) => {
            repos.innerText = d.length;
        })
            .catch((e) => console.log(e));
    }
    const typing = document.querySelector(".typing");
    if (typing) {
        const text = typing.innerText;
        const animation = (typing.dataset.animation ? parseInt(typing.dataset.animation) : 1000);
        const delay = (typing.dataset.blinkDelay ? parseInt(typing.dataset.blinkDelay) : 250);
        typing.innerText = "";
        type(typing, text, animation, delay);
    }
    if (typing && typing.dataset.animation) {
        const text = typing.innerText;
        typing.innerText = "";
    }
});
window.addEventListener("scroll", (e) => {
    var _a, _b;
    const nav = document.querySelector("nav");
    const sections = document.querySelectorAll("section");
    const header = document.querySelector(".header-container");
    if (nav === null || nav === void 0 ? void 0 : nav.classList.contains("open")) {
        nav.classList.remove("open");
    }
    for (const section of sections) {
        // includes the header height plus a little extra so current changes
        // partway through the previous section
        const top = section.offsetTop - 125 - (header ? header.scrollHeight : 0);
        const bottom = top + section.scrollHeight;
        if (window.scrollY >= top && window.scrollY <= bottom) {
            (_a = document.querySelector("a.current")) === null || _a === void 0 ? void 0 : _a.classList.remove("current");
            (_b = document.querySelector(`a[href='#${section.id}'`)) === null || _b === void 0 ? void 0 : _b.classList.add("current");
            break;
        }
    }
});
//# sourceMappingURL=script.js.map