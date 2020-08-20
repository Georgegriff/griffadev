import { LitElement, html, css } from "lit-element";

export class IntersectDetect extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        /* override from auto so can work js disabled */
        overflow: initial !important;
      }

      .scroller {
        height: 100%;
        overflow: auto;

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
    // todo re-use
    var observer = new IntersectionObserver(
       (entries) => {
        // no intersection with screen
        const entry = entries[0];
        if (entry.intersectionRatio === 0) {
          this._fireIntersecting(entry, false);
          this.setAttribute("observable", "hidden");
          // fully intersects with screen
        } else if (entry.intersectionRatio === 1) {
          this._fireIntersecting(entry, true);
          this.setAttribute("observable", "visible");
        }
      },
      { threshold: this.threshold || [0, 1], root: this }
    );

    observer.observe(this.shadowRoot.querySelector("#observable"));
  }

  static get properties() {
    return {
      threshold: Array,
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
