const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// #region Utilities
function getIndex(index: number, length: number, nextIndex: boolean) {
  if (nextIndex) {
    return index === length - 1 ? 0 : index + 1;
  } else {
    return index === 0 ? length - 1 : index - 1;
  }
}

function toggleClass(element: Element, className: string) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
    return false;
  } else {
    element.classList.add(className);
    return true;
  }
}

function type(
  elem: HTMLElement,
  text: string,
  length: number,
  blinkDelay: number
) {
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
document.querySelector("#menu-icon")?.addEventListener("click", () => {
  const nav = document.querySelector("nav");

  if (nav) {
    toggleClass(nav, "open");
  }
});

document.querySelectorAll("nav a").forEach((a) => {
  a.addEventListener("click", () =>
    document.querySelector("nav")?.classList.remove("open")
  );
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
    if (this.summary) {
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
    if (!this.summary || !this.content) {
      return;
    }

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${
      this.summary.offsetHeight + (expand ? this.content.offsetHeight : 0)
    }px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: this.animationLength,
        easing: "ease-out",
      }
    );

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(expand);
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;
    this.shrinkOrExpand(false);

    if (this.animation) {
      this.animation.oncancel = () => (this.isClosing = false);
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
      this.animation.oncancel = () => (this.isExpanding = false);
    }
  }

  onAnimationFinish(open: boolean) {
    // Set the open attribute based on the parameter
    if (open) {
      this.el.setAttribute("open", "");
    } else {
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
  container: HTMLElement | null;
  slideshow: HTMLElement | null;
  slides: NodeListOf<HTMLElement> | undefined;
  leftButton: HTMLElement | null;
  currentTitle: HTMLElement | null;
  rightButton: HTMLElement | null;
  transitionSpeed: number;

  indices = {
    prev: -1,
    curr: -1,
    next: -1,
  };

  constructor(container: HTMLElement, transitionSpeed: number) {
    this.container = container;
    this.transitionSpeed = transitionSpeed;
    this.slideshow = container.querySelector(".slideshow");
    this.slides = container.querySelectorAll(".slide");
    this.leftButton = container.querySelector("#left-button");
    this.currentTitle = container.querySelector("#current-title");
    this.rightButton = container.querySelector("#right-button");

    this.leftButton?.addEventListener("click", () => this.clickPrevious());
    this.rightButton?.addEventListener("click", () => this.clickNext());

    if (this.slideshow) {
      this.slideshow.style.width = `${this.slides.length * 100}%`;
    }

    this.createDropdown();
    this.updateSlideIndices();
    this.updateTitle();
  }

  createDropdown() {
    if (!this.container || !this.slides) {
      return;
    }

    const dropdown = this.container.querySelector("#slide-names");

    for (const [idx, slide] of this.slides.entries()) {
      const para = document.createElement("p");
      const name = document.createElement("a");

      para.classList.add("slide-name");

      name.innerText = slide.dataset.title ? slide.dataset.title : "Untitled";
      name.tabIndex = 0;
      name.dataset.slide = `${idx}`;
      name.classList.add("slide-link");
      name.addEventListener("click", () => {
        this.moveTo(idx, true);
        dropdown?.parentElement?.removeAttribute("open");
      });

      para.appendChild(name);
      dropdown?.appendChild(para);
    }
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

  updateTitle() {
    if (!this.slides || !this.currentTitle) {
      return;
    }

    const current = (this.slides[this.indices.curr] as HTMLElement).dataset
      .title;

    this.currentTitle.innerHTML = `<span>${
      current ? current : "Untitled"
    }</span>`;
  }

  moveTo(slideIndex: number, forceUpdate: boolean = false) {
    if (!this.slides || !this.slideshow) {
      return;
    }

    const currSlide = this.slides[this.indices.curr];
    const newSlide = this.slides[slideIndex];

    if (reducedMotion) {
      this.slideshow.style.left = `-${slideIndex * 100}%`;
      currSlide.classList.remove("current");
      newSlide.classList.add("current");

      if (forceUpdate) {
        this.updateSlideIndices();
        this.updateTitle();
      }
    } else {
      const animation = new Animation(
        new KeyframeEffect(
          this.slideshow,
          {
            transform: `translateX(-${
              (slideIndex / this.slides.length) * 100
            }%)`,
          },
          { duration: this.transitionSpeed, fill: "forwards" }
        )
      );

      animation.addEventListener("finish", () => {
        currSlide.classList.remove("current");
        newSlide.classList.add("current");

        if (forceUpdate) {
          this.updateSlideIndices();
          this.updateTitle();
        }
      });

      animation.play();
    }
  }

  clickPrevious() {
    if (!this.slides) {
      return;
    }

    this.indices.prev = getIndex(this.indices.curr, this.slides.length, false);

    this.moveTo(this.indices.prev);

    this.indices.next = this.indices.curr;
    this.indices.curr = this.indices.prev;

    this.indices.prev = getIndex(this.indices.prev, this.slides.length, false);

    this.updateTitle();
  }

  clickNext() {
    if (!this.slides) {
      return;
    }

    this.indices.next = getIndex(this.indices.curr, this.slides.length, true);

    this.moveTo(this.indices.next);

    this.indices.prev = this.indices.curr;
    this.indices.curr = this.indices.next;

    this.indices.next = getIndex(this.indices.next, this.slides.length, true);

    this.updateTitle();
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

  const slideshow = document.querySelector(
    ".slideshow-container"
  ) as HTMLElement;

  if (slideshow) {
    new Slideshow(slideshow, 350);
  }

  const exp: HTMLSpanElement | null = document.querySelector("#experience");

  if (exp) {
    const currentYear = new Date().getFullYear();
    exp.innerText = (currentYear - 2007).toLocaleString();
  }

  const repos: HTMLSpanElement | null = document.querySelector("#repos");

  if (repos) {
    fetch(
      "https://api.github.com/users/abluescarab/repos?type=sources&per_page=1000"
    )
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

  const typing = document.querySelector(".typing") as HTMLElement;

  if (typing && !reducedMotion) {
    const text = typing.innerText;
    const animation = typing.dataset.animation
      ? parseInt(typing.dataset.animation)
      : 1000;
    const delay = typing.dataset.blinkDelay
      ? parseInt(typing.dataset.blinkDelay)
      : 250;

    typing.innerText = "";
    type(typing, text, animation, delay);
  }
});

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const header = document.querySelector(".header-container");

  document.querySelector("nav")?.classList.remove("open");

  for (const section of sections) {
    // includes the header height plus a little extra so current changes
    // partway through the previous section
    const top = section.offsetTop - 125 - (header ? header.scrollHeight : 0);
    const bottom = top + section.scrollHeight;

    if (window.scrollY >= top && window.scrollY <= bottom) {
      document.querySelector("a.current")?.classList.remove("current");
      document
        .querySelector(`a[href='#${section.id}'`)
        ?.classList.add("current");
      break;
    }
  }
});
// #endregion
