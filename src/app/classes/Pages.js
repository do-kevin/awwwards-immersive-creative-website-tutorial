import GSAP from 'gsap';
import each from 'lodash/each';

import Prefix from 'prefix';
import Title from '../animations/Title';
import map from 'lodash/map';
import Paragraph from '../animations/Paragraph';
import Label from '../animations/Label';
import Highlight from '../animations/Highlight';

import AsyncLoad from '../classes/AsyncLoad';

import { ColorsManager } from '../classes/Colors';

export default class Page {
    constructor({ id, element, elements }) {
        this.selector = element;
        this.selectorChildren = {
            ...elements,
            animationsHighlights: '[data-animation="highlight"]',
            animationsLabels: '[data-animation="label"]',
            animationsParagraphs: '[data-animation="paragraph"]',
            animationsTitles: '[data-animation="title"]',
            preloaders: '[data-src]',
        };

        this.id = id;

        this.transformPrefix = Prefix('transform');
    }

    create() {
        this.element = document.querySelector(this.selector);
        this.elements = {};

        this.scroll = {
            current: 0,
            target: 0,
            last: 0,
            limit: 0,
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
        });

        this.createAnimations();
        this.createPreloader();
    }

    createAnimations() {
        this.animations = [];

        // Highlights
        this.animationsTitles = map(this.elements.animationsHighlights, (element) => {
            return new Highlight({
                element,
            });
        });

        this.animations.push(...this.animationsTitles);

        // Titles
        this.animationsTitles = map(this.elements.animationsTitles, (element) => {
            return new Title({
                element,
            });
        });

        this.animations.push(...this.animationsTitles);

        // Paragraphs
        this.animationsParagraphs = map(this.elements.animationsParagraphs, (element) => {
            return new Paragraph({
                element,
            });
        });

        this.animations.push(...this.animationsParagraphs);

        // Label
        this.animationsLabels = map(this.elements.animationsLabels, (element) => {
            return new Label({
                element,
            });
        });

        this.animations.push(...this.animationsLabels);
    }

    createPreloader() {
        this.preloaders = map(this.elements.preloaders, (element) => {
            return new AsyncLoad({ element });
        });
    }

    // Animations
    show() {
        return new Promise((resolve) => {
            ColorsManager.change({
                backgroundColor: this.element.getAttribute('data-background'),
                color: this.element.getAttribute('data-color'),
            });

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
            this.destroy();

            this.animationOut = GSAP.timeline();

            GSAP.to(this.element, {
                autoAlpha: 0,
                onComplete: resove,
            });
        });
    }

    // events

    onResize() {
        if (this.elements.wrapper) {
            this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
        }

        each(this.animations, (animation) => animation.onResize());
    }

    onWheel({ pixelY }) {
        this.scroll.target += pixelY;
    }

    // loops
    update() {
        this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target);

        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1);

        if (this.scroll.current < 0.01) {
            this.scroll.current = 0;
        }

        if (this.elements.wrapper) {
            this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`;
        }
    }

    // Listeners
    addEventListeners() {}

    removeEventListeners() {}

    // Destroy
    destroy() {
        this.removeEventListeners();
    }
}
