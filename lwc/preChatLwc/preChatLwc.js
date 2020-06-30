import BasePrechat from 'lightningsnapin/basePrechat';
import { api, wire, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import slds from '@salesforce/resourceUrl/SLDS226' // Need to become ideally only resource with minimal CSS needed

//import startChatLabel from '@salesforce/label/c.StartChat';

export default class PreChatLwc extends BasePrechat {
    @api prechatFields;
    @api backgroundImgURL;
    @track fields;
    @track namelist;
    startChatLabel = 'Start Chat';
    defaultRecordId;


    /**
     * Set the button label and prepare the prechat fields to be shown in the form.
     */
    connectedCallback() {
        // this.startChatLabel = startChatLabel;
        // needs promisfying
        loadStyle(this, slds + '/salesforce-lightning-design-system-static-resource-2.12.2/styles/salesforce-lightning-design-system.min.css');

        this.fields = this.prechatFields.map(field => {
            const {type, name, label, value, required, maxLength, className, picklistOptions, isSplitField, isPicklist} = field;
            return {type, name, label, value, required, maxLength, className, picklistOptions, isSplitField, isPicklist};
        });

        this.fields.map(field => {
            field.isSplitField = field.type === 'inputSplitName' ? true : false;
        });

        this.fields.map(field => {
            field.isPicklist = field.type === 'inputSelect' ? true : false;
        });

        this.fields.map(field => {
            field.label = field.label === 'LOB1' ? 'Application' : field.label;
            field.label = field.label === 'Chat Support Type' ? 'What is your query about?' : field.label;
        });

        //TODO: Remove
        this.fields.map(field => {
            console.log(JSON.stringify(field));
        });

        this.namelist = this.fields.map(field => field.name);
        console.log(JSON.stringify(this.namelist));

    }

    /**
     * Focus on the first input after this component renders.
     */
    renderedCallback() {
        this.template.querySelector("lightning-input").focus();
    }

    /**
     * On clicking the 'Start Chatting' button, send a chat request.
     */
    handleStartChat() {
        this.template.querySelectorAll("lightning-input").forEach(input => {
            this.fields[this.namelist.indexOf(input.name)].value = input.value;
        });
        if (this.validateFields(this.fields).valid) {
            this.startChat(this.fields);
        } else {
            // Error handling if fields do not pass validation.
        }
    }
}