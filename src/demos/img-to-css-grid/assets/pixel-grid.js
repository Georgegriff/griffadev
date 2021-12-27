import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import { styleMap } from 'https://unpkg.com/lit-html/directives/style-map.js?module';
class PixelGrid extends LitElement {

    constructor() {
        super();
        this.colors = new Map();
    }

    static get properties() {
        return {
            rows: {type : Number},
            columns: {type: Number},
            pixels : {type: Array},
            colors: { attribute: false }
        };
    }

    static get styles() {
        return css`
          :host {
            display: block;
            width: var(--pixel-grid-width, 300px);
            height: var(--pixel-grid-height, 300px);
            background: var(--pixel-grid-background, #ccc);
          }
          
          .grid {
              height: 100%;
          }
        `;
    }

    _defineGrid({ rows, columns }) {
        const mapTemplates = (count, tag) => [...new Array(count)].reduce((acc, curr, index) => acc + ` [${tag}${index}] 1fr`, '');
        
        return {
            display: 'grid',
            gridTemplateRows: mapTemplates(rows, 'row'),
            gridTemplateColumns: mapTemplates(columns, 'col')
        };
    }

    render() {
        return html`
    <div class="grid" 
        style=${styleMap(this._defineGrid({rows: this.rows, columns: this.columns}))}>
        ${!this.pixels || !this.pixels.length ? 
            html`<div>No pixels</div>` 
            : this.pixels.map(this.placePixel.bind(this))
        }
    </div>
    `;
    }

    placePixel({ css = 'red', y = 0, x = 0, colEnd = x, rowEnd = y } = {}) {
        // normalize so ends at row/column specified
        const style = {
            gridArea : `row${y} / col${x} / row${rowEnd} / col${colEnd}`,
            background: css
        };
        return html`<span style=${styleMap(style)}></span>`;
    }
}

customElements.define('pixel-grid', PixelGrid);