/*
    Description    PreChat implementation (override)
    History
    30/06/2020     SF/JEBU Created
                   https://imcdgroup.atlassian.net/browse/SFDP-7330
*/

import BasePrechat from 'lightningsnapin/basePrechat';
import { api, wire, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import slds from '@salesforce/resourceUrl/SLDS226'
import LABEL_START_CHAT from '@salesforce/label/c.IMCD_WebChat_StartChat';
import LABEL_LOB1 from '@salesforce/label/c.IMCD_WebChat_Lob1';
import LABEL_CHAT_TYPE from '@salesforce/label/c.IMCD_WebChat_ChatSupportType';
import LABEL_HEADER from '@salesforce/label/c.IMCD_WebChat_ChatHeader';
import LOGO_IMCD from '@salesforce/resourceUrl/ImcdLogoTransparent';

export default class PreChatLwc extends BasePrechat {
    @api prechatFields;
    @api backgroundImgURL;
    @track _fields;
    @track _namelist;
    _labelStartChat = LABEL_START_CHAT;
    _logoImcd = LOGO_IMCD;
    _labelChatHeader = LABEL_HEADER

    /**
     *    First load the SLDS style, next setup the prechat form
     */
    connectedCallback() {
        loadStyle(this, slds + '/salesforce-lightning-design-system-static-resource-2.12.2/styles/salesforce-lightning-design-system.min.css')
            .then(() => this._setupPrechat())
            .catch(error => console.error(error.body.message))
    }

    /**
     * Focus on the first input after this component renders.
     */
    renderedCallback() {
        let firstElemement = this.template.querySelector("lightning-input");
        if (firstElemement !== null) {
            this.template.querySelector("lightning-input").focus();
        }
    }

    /**
     *     Main method to setup the prechat form
     */
    _setupPrechat() {
        this._fields = this.prechatFields.map(field => {
            const {type, name, label, value, required, maxLength, className, picklistOptions, isSplitField, isPicklist} = field;
            return {type, name, label, value, required, maxLength, className, picklistOptions, isSplitField, isPicklist};
        });

        this._fields.map(field => {
            field.isSplitField = field.type === 'inputSplitName' ? true : false;
        });

        this._fields.map(field => {
            field.isPicklist = field.type === 'inputSelect' ? true : false;
        });

        this._fields.map(field => {
            field.label = field.label === 'LOB1' ? LABEL_LOB1 : field.label;
            field.label = field.label === 'Chat Support Type' ? LABEL_CHAT_TYPE : field.label;
        });

        this._namelist = this._fields.map(field => field.name);
    }

    _verifyInputs(fields) {
        let validInputs = true;

        this._fields.map(field => {
            if (field.required) {
                if (field.value === null) {
                    validInputs = false;
                }
            }
        });

        return validInputs;
    }

    /**
     * On clicking the 'Start Chatting' button, send a chat request.
     */
    _handleStartChat() {

        // Copy fields from inputs
        this.template.querySelectorAll("lightning-input,lightning-combobox").forEach(input => {
            this._fields[this._namelist.indexOf(input.name)].value = input.value;
        });

        // Verify requiredness
        if ( !this._verifyInputs(this._fields) ) {
            return;
        }

        // Validating fields (standard BasePreChat method)
        if (this.validateFields(this._fields).valid) {
            this.startChat(this._fields);
        } else {
            return;
        }
    }
}