// #region Utilities
function toggleClass(element: Element, className: string) {
    if(element.classList.contains(className)) {
        element.classList.remove(className);
        return false;
    }
    else {
        element.classList.add(className);
        return true;
    }
}

function setClass(element: Element | null, clss: string, value: boolean) {
    if(value) {
        element?.classList.add(clss);
    }
    else {
        element?.classList.remove(clss);
    }
}

function type(elem: HTMLElement, text: string, length: number, blinkDelay: number) {
    let index = 0;

    const typeInterval = setInterval(() => {
        elem.textContent += text[index];
        index++;

        if(index == text.length) {
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
document.querySelector("#menu-icon")?.addEventListener("click", () => {
    const nav = document.querySelector("nav");

    if(nav) {
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
    el: HTMLElement;
    summary: HTMLElement | null;
    content: HTMLElement | null;
    animation: Animation | null = null;
    isClosing = false;
    isExpanding = false;
    animationLength = 250;

    constructor(el: HTMLElement) {
        // Store the <details> element
        this.el = el;
        // Store the <summary> element
        this.summary = el.querySelector("summary");
        // Store the <div> element
        this.content = el.querySelector("div");

        // Detect user clicks on the summary element
        if(this.summary) {
            this.summary.addEventListener("click", (e) => this.onClick(e));
        }
    }

    onClick(e: MouseEvent) {
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

    shrinkOrExpand(expand: boolean) {
        if(!this.summary || !this.content) {
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

        if(this.animation) {
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

        if(this.animation) {
            this.animation.oncancel = () => this.isExpanding = false;
        }
    }

    onAnimationFinish(open: boolean) {
        // Set the open attribute based on the parameter
        if(open) {
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
// #region Window Events
window.addEventListener("load", () => {
    document.querySelectorAll("details").forEach((e) => {
        new Accordion(e);
    });

    const exp: HTMLSpanElement | null = document.querySelector("#experience");

    if(exp) {
        const currentYear = new Date().getFullYear();
        exp.innerText = (currentYear - 2007).toLocaleString();
    }

    const repos: HTMLSpanElement | null = document.querySelector("#repos");

    if(repos) {
        fetch("https://api.github.com/users/abluescarab/repos?type=sources&per_page=1000")
            .then((r) => {
                if(r.ok) {
                    return r.json();
                }
            })
            .then((d) => {
                if(d) {
                    repos.innerText = d.length;
                }
            })
            .catch((e) => console.log(e));
    }

    const typing = document.querySelector(".typing") as HTMLElement;

    if(typing) {
        const text = typing.innerText;
        const animation = (typing.dataset.animation ? parseInt(typing.dataset.animation) : 1000);
        const delay = (typing.dataset.blinkDelay ? parseInt(typing.dataset.blinkDelay) : 250);

        typing.innerText = "";
        type(typing, text, animation, delay);
    }
});

window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const header = document.querySelector(".header-container");

    setClass(document.querySelector("nav"), "open", false);

    for(const section of sections) {
        // includes the header height plus a little extra so current changes
        // partway through the previous section
        const top = section.offsetTop - 125 - (header ? header.scrollHeight : 0);
        const bottom = top + section.scrollHeight;

        if(window.scrollY >= top && window.scrollY <= bottom) {
            document.querySelector("a.current")?.classList.remove("current");
            document.querySelector(`a[href='#${section.id}'`)?.classList.add("current");
            break;
        }
    }
});
// #endregion
