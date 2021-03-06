import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {areEqual} from './utility';
import {ContactUpdated,ContactViewed} from './messages';

interface Contact {
    firstName: string;
    lastName: string;
    email: string;
}

@inject(WebAPI, EventAggregator)
export class ContactDetail {
    private routeConfig;
    private contact: Contact;
    private originalContact: Contact;

    constructor(private api: WebAPI, private ea: EventAggregator) { }

    activate(params, routeConfig) {
        this.routeConfig = routeConfig;

        return this.api.getContactDetails(params.id).then((contact: Contact) => {
            this.contact = contact;
            this.routeConfig.navModel.setTitle(this.contact.firstName);
            this.originalContact = JSON.parse(JSON.stringify(this.contact));
            this.ea.publish(new ContactViewed(contact))
        });
    }

    get canSave() {
        return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
    }

    save() {
        this.api.saveContact(this.contact).then((contact: Contact) => {
            this.contact = contact;
            this.routeConfig.navModel.setTitle(this.contact.firstName);
            this.originalContact = JSON.parse(JSON.stringify(contact));
            this.ea.publish(new ContactUpdated(this.contact));
        });
    }

    canDeactivate() {
        if (!areEqual(this.originalContact, this.contact)) {
            let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

            if(!result){
                this.ea.publish(new ContactViewed(this.contact));
            }
            return result;
        }

        return true;
    }
}