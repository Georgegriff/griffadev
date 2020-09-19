import { LitElement, html, css, customElement, property } from "lit-element";
import { render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

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
    this.hideText = "Close";
    this.showText = "Demo";
    this.toggled = false;
    this.selected = "html";
    this.languageOptions = [];
  }

  static get styles() {
    return css`
        :host {
            display:flex;
            flex-direction:column;
            position:relative;
            perspective: 500px;
            will-change: transform;
            flex:1;
            margin:1rem 0rem;
            min-height: 30rem;
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
            will-change:transform
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

        .css,.html.js {
            height: 100%;
            width: 100%;
        }

        .controls {
          display:flex;
          background: var(--Secondary);
          padding:0.5rem;
          align-items:  center;
        }

        griff-select {
          --griff-select-color: var(--Text);
          --griff-select-background: var(--Background);
          --griff-select-outline-color: var(--Primary);
          --griff-border-color:  var(--Background50);
          height:2.33rem;
        }

        button {
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
            z-index:1;
            margin:0.5rem;
            height:2.33rem;
            margin-left: auto;
        }
        .demo-front > div {
          opacity:1;
          transition: opacity 0.3s ease-in-out;
        }
        .demo-front div[aria-hidden="true"] {
          opacity:0;
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

        `;
  }

  static get properties() {
    return {
      hideText: { type: String },
      showText: { type: String },
      toggled: { type: Boolean, reflect: true },
      selected:{type: String}
    };
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
      const allCode = `${imports}
            (async () => {
                try {
                    ${code}
                } catch(e) {
                    console.error(e);
                }
            })();`;
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
  };

  optionChange(e) {
    this.selected = e.target.value;
  }

  _onSlotChange(e) {
    const slot = e.target;
    const lang = e.target.name;
    const children = slot.assignedNodes({ flatten: true });
    if(children.length) {
      this.languageOptions = [...this.languageOptions, lang];
      this.requestUpdate();
    }
  }

  // Implement `render` to define a template for your element.
  render() {
    return html`
      <div @slotchange=${this._onSlotChange}  class="demo">
        <div aria-hidden="${this.toggled}" class="demo-front">
            <div aria-hidden="${this.selected !== "html"}" ><slot name="html"></slot></div>
            <div aria-hidden="${this.selected !== "css"}" ><slot name="css"></slot></div>
            <div aria-hidden="${this.selected !== "js"}" ><slot name="js"></slot></div>
        </div>
        <div aria-hidden="${!this.toggled}" class="demo-back code-exe"></div>
      </div>
      <div class="controls">
        <griff-select placeholder="Select language" value="${this.selected}">
          <select @change="${this.optionChange}">
              ${this.languageOptions.map((lang) => html`<option value="${lang}">${lang.toUpperCase()}</option>`)}
          </select>
        </griff-select>
        <button @click="${this.toggle.bind(this)}">
          ${!this.toggled ? this.showText : this.hideText}
        </button>
      </div>
    `;
  }
}
