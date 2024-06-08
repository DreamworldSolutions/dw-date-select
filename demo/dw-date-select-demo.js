import { LitElement, html, css } from "@dreamworld/pwa-helpers/lit.js";
import { valueProvider, valueProviderFactory } from "../dw-date-select.js";
import { isEqual } from "lodash-es";

const DateRangeItems = [
  // {
  //   label: "This Month",
  //   valueProvider: valueProvider.thisMonth,
  // },
  {
    label: "End of This Month",
    valueProvider: valueProvider.endOfThisMonth,
  },
  {
    label: "End of Last Month",
    valueProvider: valueProvider.endOfLastMonth,
  },
  // {
  //   label: "Last Quarter",
  //   valueProvider: valueProviderFactory.lastQuarter("01/04"),
  // },
  // {
  //   label: "This Financial Year",
  //   valueProvider: valueProviderFactory.thisFinancialYear("01/04"),
  // },
  // {
  //   label: "Last Financial Year",
  //   valueProvider: valueProviderFactory.lastFinancialYear("01/04"),
  // },
  // {
  //   label: "Last 3 Months",
  //   valueProvider: valueProviderFactory.lastNMonths(3),
  // },
  // {
  //   label: "Last 2nd month",
  //   valueProvider: valueProviderFactory.lastNthMonth(2),
  // },
  // {
  //   label: "before 30 days",
  //   valueProvider: valueProviderFactory.beforeNDays(30),
  // },
  // {
  //   label: "today",
  //   valueProvider: valueProvider.today,
  // },
  // {
  //   label: "Last Week",
  //   valueProvider: valueProviderFactory.lastWeek(),
  // },
  // {
  //   label: "End of Last Week",
  //   valueProvider: valueProviderFactory.lastWeek(true),
  // },
  // {
  //   label: "End of Next Month",
  //   valueProvider: valueProviderFactory.nextMonth(true),
  // },
  {
    label: "Select date",
    showCustomRange: true
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
      console.log(this._currentDate);
    }
  }
}

customElements.define("dw-date-select-demo", DwDateRangeSelectDemo);
