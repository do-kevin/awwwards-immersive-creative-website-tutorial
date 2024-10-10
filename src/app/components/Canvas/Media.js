import { Mesh, Program, Texture } from 'ogl';

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
    }

    createBounds({ sizes }) {
        this.bounds = this.element.getBoundingClientRect();

        this.updateScale(sizes);
        this.updateX();
        this.updateY();
        console.log(this.bounds);
    }

    updateScale({ height, width }) {
        // window.innerWidth wouldn't do that much performance impact, but if you want optimize further we pass it from parent
        this.height = this.bounds.height / window.innerHeight;
        this.width = this.bounds.width / window.innerWidth;

        this.mesh.scale.x = width * this.width;
        this.mesh.scale.y = height * this.height;

        console.log(this.height, this.width);
    }

    updateX() {}

    updateY() {}

    onResize(sizes) {
        this.createBounds(sizes);
    }
}
