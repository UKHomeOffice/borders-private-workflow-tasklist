import { Details } from 'govuk-frontend';

export default class GovUKDetailsObserver {
  constructor(node) {
    this.node = node;
  }

  create(subtree = false) {
    this.observer = new MutationObserver(() => {
      this.node.querySelectorAll('[data-module="govuk-details"]')
        .forEach(element => {
          new Details(element).init()
        });
    });
    this.observer.observe(this.node, { childList: true, attributes: false, subtree: subtree });
    return this;
  }

  destroy() {
    this.observer.disconnect();
  }

}
