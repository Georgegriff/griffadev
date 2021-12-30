import { LitElement, html, css } from "lit";
export { CopyComponent } from "copy-component/CopyComponent";

export class CopyToClipboard extends LitElement {
  constructor() {
    super();
    this._copyText = "Copy text";
    this._copiedText = "Copied";
    this._copyFailed = "Failed! 😞";
    this.copyText = this._copyText;
  }
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.5rem;
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
        text-transform: uppercase;
        background: var(--Primary);
        color: var(--Background);
        font-size: 0.875rem;
        font-weight: 600;
        padding: 0.25rem 1.5rem;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0;
        border: none;
        cursor: pointer;
        z-index: 1;
        height: var(--button-height);
        margin-left: auto;
        text-transform: uppercase;
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
        margin: 0 !important;
        height: 100%;
        padding-bottom: calc(var(--button-height) + 1rem) !important;
      }
    `;
  }

  _onCopy() {
    this.copyText = this._copiedText;
    this.requestUpdate();
  }

  _onCopyFailed() {
    this.copyText = this._copyFailed;
    this.requestUpdate();
  }

  render() {
    return html`
      <copy-to-clipboard-copy
        @copy=${this._onCopy.bind(this)}
        @copy-failed=${this._onCopyFailed.bind(this)}
      >
        <slot></slot>
        <button
          slot="button"
          class="floating-btn"
          aria-label="Copy to clipboard"
        >
          ${this.copyText}
        </button>
      </copy-to-clipboard-copy>
    `;
  }
}
