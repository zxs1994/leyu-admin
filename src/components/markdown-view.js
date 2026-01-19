// markdown-view.js
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
});

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
      ${html}
    `
  }
}

// 注册自定义元素
customElements.define('markdown-view', MarkdownView)
