import { LitElement, html, css } from "@dreamworld/pwa-helpers/lit.js";
import "../dw-date-select.js";
import dayjs from 'dayjs/esm/index.js';


const DATE_FORMAT = 'YYYY-MM-DD';
const DateRangeItems = [
  {
    label: "End of This Month",
    valueProvider: () => {
      return {
        end: dayjs().endOf('month').format(DATE_FORMAT),
      }}
  },
  {
    label: "End of Last Month",
    valueProvider: () => {
      return {
        end: dayjs().subtract(1, 'months').endOf('month').format(DATE_FORMAT),
      };
    },
  },
  {
    label: "Select date",
    showCustomDate: true
  },
];

export class DwDateRangeSelectDemo extends LitElement {
  static get properties() {
    return {
  
      _currentDate: { type: String },
  }
}

  static styles = [
    css`
      :host {
        display: block;
      }

      dw-date-select {
        margin-top: 16px;
      }
    `,
  ];

  render() {
    return html`

      <div>Date select </div>
      <dw-date-select
        .label=${"Select Date"}
        .items=${DateRangeItems}
        .value=${this._currentDate}
        @selected=${this._onSelected}
      >
      </dw-date-select>
    `;
  }

  _onSelected(e) {
    if(e && e.detail && e.detail.valueProvider) {
      this._currentDate = e.detail.valueProvider();
    }
  }
}

customElements.define("dw-date-select-demo", DwDateRangeSelectDemo);
