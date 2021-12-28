import { html, css, LitElement } from "lit";

export class GriffSelect extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 0.5rem;
        color: var(--griff-select-color, #233241);
        --griff-select-highlight: #1473e6;
      }

      ::slotted(select) {
        line-height: 1.29;
        background-color: var(--griff-select-background, #fdfdfd);
        cursor: pointer;
        border: 1px solid var(--griff-border-color, #f5f5f5);
        border-radius: 0.2rem;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        outline-offset: 3px;
        outline: solid 3 px transparent;
        text-overflow: ellipsis;
        width: 100%;
        height: 100%;
        padding: 0 2rem 0 1rem;
        font-weight: 600;
        color: var(--griff-select-color, #233241);
      }

      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host([disabled]) ::slotted(select) {
        cursor: not-allowed;
      }

      ::slotted(select:focus) {
        outline-color: var(--griff-select-outline-color, #1473e6);
      }

      .select-wrap {
        position: relative;
        display: inline-block;
        width: 14rem;
        min-width: min(90vw, 8rem);
        max-width: 28rem;
        height: 2.4rem;
      }

      svg {
        pointer-events: none;
        width: 1rem;
        z-index: 2;
        position: absolute;
        top: 0;
        height: 100%;
        right: 1rem;
        fill: var(--griff-select-outline-color, #1473e6);
        transition: transform 0.15s cubic-bezier(0.1, 0.46, 1, 0.54);
      }

      :host([disabled]) svg {
        fill: var(--griff-select-disabled-color, #ccc);
      }

      :host([opened]) svg {
        transform: rotate(90deg);
      }
    `;
  }

  static get properties() {
    return {
      placeholder: { type: String },
      value: { type: String },
      opened: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this._options = [];
    this.placeholder = "Choose an option";
    this.value = "";
    this._select = null;
    this.disabled = false;
    this.opened = false;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  updated(changedProperties) {
    const newValue = changedProperties.get("value");
    if (newValue && this._select) {
      this._select.value = this.value;
      if (!this._select.value) {
        this._select.value = "placeholder";
      }
    }
  }

  _onSlotChange(e) {
    const childNodes = e.target.assignedNodes({ flatten: true });
    const select = Array.prototype.find.call(childNodes, (node) => {
      return node.nodeName === "SELECT";
    });
    if (select && select !== this._select) {
      this._select = select;
      select.addEventListener("focus", this._onOpen.bind(this));
      select.addEventListener("change", this._onClose.bind(this));
      select.addEventListener("blur", this._onClose.bind(this));
      if (this.value) {
        select.value = this.value;
      }
      const placeHolderOpt = select.querySelector(
        'option[value="placeholder"]'
      );
      const hasOpt = select.querySelector("option");

      if (!placeHolderOpt) {
        const option = document.createElement("option");
        option.value = "placeholder";
        option.disabled = true;
        if (!this.value) {
          option.selected = true;
        }
        option.textContent = this.placeholder;
        this.requestUpdate();
        select.prepend(option);
      }
      if (!hasOpt || (placeHolderOpt && placeHolderOpt !== hasOpt)) {
        this.disabled = true;
        select.disabled = true;
      }

      if (!select.value) {
        select.value = "placeholder";
      }
    }
  }

  _onOpen() {
    if (!this.disabled) {
      this.opened = true;
    }
  }

  _onClose() {
    if (!this.disabled) {
      this.opened = false;
    }
  }

  render() {
    return html`
      <div class="select-wrap">
        <slot @slotchange=${this._onSlotChange}></slot>
        <svg role="button" viewBox="0 0 292.362 292.362">
          <path
            d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424
            C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428
            s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"
          />
        </svg>
      </div>
    `;
  }
}
