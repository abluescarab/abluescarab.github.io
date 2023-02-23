window.addEventListener("load", (e) => {
    const exp: HTMLSpanElement | null = document.querySelector("#experience");

    if(exp) {
        const currentYear = new Date().getFullYear();
        exp.innerText = (currentYear - 2007).toLocaleString();
    }
});

window.addEventListener("scroll", (e) => {
    const sections = document.querySelectorAll("section");
    const header = document.querySelector(".header-container");

    for(const section of sections) {
        const top = section.offsetTop - (header ? header.scrollHeight : 0);
        const bottom = top + section.scrollHeight;

        if(window.scrollY >= top && window.scrollY <= bottom) {
            console.log(`in section ${section.id}`);
            document.querySelector("a.current")?.classList.remove("current");
            document.querySelector(`a[href='#${section.id}'`)?.classList.add("current");
        }
    }
});
