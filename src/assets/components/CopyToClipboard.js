import { LitElement, html, css } from 'lit-element';

const copyText = async (element) => {
   
    // Copy to the clipboard
    if('clipboard' in navigator) {
        try {
            await navigator.clipboard.writeText(element.innerText);
        } catch(err) {
            // Unable to copy
            throw new Error("copy failed");
        }
    } else {
        try {
            document.execCommand('copy');
            const selection = window.getSelection();
    
            // Save the current selection
            const currentRange = selection.rangeCount === 0
                ? null : selection.getRangeAt(0);
        
            // Select the text content of code element
            const range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        
        } catch (err) {
            // Unable to copy
            throw new Error("copy failed");
        } finally {
            // Restore the previous selection
            selection.removeAllRanges();
            currentRange && selection.addRange(currentRange);
        }
    }
 
}


export class CopyToClipboard extends LitElement {
    constructor() {
        super();
        this._copyText = "Copy text";
        this._copiedText = "Copied!";
        this._copyFailed = "Failed! :(";
        this.copyText = this._copyText;
    }
    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                margin-bottom:0.5rem;
                --button-height: 2.33rem;
                position: relative;
                border-bottom: 2px solid var(--Primary);
                max-height: 450px;
                overflow: auto;
            }
            :host([hidden]) {
                display: none;
            }

            :host([button-float="false"]) {
                position: initial;
                width: 100%;
                height: calc(100% - 2px);
            }

            button {
                font-family: inherit;
                background: var(--Primary);
                color: var(--Background);
                font-size: 1rem;
                font-weight:600;
                padding: .25rem 1.5rem;
                border-top-left-radius: .25rem;
                border-top-right-radius: .25rem;
                transition: transform 150ms ease-out;
                border:none;
                cursor:pointer;
                z-index:1;
                height:var(--button-height);
                margin-left: auto;
            }

            button:active {
                background: var(--Primary50);
            }

            .floating-btn {
                position: absolute;
                right: 0;
                bottom: 0;
            }

            ::slotted(*) {
                margin:0 !important;
                height: 100%;
                padding-bottom:calc(var(--button-height) + 1rem) !important;
            }

        
        `
    }

    async copy() {
        const slottedElements = this.shadowRoot.querySelector("slot").assignedNodes({
            flatten: true
        })
        if(slottedElements && slottedElements.length) {
            try {
                await copyText(slottedElements[0]);
                this.copyText = this._copiedText;
            } catch(e) {
                this.copyText = this._copyFailed;
            }
            this.requestUpdate();
        } else {
            console.error('Not slotted elements found to copy.');
        }
    }

    render() {
        return html`
            <slot></slot>
            <button class="floating-btn" @click=${this.copy.bind(this)} aria-label="Copy to clipboard">${this.copyText}</button>
        `;
    }
}
