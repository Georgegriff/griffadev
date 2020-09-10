import { LitElement, html, css, customElement, property } from 'lit-element';

const collectInnerText = (slotsArray) => {
   return Array.isArray(slotsArray) && slotsArray.reduce((str, curr)=> {
        const txt = curr.innerText;
        return `${str}${txt}`;
    }, '');
}
export class LiveDemo extends LitElement {

    constructor() {
        super();
        this.hideText="Close";
        this.showText="Demo";
        this.toggled = false;
    }

    static get styles() {
        return css`
        :host {
            display:flex;
            flex-direction:column;
            position:relative;
            perspective: 500px;
            will-change: transform;

        }

        button {
            justify-content: flex-end;
            align-self: flex-end;
            background: var(--Primary);
            color: var(--Background);
            font-size: 1rem;
            font-weight:600;
            padding: .25rem 1.5rem;
            border-radius: .25rem;
            transition: transform 150ms ease-out;
            bottom: 1.1rem;
            border:none;
            cursor:pointer;
            margin:1rem;
            z-index:1;
        }

        button:active {
            background:var(--Primary50);
        }

        :host([toggled]) .demo {
            transform: rotateX(180deg);
        }

        .demo {
            position: relative;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            flex:1;
            transform-style: preserve-3d;
            transition: all 0.45s ease-in-out;
            will-change:transform;
        }

        .demo-front,
        .demo-back {
        backface-visibility: hidden;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: var(--Background);
        }

        .demo-back {
            background: var(--Secondary);
            transform: rotateX(180deg);
        }
        `
    }

    static get properties() {
        return { 
          hideText: {type: String},
          showText: {type: String},
          toggled: {type: Boolean, reflect: true}
        };
    }

    toggle = () => {
        this.toggled = !this.toggled;

        if(this.toggled) {
            const html = collectInnerText(this.shadowRoot.querySelector('slot[name="html"]').assignedNodes({flatten: false}));
            const css = collectInnerText(this.shadowRoot.querySelector('slot[name="css"]').assignedNodes({flatten: false}));
            const wrappedCss = css ?`<style>${css}</style>`: '';
            this.shadowRoot.querySelector('.code-exe').innerHTML = `${wrappedCss}${html}`;
        } else {
            setTimeout(() => {
                this.shadowRoot.querySelector('.code-exe').innerHTML = '';
            }, 600)
        }
    }

    // Implement `render` to define a template for your element.
    render() {
        return html`
            
        
            <div class="demo">
                <div aria-hidden="${this.toggled}" class="demo-front">
                    <slot name="css"></slot>
                    <slot name="html"></slot>
                    <slot name="js"></slot>
                </div>
                <div aria-hidden="${!this.toggled}" class="demo-back code-exe"></div>
            </div>
            <button @click="${this.toggle}">${!this.toggled ? this.showText : this.hideText}</button>
            `
    }
}