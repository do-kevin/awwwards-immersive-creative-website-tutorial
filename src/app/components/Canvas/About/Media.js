import { Mesh, Program, Texture } from 'ogl';
import GSAP from 'gsap';

import vertex from '../../../shaders/plane-vertex.glsl?raw';
import fragment from '../../../shaders/plane-fragment.glsl?raw';

export default class {
    constructor({ element, geometry, gl, scene, index, sizes }) {
        this.element = element;
        this.geometry = geometry;
        this.gl = gl;
        this.index = index;
        this.scene = scene;
        this.sizes = sizes;

        this.createTexture();
        this.createProgram();
        this.createMesh();

        this.extra = {
            x: 0,
            y: 0,
        };
    }

    createTexture() {
        this.texture = new Texture(this.gl);

        const image = this.element.querySelector('img');

        this.image = new window.Image();
        this.image.crossOrigin = 'anonymous';
        this.image.src = image.getAttribute('data-src');
        this.image.onload = (_) => (this.texture.image = this.image);
    }

    createProgram() {
        console.log('texture: ', this.texture);

        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                uAlpha: {
                    value: 0,
                },
                tMap: {
                    value: this.texture,
                },
            },
        });
    }

    createMesh() {
        console.log('program: ', this.program);
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program,
        });

        this.mesh.setParent(this.scene);

        this.mesh.position.x += this.index * this.mesh.scale.x;
    }

    createBounds({ sizes }) {
        this.sizes = sizes;

        this.bounds = this.element.getBoundingClientRect();

        this.updateScale(sizes);
        this.updateX();
        this.updateY();
    }

    // Animations
    show() {
        GSAP.fromTo(
            this.program.uniforms.uAlpha,
            {
                value: 0,
            },
            {
                value: 1,
            },
        );
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0,
        });
    }

    // Events

    onResize(sizes, scroll) {
        this.extra = 0;

        this.createBounds(sizes);

        this.updateX(scroll);
        this.updateY(0);
    }

    // Loop

    updateRotation() {
        // Like ProcessingJS range
        this.mesh.rotation.z = GSAP.utils.mapRange(
            -this.sizes.width / 2,
            this.sizes.width / 2,
            Math.PI * 0.1,
            -Math.PI * 0.1,
            this.mesh.position.x,
        );
    }

    updateScale() {
        // window.innerWidth wouldn't do that much performance impact, but if you want optimize further we pass it from parent
        this.height = this.bounds.height / window.innerHeight;
        this.width = this.bounds.width / window.innerWidth;

        this.mesh.scale.x = this.sizes.width * this.width;
        this.mesh.scale.y = this.sizes.height * this.height;

        // const scale = GSAP.utils.mapRange(0, this.sizes.width / 2, 0.1, 0, Math.abs(this.mesh.position.x));

        // this.mesh.scale.x += scale;
        // this.mesh.scale.y += scale;
    }

    updateX(x = 0) {
        this.x = (this.bounds.left + x) / window.innerWidth;

        // Making the images at "(0, 0)" relative to the viewport + using bounds and stuff to have them match the webgl images
        this.mesh.position.x = -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width + this.extra;
    }

    updateY(y = 0) {
        this.y = (this.bounds.top + y) / window.innerHeight;
        this.mesh.position.y = this.sizes.height / 2 - this.mesh.scale.y / 2 - this.y * this.sizes.height;

        // Moving position of y based on rotation
        this.mesh.position.y += Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 - 40;
    }

    update(scroll) {
        if (!this.bounds) {
            return null;
        }

        this.updateRotation();
        this.updateScale();
        this.updateX(scroll);
        this.updateY(0);
    }
}
