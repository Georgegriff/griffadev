const template = document.createElement("template");
const html = String.raw;
template.innerHTML = html`
  <style>
    :host {
        display: none;
    }
    :host([loading]) {
      display: inline-block;
      position: relative;
      --loader-size: 17px;
      height: var(--loader-size);
      width: calc(var(--loader-size) * 5.2);
      margin: 0 1rem;
    }
    .loader div {
      position: absolute;
      width: var(--loader-size);
      height: var(--loader-size);
      border-radius: 50%;
      background: var(--loader-color, black);
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .loader div:nth-child(1) {
      animation: ellipsis1 0.7s infinite;
    }
    .loader div:nth-child(2) {
      left: calc(var(--loader-size) / 3.5);
      animation: ellipsis2 0.7s infinite;
    }
    .loader div:nth-child(3) {
      left: calc(var(--loader-size) * 2.5);
      animation: ellipsis2 0.7s infinite;
    }
    .loader div:nth-child(4) {
      left: calc(var(--loader-size) * 3.5);
      animation: ellipsis3 0.7s infinite;
    }
    @keyframes ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(calc(var(--loader-size) * 1.75), 0);
      }
    }
  </style>
  <div class="loader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
`;

export class GriffLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'})
        .append(template.content.cloneNode(true));

        this.setLoadingAttributes(this.hasAttribute("loading"));
    }

    get loading() {
        return this.hasAttribute("loading")
    }

    set loading(val) {
        debugger;
        if(val) {
            this.setAttribute("loading", true);
        } else {
            this.removeAttribute("loading")
        }
    }

    static get observedAttributes() { return ['hidden']; }

    setLoadingAttributes = (isVisible) => {
        if(isVisible) {
            this.setAttribute("role", "status");
            this.setAttribute("aria-live", "polite");
            this.setAttribute("aria-label", "Loading");
            this.removeAttribute("aria-hidden")
        } else {
            this.setAttribute("aria-hidden", true);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case "loading":
                if(newValue) {
                    this.setLoadingAttributes(Boolean(newValue))
                }
            break;
            
        }
      }
}
