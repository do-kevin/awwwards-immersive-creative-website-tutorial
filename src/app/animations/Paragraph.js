import GSAP from 'gsap';
import Animation from '../classes/Animation';
import { split, calculate } from '../utils/text';
import each from 'lodash/each';

export default class Paragraph extends Animation {
    constructor({ element, elements }) {
        super({
            element,
            elements,
        });

        this.elementLinesSpans = split({
            element: this.element,
            append: true,
        });

        // Kevin's temp code. Set data-animation on child p tags, but this doesn't seem to account for first textContent word
        this.elementLinesSpans.forEach((span) => {
            if (span.parentElement.tagName === 'P' && !span.parentElement.hasAttribute('data-animation')) {
                span.parentElement.setAttribute('data-animation', 'paragraph');
            }
        });
    }

    animateIn() {
        this.timelineIn = GSAP.timeline({
            delay: 0.5,
        });

        this.timelineIn.set(this.element, { autoAlpha: 1 });

        each(this.elementsLines, (line, index) => {
            this.timelineIn.fromTo(
                line,
                {
                    autoAlpha: 0,
                    y: '100%',
                },
                {
                    autoAlpha: 1,
                    delay: index * 0.2,
                    duration: 1.5,
                    ease: 'expo.out',
                    y: '0%',
                },
                0,
            );
        });
    }
    animateOut() {
        GSAP.set(this.element, {
            autoAlpha: 0,
        });
    }

    onResize() {
        this.elementsLines = calculate(this.elementLinesSpans);
    }
}
