import { Mesh, Program, Texture } from 'ogl';
import GSAP from 'gsap';

import vertex from '../../shaders/plane-vertex.glsl?raw';
import fragment from '../../shaders/plane-fragment.glsl?raw';

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
        console.log('hit');
        this.texture = new Texture(this.gl);

        console.log('element: ', this.element);

        this.image = new window.Image();
        this.image.crossOrigin = 'anonymous';
        this.image.src = this.element.getAttribute('data-src');
        this.image.onload = (_) => (this.texture.image = this.image);
    }

    createProgram() {
        console.log('texture: ', this.texture);

        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: {
                    value: this.texture,
                },
            },
        });
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program,
        });

        this.mesh.setParent(this.scene);

        this.mesh.position.x += this.index * this.mesh.scale.x;

        this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
    }

    createBounds({ sizes }) {
        this.sizes = sizes;
        this.bounds = this.element.getBoundingClientRect();

        this.updateScale(sizes);
        this.updateX();
        this.updateY();
        console.log(this.bounds);
    }

    // Events

    onResize(sizes, scroll) {
        this.extra = {
            x: 0,
            y: 0,
        };

        this.createBounds(sizes);

        this.updateX(scroll ? scroll.x : 0);
        this.updateY(scroll ? scroll.y : 0);
    }

    // Loop

    updateScale({ height, width }) {
        // window.innerWidth wouldn't do that much performance impact, but if you want optimize further we pass it from parent
        this.height = this.bounds.height / window.innerHeight;
        this.width = this.bounds.width / window.innerWidth;

        this.mesh.scale.x = this.sizes.width * this.width;
        this.mesh.scale.y = this.sizes.height * this.height;
    }

    updateX(x = 0) {
        this.x = (this.bounds.left + x) / window.innerWidth;

        // Making the images at "(0, 0)" relative to the viewport + using bounds and stuff to have them match the webgl images
        this.mesh.position.x = -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width + this.extra.x;
    }

    updateY(y = 0) {
        this.y = (this.bounds.top + y) / window.innerHeight;
        this.mesh.position.y =
            this.sizes.height / 2 - this.mesh.scale.y / 2 - this.y * this.sizes.height + this.extra.y;
    }

    update(scroll) {
        if (!this.bounds) {
            return null;
        }

        this.updateX(scroll.x);
        this.updateY(scroll.y);
    }
}
