import GSAP from 'gsap';
import Animation from '../classes/Animation';
import { split, calculate } from '../utils/text';
import each from 'lodash/each';

export default class Label extends Animation {
    constructor({ element, elements }) {
        super({
            element,
            elements,
        });

        split({
            element: this.element,
            append: true,
        });

        split({
            element: this.element,
            append: true,
        });

        this.elementLinesSpans = this.element.querySelectorAll('span span');
    }

    animateIn() {
        this.timelineIn = GSAP.timeline({
            delay: 0.5,
        });

        this.timelineIn.set(this.element, { autoAlpha: 1 });

        each(this.elementsLines, (line, index) => {
            this.timelineIn.fromTo(
                line,
                { y: '100%' },
                {
                    delay: index * 0.2,
                    duration: 1.5,
                    y: '0%',
                    ease: 'expo.out',
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
