import { Mesh, Program, Texture } from 'ogl';

import vertex from '../../shaders/plane-vertex.glsl?raw';
import fragment from '../../shaders/plane-fragment.glsl?raw';

export default class {
    constructor({ element, geometry, gl, scene }) {
        this.element = element;
        this.geometry = geometry;
        this.gl = gl;
        this.scene = scene;

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
    }
}
