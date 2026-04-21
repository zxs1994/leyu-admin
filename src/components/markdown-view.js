// markdown-view.js
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
});

const createStyle = () => `
  :host {
    display: block;
    color: var(--ui-text);
    font-size: 14px;
    line-height: 1.8;
    word-break: break-word;
  }

  * {
    box-sizing: border-box;
  }

  :host > :first-child {
    margin-top: 0;
  }

  :host > :last-child {
    margin-bottom: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1.2em 0 0.55em;
    color: var(--ui-text);
    font-weight: 700;
    line-height: 1.35;
  }

  h1 { font-size: 1.8em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1.1em; }
  h5, h6 { font-size: 1em; }

  p,
  ul,
  ol,
  blockquote,
  pre,
  table {
    margin: 0 0 1em;
  }

  ul,
  ol {
    padding-left: 1.5em;
  }

  li + li {
    margin-top: 0.35em;
  }

  strong {
    color: var(--ui-text);
    font-weight: 700;
  }

  em {
    color: var(--ui-text-secondary);
  }

  a {
    color: var(--ui-primary);
    text-decoration: none;
  }

  a:hover {
    color: var(--ui-primary-hover);
    text-decoration: underline;
  }

  code {
    padding: 0.15em 0.4em;
    border-radius: 6px;
    background: color-mix(in srgb, var(--ui-bg-elevated) 88%, transparent);
    color: var(--ui-warning);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
    font-size: 0.92em;
  }

  pre {
    overflow: auto;
    padding: 14px 16px;
    border: 1px solid var(--ui-border-secondary);
    border-radius: 12px;
    background: var(--ui-bg-elevated);
  }

  pre code {
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: var(--ui-text);
    font-size: 0.92em;
  }

  blockquote {
    margin-left: 0;
    padding: 0.1em 0 0.1em 1em;
    border-left: 4px solid var(--ui-border-secondary);
    color: var(--ui-text-secondary);
    background: color-mix(in srgb, var(--ui-bg-elevated) 55%, transparent);
    border-radius: 0 10px 10px 0;
  }

  hr {
    border: 0;
    border-top: 1px solid var(--ui-border-secondary);
    margin: 1.5em 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--ui-border-secondary);
  }

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--ui-border-secondary);
    text-align: left;
    vertical-align: top;
  }

  th {
    color: var(--ui-text);
    background: color-mix(in srgb, var(--ui-bg-elevated) 78%, transparent);
    font-weight: 600;
  }

  td {
    color: var(--ui-text-secondary);
    background: var(--ui-bg-container);
  }

  tr:last-child td {
    border-bottom: 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
`

class MarkdownView extends HTMLElement {
  constructor() {
    super();
    // 创建 Shadow DOM
    this.attachShadow({
      mode: 'open'
    });
  }

  // 当 custom element 属性或内容变化时调用
  static get observedAttributes() {
    return ['markdown']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'markdown') {
      this.render(newValue)
    }
  }

  render(markdown) {
    // console.log('Rendering markdown:', markdown)
    const html = md.render(markdown || '')
    this.shadowRoot.innerHTML = `
      <style>${createStyle()}</style>
      ${html}
    `
  }
}

// 注册自定义元素
customElements.define('markdown-view', MarkdownView)
