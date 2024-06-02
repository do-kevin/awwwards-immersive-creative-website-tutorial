import GSAP from 'gsap';
import each from 'lodash/each';

export default class Page {
    constructor({ id, element, elements }) {
        this.selector = element;
        this.selectorChildren = { ...elements };
        this.id = id;
    }

    create() {
        this.element = document.querySelector(this.selector);
        this.elements = {};

        this.scroll = {
            current: 0,
            target: 0,
            last: 0,
        };

        each(this.selectorChildren, (entry, key) => {
            if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
                this.elements[key] = entry;
            } else {
                this.elements[key] = document.querySelectorAll(entry);

                if (this.elements[key].length === 0) {
                    this.elements[key] = null;
                } else if (this.elements[key].length === 1) {
                    this.elements[key] = document.querySelector(entry);
                }
            }
            console.log(this.elements[key], entry);
        });

        console.log(this.elements);

        console.log('Create', this.id, this.element);
    }

    show() {
        return new Promise((resolve) => {
            this.animationIn = GSAP.timeline();

            GSAP.fromTo(
                this.element,
                {
                    autoAlpha: 0,
                },
                {
                    autoAlpha: 1,
                },
            );

            this.animationIn.call(() => {
                this.addEventListeners();
                resolve();
            });
        });
    }

    hide() {
        return new Promise((resove) => {
            this.removeEventListeners();

            this.animationOut = GSAP.timeline();

            GSAP.to(this.element, {
                autoAlpha: 0,
                onComplete: resove,
            });
        });
    }

    onMouseWheel(event) {
        console.log(event);

        const { deltaY } = event;

        console.log(deltaY);

        this.scroll.target += deltaY;
    }

    update() {
        console.log(this.scroll.target);

        this.scroll.current = lerp(this.scroll.current, this.scroll.target);
    }

    addEventListeners() {
        window.addEventListener('wheel', this.onMouseWheel);
    }

    removeEventListeners() {
        window.removeEventListener('wheel', this.onMouseWheel);
    }
}
