import GSAP from 'gsap';
import Animation from '../classes/Animation';
import { split, calculate } from '../utils/text';
import each from 'lodash/each';

export default class Title extends Animation {
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
        GSAP.set(this.element, { autoAlpha: 1 });

        each(this.elementsLines, (line, index) => {
            GSAP.fromTo(
                line,
                { y: '100%' },
                {
                    delay: 0.5 + index * 0.2,
                    duration: 1.5,
                    y: '0%',
                    ease: 'expo.out',
                },
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

        console.log(this.elementsLines);
    }
}
