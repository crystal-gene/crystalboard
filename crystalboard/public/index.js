export function render() {
    const iframe = document.createElement('iframe');
    iframe.src = './index.html';
    document.body.appendChild(iframe);
  }
