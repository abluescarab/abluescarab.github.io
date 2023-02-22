// window.addEventListener("scroll", (e) => {
//     const sections = document.querySelectorAll("section");
//     const nav = document.querySelector("nav");

//     for(const section of sections) {
//         const top = section.offsetTop - (nav ? nav.scrollHeight : 0);
//         const bottom = top + section.scrollHeight;

//         if(window.scrollY >= top && window.scrollY <= bottom) {
//             console.log(`in section ${section.id}`);
//             document.querySelector("a.current")?.classList.remove("current");
//             document.querySelector(`a[href='#${section.id}'`)?.classList.add("current");
//         }
//     }
// });
