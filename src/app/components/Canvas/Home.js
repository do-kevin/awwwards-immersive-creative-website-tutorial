import { Plane, Transform } from 'ogl';
import GSAP from 'gsap';

import map from 'lodash/map';

import Media from './Media';

// import { lerp } from '../../utils/math';

export default class {
    constructor({ gl, scene, sizes }) {
        this.gl = gl;
        this.group = new Transform();
        this.sizes = sizes;

        this.mediasElements = document.querySelectorAll('.home__gallery__media__image');

        this.createGeometry();
        this.createGallery();

        this.group.setParent(scene);

        this.x = {
            current: 0,
            target: 0,
            lerp: 0.1,
        };

        this.y = {
            current: 0,
            target: 0,
            lerp: 0.1,
        };

        this.scrollCurrent = {
            x: 0,
            y: 0,
        };

        this.scroll = {
            x: 0,
            y: 0,
        };
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createGallery() {
        console.log('medias: ', this.group);

        this.medias = map(this.mediasElements, (element, index) => {
            return new Media({
                element,
                geometry: this.geometry,
                index,
                gl: this.gl,
                scene: this.group,
                sizes: this.sizes,
            });
        });
    }

    // Events

    onResize(event) {
        map(this.medias, (media) => media.onResize(event));
    }

    onTouchDown({ x, y }) {
        this.scrollCurrent.x = this.scroll.x;
        this.scrollCurrent.y = this.scroll.y;
    }

    onTouchMove({ x, y }) {
        const xDistance = x.start - x.end;
        const yDistance = y.start - y.end;

        // BUG: images are moving as the cursor is hovering, not dragging.
        this.x.target = this.scrollCurrent.x - xDistance;
        this.y.target = this.scrollCurrent.y - yDistance;

        console.log('distance: ', xDistance, yDistance);
    }

    onTouchUp({ x, y }) {}

    // Update

    update() {
        this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp);
        this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp);

        this.scroll.x = this.x.current;
        this.scroll.y = this.y.current;

        map(this.medias, (media) => {
            media.update(this.scroll);
        });
    }
}
