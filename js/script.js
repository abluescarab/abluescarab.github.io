"use strict";
var _a;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    a.addEventListener("click", () => { var _a; return (_a = document.querySelector("nav")) === null || _a === void 0 ? void 0 : _a.classList.remove("open"); });
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
class Slideshow {
    constructor(container, transitionSpeed) {
        var _a, _b;
        this.indices = {
            prev: -1,
            curr: -1,
            next: -1
        };
        this.container = container;
        this.transitionSpeed = transitionSpeed;
        this.slideshow = container.querySelector(".slideshow");
        this.slides = container.querySelectorAll(".slide");
        this.leftTitle = container.querySelector("#left-title");
        this.currentTitle = container.querySelector("#current-title");
        this.rightTitle = container.querySelector("#right-title");
        (_a = this.leftTitle) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => this.clickPrevious(e));
        (_b = this.rightTitle) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => this.clickNext(e));
        if (this.slideshow) {
            this.slideshow.style.width = `${this.slides.length * 100}%`;
        }
        this.updateSlideIndices();
        this.updateTitles();
    }
    updateSlideIndices() {
        if (!this.slides) {
            return;
        }
        for (const [idx, slide] of this.slides.entries()) {
            if (slide.classList.contains("current")) {
                this.indices.curr = idx;
                break;
            }
        }
        this.indices.prev = getIndex(this.indices.curr, this.slides.length, false);
        this.indices.next = getIndex(this.indices.curr, this.slides.length, true);
    }
    updateTitles() {
        if (!this.slides || !this.leftTitle || !this.currentTitle || !this.rightTitle) {
            return;
        }
        const left = this.slides[this.indices.prev].dataset.title;
        const current = this.slides[this.indices.curr].dataset.title;
        const right = this.slides[this.indices.next].dataset.title;
        this.leftTitle.innerText = (left ? left : "Untitled");
        this.currentTitle.innerText = (current ? current : "Untitled");
        this.rightTitle.innerText = (right ? right : "Untitled");
    }
    moveLeft() {
        if (!this.slides || !this.slideshow) {
            return;
        }
        const currSlide = this.slides[this.indices.curr];
        const prevSlide = this.slides[this.indices.prev];
        if (reducedMotion) {
            this.slideshow.style.left = `-${this.indices.prev * 100}%`;
            currSlide.classList.remove("current");
            prevSlide.classList.add("current");
        }
        else {
            const animation = new Animation(new KeyframeEffect(this.slideshow, { transform: `translateX(-${this.indices.prev / this.slides.length * 100}%)` }, { duration: this.transitionSpeed, fill: "forwards" }));
            animation.addEventListener("finish", () => {
                currSlide.classList.remove("current");
                prevSlide.classList.add("current");
            });
            animation.play();
        }
    }
    moveRight() {
        if (!this.slides || !this.slideshow) {
            return;
        }
        const currSlide = this.slides[this.indices.curr];
        const nextSlide = this.slides[this.indices.next];
        if (reducedMotion) {
            this.slideshow.style.left = `-${this.indices.next * 100}%`;
            currSlide.classList.remove("current");
            nextSlide.classList.add("current");
        }
        else {
            const animation = new Animation(new KeyframeEffect(this.slideshow, { transform: `translateX(-${this.indices.next / this.slides.length * 100}%)` }, { duration: this.transitionSpeed, fill: "forwards" }));
            animation.addEventListener("finish", () => {
                currSlide.classList.remove("current");
                nextSlide.classList.add("current");
            });
            animation.play();
        }
    }
    clickPrevious() {
        if (!this.slides) {
            return;
        }
        this.indices.prev = getIndex(this.indices.curr, this.slides.length, false);
        this.moveLeft();
        this.indices.next = this.indices.curr;
        this.indices.curr = this.indices.prev;
        this.indices.prev = getIndex(this.indices.prev, this.slides.length, false);
        this.updateTitles();
    }
    clickNext() {
        if (!this.slides) {
            return;
        }
        this.indices.next = getIndex(this.indices.curr, this.slides.length, true);
        this.moveRight();
        this.indices.prev = this.indices.curr;
        this.indices.curr = this.indices.next;
        this.indices.next = getIndex(this.indices.next, this.slides.length, true);
        this.updateTitles();
    }
}
// #endregion
// =============================================================================
// #region Window Events
window.addEventListener("load", () => {
    if (!reducedMotion) {
        document.querySelectorAll("details").forEach((e) => {
            new Accordion(e);
        });
    }
    const slideshow = document.querySelector(".slideshow-container");
    if (slideshow) {
        new Slideshow(slideshow, 350);
    }
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
    var _a, _b, _c;
    const sections = document.querySelectorAll("section");
    const header = document.querySelector(".header-container");
    (_a = document.querySelector("nav")) === null || _a === void 0 ? void 0 : _a.classList.remove("open");
    for (const section of sections) {
        // includes the header height plus a little extra so current changes
        // partway through the previous section
        const top = section.offsetTop - 125 - (header ? header.scrollHeight : 0);
        const bottom = top + section.scrollHeight;
        if (window.scrollY >= top && window.scrollY <= bottom) {
            (_b = document.querySelector("a.current")) === null || _b === void 0 ? void 0 : _b.classList.remove("current");
            (_c = document.querySelector(`a[href='#${section.id}'`)) === null || _c === void 0 ? void 0 : _c.classList.add("current");
            break;
        }
    }
});
// #endregion
//# sourceMappingURL=script.js.map