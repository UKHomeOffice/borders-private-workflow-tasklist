import { initAll } from 'govuk-frontend';

export default class GovUKFrontEndObserver {

  constructor(node) {
    this.node = node;
  }

  create() {
    this.observer = new MutationObserver(initAll);
    this.observer.observe(this.node, { childList: true, attributes: false });
    return this;
  }

  destroy() {
    this.observer.disconnect();
  }

}
