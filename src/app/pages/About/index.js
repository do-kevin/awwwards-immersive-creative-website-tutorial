import Page from '../../classes/Pages';

export default class About extends Page {
    constructor() {
        // Passes value to the parent class
        super({
            id: 'about',
            element: '.about',
            elements: {
                navigation: document.querySelector('.navigation'),
                title: '.about__title',
            },
        });
    }
}
