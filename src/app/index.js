import each from 'lodash/each';
import Preloader from './components/Preloader';

import Canvas from './components/Canvas';

import About from './pages/About';
import Collections from './pages/Collections';
import Detail from './pages/Detail';
import Home from './pages/Home';

import Navigation from './components/Navigation';

class App {
    constructor() {
        this.createContent();

        this.createPreloader();
        this.createNavigation();

        this.createCanvas();

        this.createPages();

        this.addEventListeners();
        this.addLinkListeners();

        this.update();
    }

    createNavigation() {
        console.log('created');
        console.log('test: ', this.template);

        this.navigation = new Navigation({
            template: this.template,
        });
    }

    createPreloader() {
        this.preloader = new Preloader();
        this.preloader.once('completed', this.onPreloaded.bind(this));
    }

    createCanvas() {
        this.canvas = new Canvas();
    }

    createContent() {
        this.content = document.querySelector('.content');
        this.template = this.content.getAttribute('data-template');
    }

    createPages() {
        this.pages = {
            about: new About(),
            collections: new Collections(),
            detail: new Detail(),
            home: new Home(),
        };

        this.page = this.pages[this.template];
        this.page.create();
    }

    /**
     * Events.
     */
    onPreloaded() {
        this.preloader.destroy();
        this.onResize();
        this.page.show();
    }

    onPopState() {
        this.onChange({ url: window.location.pathname, push: false });
    }

    async onChange({ url, push = true }) {
        await this.page.hide();

        const request = await window.fetch(url);

        if (request.status === 200) {
            const html = await request.text();
            const div = document.createElement('div');

            if (push) {
                window.history.pushState({}, '', url);
            }

            div.innerHTML = html;

            const divContent = div.querySelector('.content');

            this.template = divContent.getAttribute('data-template');

            console.log(this.navigation);

            this.navigation.onChange(this.template);

            this.content.setAttribute('data-template', this.template);
            this.content.innerHTML = divContent.innerHTML;

            this.page = this.pages[this.template];
            this.page.create();

            this.onResize();

            this.page.show();

            this.addLinkListeners();
        } else {
            console.log('Error');
        }
    }

    onResize() {
        if (this.canvas && this.canvas.onResize) {
            this.canvas.onResize();
        }

        if (this.page && this.page.onResize) {
            this.page.onResize();
        }
    }

    /**
     * Loop.
     */
    update() {
        if (this.canvas && this.canvas.update) {
            this.canvas.update();
        }

        // Causes multiple animation frames
        if (this.page && this.page.update) {
            this.page.update();
        }

        this.frame = window.requestAnimationFrame(this.update.bind(this));
    }

    /**
     * Listeners.
     */
    addEventListeners() {
        window.addEventListener('popstate', this.onPopState.bind(this));

        window.addEventListener('resize', this.onResize.bind(this));
    }

    addLinkListeners() {
        const links = document.querySelectorAll('a');

        each(links, (link) => {
            link.onclick = (event) => {
                event.preventDefault();

                const { href } = link;

                this.onChange({ url: href });

                console.log(event);
            };
        });
    }
}

new App();
