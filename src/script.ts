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
document.querySelector("#menu-icon")?.addEventListener("click", (e) => {
    const nav = document.querySelector("nav");

    if(nav) {
        toggleClass(nav, "open");
    }
});

document.querySelectorAll("nav a").forEach(
    (a) => a.addEventListener("click",
        () => setClass(document.querySelector("nav"), "open", false))
);
// #endregion
// =============================================================================
// #region Window Events
window.addEventListener("load", (e) => {
    const exp: HTMLSpanElement | null = document.querySelector("#experience");

    if(exp) {
        const currentYear = new Date().getFullYear();
        exp.innerText = (currentYear - 2007).toLocaleString();
    }

    const repos: HTMLSpanElement | null = document.querySelector("#repos");

    if(repos) {
        fetch("https://api.github.com/users/abluescarab/repos?type=sources&per_page=1000")
            .then((r) => r.json())
            .then((d) => {
                repos.innerText = d.length;
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

window.addEventListener("scroll", (e) => {
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
