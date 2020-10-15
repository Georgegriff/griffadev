const html = String.raw;

const youtube = ({id}) => html`<div class="video-size">
    <div class="video-wrapper">
        <lite-youtube class="video" videoid="${id}" style="background-image: url('https://i.ytimg.com/vi/${id}/hqdefault.jpg');">
            <a rel="noopener" onclick="('customElements' in window) && event.preventDefault()" title="Play Video" class="no-js" target="_blank" href="https://youtube.com?w=${id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <g transform="translate(-339 -150.484)">
                    <path fill="var(--White, #fff)" d="M-1978.639,24.261h0a1.555,1.555,0,0,1-1.555-1.551V9.291a1.555,1.555,0,0,1,1.555-1.551,1.527,1.527,0,0,1,.748.2l11.355,6.9a1.538,1.538,0,0,1,.793,1.362,1.526,1.526,0,0,1-.793,1.348l-11.355,6.516A1.52,1.52,0,0,1-1978.639,24.261Z" transform="translate(2329 150.484)"/>
                    <path fill="var(--Primary, #000)" d="M16.563.563a16,16,0,1,0,16,16A16,16,0,0,0,16.563.563Zm7.465,17.548L12.672,24.627a1.551,1.551,0,0,1-2.3-1.355V9.853a1.552,1.552,0,0,1,2.3-1.355l11.355,6.9A1.553,1.553,0,0,1,24.027,18.111Z" transform="translate(338.438 149.922)" />
                </g>
            </svg>
        </a>
        </lite-youtube>
    </div>
</div>`;

module.exports = youtube;

