import { LitElement, html, css, customElement, property } from "lit-element";
import { render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { querySelectorAllDeep } from "query-selector-shadow-dom";
import { querySelectorDeep } from "query-selector-shadow-dom";
import { closeIcon, expandIcon } from "./icons.js";

const collectInnerText = (slotsArray) => {
  return (
    Array.isArray(slotsArray) &&
    slotsArray.reduce((str, curr) => {
      const txt = curr.innerText;
      return `${str}${txt}`;
    }, "")
  );
};

const _splitImports = (jsString) => {
  const lines = (jsString || "").split("\n");
  return lines.reduce(
    ([imports, code], current) => {
      if (
        current.match(/import.{1,}from/g) ||
        current.match(/export.{1,}from/g)
      ) {
        imports += current;
      } else {
        code += current;
      }
      return [imports, code];
    },
    ["", ""]
  );
};

export class LiveDemo extends LitElement {
  constructor() {
    super();
    this.hideText = "Code";
    this.showText = "Demo";
    this.minimizeText = "Minimize";
    this.maximizeText = "Maximize";
    this.toggled = false;
    this.selected = "";
    this.languageOptions = [];

    window.querySelectorShadowDom = {
      querySelectorAll: querySelectorAllDeep,
      querySelector: querySelectorDeep,
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        perspective: 500px;
        will-change: transform;
        flex: 1;
        margin: 1rem 0rem;
        min-height: 30rem;
        overflow: hidden;
        height: 30rem;
      }

      button:active {
        background: var(--Primary50);
      }

      :host([toggled]) .demo {
        transform: rotateX(180deg);
      }

      .demo {
        position: relative;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        flex: 1;
        transform-style: preserve-3d;
        transition: all 0.45s ease-in-out;
        will-change: transform;
      }

      .demo-front,
      .demo-back {
        backface-visibility: hidden;
        overflow: auto;
        background: var(--Secondary);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .demo-back {
        background: var(--Background50);
        transform: rotateX(180deg);
      }

      .css,
      .html.js {
        height: 100%;
        width: 100%;
      }

      .controls {
        display: flex;
        background: var(--Secondary);
        padding: 0.5rem;
        align-items: center;
      }

      griff-select {
        --griff-select-color: var(--Text);
        --griff-select-background: var(--Background);
        --griff-select-outline-color: var(--Primary);
        --griff-border-color: var(--Background50);
        height: 2.33rem;
      }

      button {
        font-family: inherit;
        background: var(--Primary);
        color: var(--Background);
        font-size: 1rem;
        font-weight: 600;
        padding: 0.25rem 1.5rem;
        border-radius: 0.25rem;
        transition: transform 150ms ease-out;
        bottom: 1.1rem;
        border: none;
        cursor: pointer;
        z-index: 1;
        margin: 0.5rem;
        height: 2.33rem;
        margin-left: auto;
      }
      .demo-front > div {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
        height: 100%;
        display: flex;
      }
      .demo-front div[aria-hidden="true"] {
        opacity: 0;
        border: 0;
        clip: rect(0 0 0 0);
        height: auto;
        margin: 0;
        overflow: hidden;
        padding: 0;
        position: fixed;
        width: 1px;
        white-space: nowrap;
      }

      .push {
        flex: 1;
        display: flex;
      }
      .icon-btn {
        background: none;
        border: none;
        display: flex;
        padding: 0;
        margin: 0;
        justify-content: flex-end;
        align-items: center;
        margin-right: 1rem;
        fill: var(--Primary);
        height: 2rem;
        width: auto;
      }

      :host([expanded]) {
        z-index: 100000 !important;
        position: fixed;
        top: 0;
        left: 2.5%;
        right: 0;
        bottom: 0;
        height: 95% !important;
        width: 95% !important;
        border: solid 2px var(--Primary);
        pointer-events: all !important;
      }
    `;
  }

  static get properties() {
    return {
      hideText: { type: String },
      showText: { type: String },
      minimizeText: { type: String },
      maximizeText: { type: String },
      toggled: { type: Boolean, reflect: true },
      selected: { type: String },
      expanded: { type: Boolean, reflect: true },
    };
  }

  toggleFullScreen() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      document.body.classList.add("live-demo-toggled");
    } else {
      document.body.classList.remove("live-demo-toggled");
    }
  }

  toggle() {
    this.toggled = !this.toggled;

    if (this.toggled) {
      const htmlContent = collectInnerText(
        this.shadowRoot
          .querySelector('slot[name="html"]')
          .assignedNodes({ flatten: false })
      );
      const css = collectInnerText(
        this.shadowRoot
          .querySelector('slot[name="css"]')
          .assignedNodes({ flatten: false })
      );
      const js = collectInnerText(
        this.shadowRoot
          .querySelector('slot[name="js"]')
          .assignedNodes({ flatten: false })
      );
      const [imports, code] = _splitImports(js);
      this.querySelectorDeep = querySelectorDeep;
      this.querySelectorAllDeep = querySelectorAllDeep;
      window.__liveDemoRef = this;
      const allCode = `${imports}
            (async function () {
                try {
                    const handler = {
                      get: (target, prop) => {
                        if(prop === "addEventListener") {
                          return (...args) => {
                            return this.addEventListener(...args);
                          }
                        } else if(prop === "querySelector") {
                          return (...args) => {
                            return this.querySelectorDeep(...args);
                          }
                        } else if(prop === "querySelectorAll") {
                          return (...args) => {
                            return this.querySelectorAllDeep(...args);
                          };
                        } else if(prop === "getElementById") {
                          return (...args) => {
                            const [query, ...rest] = [...args];
                            return this.querySelectorDeep(\`#\$\{query\}\`, ...rest);
                          };
                        } else if(typeof(target[prop]) === "function") {
                          return (...args) => {
                            return target[prop](...args);
                          };
                        } else {
                          return target[prop];
                        }
                      }
                    }
                    const document = new Proxy(window.document, handler);
                  
                    ${code}
                } catch(e) {
                    console.error(e);
                }
            }.bind(window.__liveDemoRef))();`;
      const script = document.createElement("script");
      script.textContent = allCode;
      script.type = "module";
      const content = () => html`
        <style>
          ${css}
        </style>
        ${unsafeHTML(htmlContent)} ${script}
      `;
      try {
        this.shadowRoot
          .querySelector(".code-exe")
          .attachShadow({ mode: "open" });
      } catch (e) {
        // shush
      }
      render(content(), this.shadowRoot.querySelector(".code-exe").shadowRoot);
    } else {
      setTimeout(() => {
        render("", this.shadowRoot.querySelector(".code-exe"));
      }, 600);
    }
  }

  optionChange(e) {
    this.selected = e.target.value;
  }

  _onSlotChange(e) {
    const slot = e.target;
    const lang = e.target.name;
    const children = slot.assignedNodes({ flatten: true });
    if (children.length) {
      this.languageOptions = [...this.languageOptions, lang];
      const innerText = collectInnerText(children);

      if (innerText.length) {
        if (!this.selected) {
          this.selected = lang;
        }
      }

      this.requestUpdate();
    }
  }

  // Implement `render` to define a template for your element.
  render() {
    return html`
      <div @slotchange=${this._onSlotChange} class="demo">
        <div aria-hidden="${this.toggled}" class="demo-front">
          <div aria-hidden="${this.selected !== "css"}">
            <copy-to-clipboard button-float="false"
              ><slot name="css"></slot
            ></copy-to-clipboard>
          </div>
          <div aria-hidden="${this.selected !== "html"}">
            <copy-to-clipboard button-float="false"
              ><slot name="html"></slot
            ></copy-to-clipboard>
          </div>
          <div aria-hidden="${this.selected !== "js"}">
            <copy-to-clipboard button-float="false"
              ><slot name="js"></slot
            ></copy-to-clipboard>
          </div>
        </div>
        <div aria-hidden="${!this.toggled}" class="demo-back code-exe"></div>
      </div>
      <div class="controls">
        <griff-select placeholder="Select language" value="${this.selected}">
          <select @change="${this.optionChange}">
            ${this.languageOptions.map(
              (lang) =>
                html`<option value="${lang}">${lang.toUpperCase()}</option>`
            )}
          </select>
        </griff-select>
        <span class="push"></span>
        <button
          class="icon-btn"
          @click="${this.toggleFullScreen.bind(this)}"
          title=${!this.expanded ? this.minimizeText : this.maximizeText}
          aria-label=${!this.expanded ? this.minimizeText : this.maximizeText}
        >
          ${!this.expanded ? expandIcon : closeIcon}
        </button>
        <button @click="${this.toggle.bind(this)}">
          ${!this.toggled ? this.showText : this.hideText}
        </button>
      </div>
    `;
  }
}
