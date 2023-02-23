"use strict";
window.addEventListener("load", (e) => {
    const exp = document.querySelector("#experience");
    if (exp) {
        const currentYear = new Date().getFullYear();
        exp.innerText = (currentYear - 2007).toLocaleString();
    }
});
window.addEventListener("scroll", (e) => {
    var _a, _b;
    const sections = document.querySelectorAll("section");
    const header = document.querySelector(".header-container");
    for (const section of sections) {
        const top = section.offsetTop - (header ? header.scrollHeight : 0);
        const bottom = top + section.scrollHeight;
        if (window.scrollY >= top && window.scrollY <= bottom) {
            console.log(`in section ${section.id}`);
            (_a = document.querySelector("a.current")) === null || _a === void 0 ? void 0 : _a.classList.remove("current");
            (_b = document.querySelector(`a[href='#${section.id}'`)) === null || _b === void 0 ? void 0 : _b.classList.add("current");
        }
    }
});
//# sourceMappingURL=script.js.map