import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import "https://unpkg.com/vanilla-colorful?module";
import { styleMap } from 'https://unpkg.com/lit-html/directives/style-map.js?module';
class ColorBlob extends LitElement {

    static get properties() {
        return {
          color: { type: String }
        };
      }

    static get styles() {
        return css`
          :host {
            display: block;
          }

          button {
            border: none;
            width: 30px;
            height: 30px;
            border: solid 2px #ccc;
            background: transparent;
            margin:0;
            background: white;
            padding:0;
          }

          button:active {
              opacity:0.5;
              border: solid 2px #5c5b5b
          }

          .close-button {
              font-weight: 800;
          }

          summary::-webkit-details-marker {
            display:none;
          }
          
          details summary {
            list-style-type:none;
          }

          details > summary + * {
            position: absolute;
            z-index: 1;
            padding: 10px;
            background: white;
        }

        details {
            display: inline;
            position: relative;
        }

        details > summary + * {
            left: 0.5rem;
            bottom: 50%;
            transform: translateY(50%);
        }
        `;
    }

    _dismissPicker(e) {
        const detailsContent = this.shadowRoot.querySelector('details > summary + *');
        const details = this.shadowRoot.querySelector('details');
        const openButton = details.querySelector('summary button');
        const composedTarget = e.composedPath();
        if(details.open && detailsContent) {
            if(!composedTarget.includes(this.shadowRoot.host)) {
                details.open = false;
            }
        }
    }

    constructor() {
       super();
       this.__dismissPicker = this._dismissPicker.bind(this);
       this.__onKeyEscape = this._onKeyEscape.bind(this);
    }

    _onKeyEscape(e) {
        if(e.which === 27){
            const details = this.shadowRoot.querySelector('details');
            details.open = false;
        }
    }

    async disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.__dismissPicker);
        document.removeEventListener('keydown', this.__onKeyEscape);
    }
    async connectedCallback() {
      super.connectedCallback();
      document.addEventListener('keydown', this.__onKeyEscape);
      document.addEventListener('click', this.__dismissPicker)
    }

    _showPickColor() {
        this.shadowRoot.querySelector("details").open =  !this.shadowRoot.querySelector("details").open;
    }

    _colorPickerChanged(e)  {
        const color = e.detail.value;
        let event = new CustomEvent("color-change", {
            detail: {
              color
            },
            bubbles: true,
            composed: true,
          });
          this.dispatchEvent(event);
        this.color = color;
    }
    render() {
        return html`
        <details class="picker-area">
            <summary>
            <button style=${styleMap({
            background: this.color
            })} aria-label="Choose color" @click=${this._showPickColor}></button>
            </summary>
            <hex-color-picker @color-changed=${this._colorPickerChanged} color="${this.color}"></hex-color-picker>
        </details>
        `
    }
}

customElements.define('color-blob', ColorBlob);