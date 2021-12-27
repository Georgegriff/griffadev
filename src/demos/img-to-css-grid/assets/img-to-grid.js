import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import './pixel-grid.js';
import './color-blob.js';
import { getPixelData } from './ImageDataExtractor.js';

class ImageToGrid extends LitElement {

  static get properties() {
    return {
      rows: { type: Number },
      columns: { type: Number },
      pixels: { type: Array },
      src: { type: String, reflect: true },
      scaleFactor: { type: Number },
      totalColors: {type: Number, reflect: true}
    };
  }

  constructor() {
    super();
    this.scaleFactor = 0.06;
    this.totalColors = 16;
    this.colors = new Map();
    this._onPaste = this.onPaste.bind(this);
  }

  onPaste(e) {
    if(e.clipboardData == false) {
        return false;
    }
    const imgs = e.clipboardData.items;
    if (imgs == undefined) {
        return false;
    };
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].type.indexOf("image") == -1) {
            continue;
        }
        const imgObj = imgs[i].getAsFile();
        const src = URL.createObjectURL(imgObj);
        this.src = src;
        this._updateImg();
    }
  }

  async disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('paste', this._onPaste);
  }
  async connectedCallback() {
    super.connectedCallback();
    this._updateImg();
    
    window.addEventListener('paste', this._onPaste)
  }

  attributeChangedCallback(name, oldval, newval) {
    if(name === "src" || name === "totalcolors") {
        this._updateImg();
    }
    super.attributeChangedCallback(name, oldval, newval);
  }


  onImageChange(e) {
    const { value } = e.target;
    this.src = value;
    this._updateImg();
  }

  onImageUpload(e) {
    if (!e.target.files || !e.target.files[0]) return;
    
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
        this.src = e.target.result;
        this._updateImg();  
    });
    fileReader.readAsDataURL(e.target.files[0]);
  }

  changeSf(e) {
    const { value } = e.target;
    this.scaleFactor = value;
    this._updateImg();
  }

  changeColors(e) {
    const { value } = e.target;
    this.totalColors = value;
    this._updateImg();
  }

  async _updateImg() {
    if(!this.src) {
        return;
    }
    try {
        const pixels = await getPixelData(this.src, {
            scaleFactor: this.scaleFactor,
            totalColors: this.totalColors
          });
      
          this.rows = pixels.width;
          this.columns = pixels.height;
          this.pixels = pixels.data;
          this.colors = pixels.colorMap;
          const aspectRatio =  pixels.imgHeight /  pixels.imgWidth;
          const desiredWidth = 500;
          const height = desiredWidth * aspectRatio;
          document.documentElement.style.setProperty('--pixel-grid-height', `${height}px`);
          document.documentElement.style.setProperty('--pixel-grid-width', `${desiredWidth}px`);
    } catch(e) {
        console.error(e);
    }
   
  }

  async _imageLoad(e) {
    const pixelGrid = e.target;
    this.colors = pixelGrid.colors;
    this.requestUpdate();
  }

  static get styles() {
    return css`
          :host {
            display: block;
          }

          pixel-grid {
            --pixel-grid-background : transparent;
          }
          .flex-container {
              display: flex;
              gap: 1rem;
              flex-wrap: wrap;
          }

          .color-grid {
              margin: 1rem;
              display: grid;
              gap: 0.25rem;
              min-height: 350px;
              grid-template-columns: repeat(4, 1fr);
              grid-auto-rows: max-content;
          }

          label {
              font-weight: 600;
          }
        `;
  }

  colorPickerChanged(e) {
      const color = e.detail.color;
      const colorId = e.target.getAttribute("id");
      document.documentElement.style.setProperty(colorId, color);
  }

  render() {
    return html`
    <label for="image-url">Provide a url to an image</label>
    <input id="image-url" value="${this.src || ""}" @input=${this.onImageChange} type="text">
    <br/>
    <label for="image-upload">Upload an image</label>
    <input type="file" id="image-upload" value="${this.src || ""}" @change=${this.onImageUpload}>
    <br/>
    <label>Or paste an image from your clipboard (ctrl + v) or (cmd + v)</label>
    <br/>
    <label for="scale-factor">Scale factor (lower the better perf):</label>
    <input id="scale-factor" @input=${this.changeSf} value=${this.scaleFactor} type="text">
    <br/>
    <label for="total-colors">Total colors in output image</label>
    <input for="total-colors" @input=${this.changeColors} value=${this.totalColors} type="text">
    <div class="flex-container">
        <pixel-grid .colors=${this.colors} .pixels=${this.pixels} .rows=${this.rows} .columns=${this.columns}></pixel-grid>
        <div>
            <label>Choose a color to modify it:</label>
            <div class="color-grid">
                ${[...this.colors.entries()].map(([key, color]) => {
                    return html`<color-blob @color-change=${this.colorPickerChanged} id="${color.var}" color="${color.hex}"></color-blob>`
                })}
            </div>
        </div>
    </div>
    `;
  }

}

customElements.define('img-to-grid', ImageToGrid);