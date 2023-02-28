"use strict";
var _a;
// #region Utilities
function getIndex(index, length, nextIndex) {
    if (nextIndex) {
        return (index === length - 1 ? 0 : index + 1);
    }
    else {
        return (index === 0 ? length - 1 : index - 1);
    }
}
function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
        return false;
    }
    else {
        element.classList.add(className);
        return true;
    }
}
function setClass(element, clss, value) {
    if (value) {
        element === null || element === void 0 ? void 0 : element.classList.add(clss);
    }
    else {
        element === null || element === void 0 ? void 0 : element.classList.remove(clss);
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
// #endregion
// =============================================================================
// #region Menu Events
(_a = document.querySelector("#menu-icon")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const nav = document.querySelector("nav");
    if (nav) {
        toggleClass(nav, "open");
    }
});
document.querySelectorAll("nav a").forEach((a) => {
    a.addEventListener("click", () => setClass(document.querySelector("nav"), "open", false));
});
// #endregion
// =============================================================================
// #region Details Events
// modified from https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
class Accordion {
    constructor(el) {
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.animationLength = 250;
        // Store the <details> element
        this.el = el;
        // Store the <summary> element
        this.summary = el.querySelector("summary");
        // Store the <div> element
        this.content = el.querySelector("div");
        // Detect user clicks on the summary element
        if (this.summary) {
            this.summary.addEventListener("click", (e) => this.onClick(e));
        }
    }
    onClick(e) {
        // Stop default behaviour from the browser
        e.preventDefault();
        // Add an overflow on the <details> to avoid content overflowing
        this.el.style.overflow = "hidden";
        // Check if the element is being closed or is already closed
        if (this.isClosing || !this.el.hasAttribute("open")) {
            this.open();
        }
        // Check if the element is being openned or is already open
        else if (this.isExpanding || this.el.hasAttribute("open")) {
            this.shrink();
        }
    }
    shrinkOrExpand(expand) {
        if (!this.summary || !this.content) {
            return;
        }
        // Store the current height of the element
        const startHeight = `${this.el.offsetHeight}px`;
        // Calculate the height of the summary
        const endHeight = `${this.summary.offsetHeight
            + (expand ? this.content.offsetHeight : 0)}px`;
        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }
        // Start a WAAPI animation
        this.animation = this.el.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
        }, {
            duration: this.animationLength,
            easing: "ease-out"
        });
        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(expand);
    }
    shrink() {
        // Set the element as "being closed"
        this.isClosing = true;
        this.shrinkOrExpand(false);
        if (this.animation) {
            this.animation.oncancel = () => this.isClosing = false;
        }
    }
    open() {
        // Apply a fixed height on the element
        this.el.style.height = `${this.el.offsetHeight}px`;
        // Force the [open] attribute on the details element
        this.el.setAttribute("open", "");
        // Wait for the next frame to call the expand function
        window.requestAnimationFrame(() => this.expand());
    }
    expand() {
        // Set the element as "being expanded"
        this.isExpanding = true;
        this.shrinkOrExpand(true);
        if (this.animation) {
            this.animation.oncancel = () => this.isExpanding = false;
        }
    }
    onAnimationFinish(open) {
        // Set the open attribute based on the parameter
        if (open) {
            this.el.setAttribute("open", "");
        }
        else {
            this.el.removeAttribute("open");
        }
        // Clear the stored animation
        this.animation = null;
        // Reset isClosing & isExpanding
        this.isClosing = false;
        this.isExpanding = false;
        // Remove the overflow hidden and the fixed height
        this.el.style.height = this.el.style.overflow = "";
    }
}
// #endregion
// =============================================================================
// #region Slideshow Events
function getSlideTitle(slides, index) {
    const slide = slides[index];
    return (slide.dataset.title ? slide.dataset.title : "");
}
function changeSlide(e) {
    const target = e.target;
    const leftTitle = document.querySelector("#left-title");
    const currentTitle = document.querySelector("#current-title");
    const rightTitle = document.querySelector("#right-title");
    const slides = document.querySelectorAll(".slide");
    let previousSlide = -1;
    let index = 0;
    let nextSlide = -1;
    if (!leftTitle || !currentTitle || !rightTitle) {
        return;
    }
    for (const [idx, slide] of slides.entries()) {
        if (slide.classList.contains("current")) {
            index = idx;
            break;
        }
    }
    previousSlide = getIndex(index, slides.length, false);
    nextSlide = getIndex(index, slides.length, true);
    setClass(slides[index], "current", false);
    if (target.id === "slideshow-left") {
        setClass(slides[previousSlide], "current", true);
        nextSlide = index;
        index = previousSlide;
        previousSlide = getIndex(previousSlide, slides.length, false);
    }
    else if (target.id === "slideshow-right") {
        setClass(slides[nextSlide], "current", true);
        previousSlide = index;
        index = nextSlide;
        nextSlide = getIndex(nextSlide, slides.length, true);
    }
    leftTitle.innerText = getSlideTitle(slides, previousSlide);
    currentTitle.innerText = getSlideTitle(slides, index);
    rightTitle.innerText = getSlideTitle(slides, nextSlide);
}
document.querySelectorAll(".slideshow-button").forEach((e) => {
    e.addEventListener("click", changeSlide);
});
// #endregion
// =============================================================================
// #region Window Events
window.addEventListener("load", () => {
    document.querySelectorAll("details").forEach((e) => {
        new Accordion(e);
    });
    const exp = document.querySelector("#experience");
    if (exp) {
        const currentYear = new Date().getFullYear();
        exp.innerText = (currentYear - 2007).toLocaleString();
    }
    const repos = document.querySelector("#repos");
    if (repos) {
        fetch("https://api.github.com/users/abluescarab/repos?type=sources&per_page=1000")
            .then((r) => {
            if (r.ok) {
                return r.json();
            }
        })
            .then((d) => {
            if (d) {
                repos.innerText = d.length;
            }
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
});
window.addEventListener("scroll", () => {
    var _a, _b;
    const sections = document.querySelectorAll("section");
    const header = document.querySelector(".header-container");
    setClass(document.querySelector("nav"), "open", false);
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
// #endregion
//# sourceMappingURL=script.js.map