import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
    public router: Router;
    public message: string;

    constructor(config: RouterConfiguration, router: Router) {
        config.title = 'Contacts';
        config.map([
            { route: '',              moduleId: 'no-selection',   title: 'Select'},
            { route: 'contacts/:id',  moduleId: 'contact-detail', name:'contacts' }
        ]);
        this.message = "hello";
        this.router = router;
    }
}
