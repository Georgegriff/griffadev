import { LitElement, html, css } from "lit-element";

export class IntersectDetect extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
      }

      .scroller {
        height: 100%;

      }

      #intersection {
        display: block;
        height: auto;
      }
    `;
  }

  _fireIntersecting(entry, visible) {
    let event = new CustomEvent("intersection-observed", {
      detail: {
        visible,
        entry,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  firstUpdated() {
    let thresholds = this.thresholds || [0, 1];
    let root = this.root || this;

    // todo re-use
    var observer = new IntersectionObserver(
       (entries) => {
        // no intersection with screen
        const entry = entries[0];
        if (entry.intersectionRatio <= thresholds[0]) {
          this._fireIntersecting(entry, false);
          this.setAttribute("observable", "hidden");
          // fully intersects with screen
        } else if(entry.intersectionRatio >= thresholds[1]){
          this._fireIntersecting(entry, true);
          this.setAttribute("observable", "visible");
        }
      },
      { threshold:  thresholds, root }
    );

    observer.observe(this.shadowRoot.querySelector("#observable"));
  }

  static get properties() {
    return {
      thresholds: String,
      root: HTMLElement
    };
  }

  render() {
    return html`
    <slot name="before"></slot>
    <div class="scroller">
      <div id="observable">
          <slot name="observable"></slot>
      </div>
      <slot></slot> 
    </div>`;
  }
}
