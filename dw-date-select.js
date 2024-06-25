import { html, css } from '@dreamworld/pwa-helpers/lit.js';
import { DwSelect } from '@dreamworld/dw-select/dw-select.js';
import isEqual from 'lodash-es/isEqual';
import find from 'lodash-es/find';
import dayjs from 'dayjs/esm/index.js';
import without from 'lodash-es/without.js';

import '@dreamworld/dw-date-input/dw-date-picker.js';
import '@dreamworld/dw-date-input/dw-date-input-dialog.js';


export class DwDateSelect extends DwSelect {
  static get styles() {
    return [
      css`
        :host {
          --dw-popover-border-radius: 16px;
          --dw-dialog-border-radius: 16px;
          --dw-select-content-padding: 16px 0;
          --dw-dialog-header-padding: 4px 4px 4px 16px;

          --mdc-text-field-label-ink-color: var(--mdc-theme-text-secondary-on-surface);
          --mdc-theme-text-primary: var(--mdc-theme-text-primary-on-surface);
          --mdc-text-field-ink-color: var(--mdc-theme-text-primary-on-surface);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.valueTextProvider = (item, customLabel) => {
      if (customLabel) {
        const value = (this.value && this.value.valueProvider && this.value.valueProvider()) || this.value;
        if ((!item || item.showCustomDate || item === 'SELECT_DATE') && value && value.end) {
          const text = `${dayjs(value.end).format(this.dateRepresentationFormat)}`;
          return text;
        }
        return item.label;
      }
      return item.label;
    };

    this.valueEquator = (v1, v2) => {
      if (!v1 && !v2) {
        return v1 === v2;
      }

      if (v1 && v2 && v1.hasOwnProperty('valueProvider') && v2.hasOwnProperty('valueProvider')) {
        return isEqual(v1.valueProvider(), v2.valueProvider());
      }
      if (v1 && v1.hasOwnProperty('valueProvider')) {
        return isEqual(v1.valueProvider(), v2);
      }

      if (isEqual(v1, v2)) {
        return true;
      }

      if (v1 === 'SELECT_DATE' || (v1 && v1.showCustomDate && v1 && v2 && ((v2.end) || v2.showCustomDate))) {
        return true;
      }

      return false;
    };

    this.appendTo = 'parent';
    this.zIndex = 9999;
    this.mobileMode = false;
    this.tabletMode = false;
    this.valueFormat = 'YYYY-MM-DD';
    this.inputFormat = 'DD/MM/YYYY';
    this.dateRepresentationFormat = 'DD MMM YYYY';
    this.dateInputFormat = 'dd/mm/yyyy';
  }

  static get properties() {
    return {
      /**
       * Selected list item object.
       * `object` in case of single selection;
       * `object[]` in case of multiple selections.
       */
      value: { type: Object },

      /**
       * date value format
       * default `yyyy-mm-dd`.
       */
      valueFormat: { type: String },

      /**
       * Date represent format
       * default `dd mmm yyyy`
       */
      dateRepresentationFormat: { type: String },

      hideCustomDate: { type: Boolean },

      // START: Date-picker properties
      /**
       * Date-picker
       * Trigger element for which `popover` dialog is opened.
       */
      triggerElement: { type: Object },

      /**
       * Date-picker
       * Element in which content will be appened. Default is parent element of trigger element.
       */
      appendTo: { type: Object },

      /**
       * Date-picker
       * Input property.
       * Element z-index, default value is 9999.
       */
      zIndex: { type: Number },

      /**
       * Date-picker
       * Input property.
       * Display in mobile mode (full screen).
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },

      /**
       * Date-picker
       * Input property.
       * Display in tablet mode.
       */
      tabletMode: { type: Boolean, reflect: true, attribute: 'tablet-mode' },

      /**
       * It's representing app's current theme is dark or not.
       */
      darkTheme: {
        type: Boolean,
        reflect: true,
        attribute: 'dark-theme',
      },

      /**
       * Represents current company's date input format.
       */
      dateInputFormat: { type: String },

      _pickerOpned: {type: Boolean }

      // END: Date-picker properties
    };
  }

  render() {
    return html`${super.render()} ${this.datePickerTemplate}${this.dateInputDialogTemplate}`;
  }

  get dateInputDialogTemplate() {
    return html`
      <dw-date-input-dialog
        date-picker="false"
        .type=${'modal'}
        .placement=${'center'}
        .inputFormat="${this.inputFormat}"
        .valueFormat=${this.valueFormat}
        .dateRepresentationFormat="${this.dateRepresentationFormat}"
        .label="${this.label}"
        ?disabled="${this.disabled}"
        .invalid=${this.invalid}
        ?noLabel="${this.noLabel}"
        ?required="${this.required}"
        ?readOnly="${this.readOnly}"
        ?autoSelect="${this.autoSelect}"
        ?dense="${this.dense}"
        ?hintPersistent="${this.hintPersistent}"
        .placeholder="${this.inputFormat}"
        ?highlightChanged="${this.highlightChanged}"
        ?noHintWrap="${this.noHintWrap}"
        .value="${this.value?.end}"
        .originalDate="${this.originalValue}"
        .name="${this.name}"
        .hint="${this.hint}"
        .minDate="${this.minDate}"
        .maxDate="${this.maxDate}"
        .showFutureWarning=${this.showFutureWarning}
        .showFutureError=${this.showFutureError}
        .warning=${this._warning}
        .error=${this._error}
        .hintInTooltip="${this.hintInTooltip}"
        .errorInTooltip="${this.errorInTooltip}"
        .warningInTooltip="${this.warningInTooltip}"
        .hintTooltipActions="${this.hintTooltipActions}"
        .errorTooltipActions="${this.errorTooltipActions}"
        .warningTooltipActions="${this.warningTooltipActions}"
        .tipPlacement="${this.tipPlacement}"
        .errorMessages="${this._errorMessages}"
        @dw-dialog-closed=${e => this._triggerDateInputDialogOpenedChanged(false)}
        @dw-dialog-opened=${e => this._triggerDateInputDialogOpenedChanged(true)}
        @mode-changed=${this._onDateInputDialogModeChanged}
        @change=${this._onChange}
      >
      </dw-date-input-dialog>
    `;
  }

  get datePickerTemplate() {
    if (this.hideCustomDate) {
      return;
    }

    let selectedItem;
    if (typeof this.value === 'string') {
       selectedItem = find(this.items, { name: this.value});
    }
    const value = selectedItem ? selectedItem.valueProvider() : this.value;
    
    return html`
      <dw-date-picker
        date-picker="false"
        .type=${this.mobileMode ? 'modal' : 'popover'}
        .popoverAnimation=${'expand'}
        .placement=${'bottom'}
        .mobileMode=${this.mobileMode}
        .for=${'select'}
        .tabletMode=${this.tabletMode}
        .showTrigger=${true}
        .appendTo=${this.appendTo}
        .zIndex=${this.zIndex}
        .value=${value?.end}
        .minDate="${this.minDate}"
        .maxDate="${this.maxDate}"
        .inputFormat=${this.inputFormat}
        .valueFormat=${this.valueFormat}
        .dateRepresentationFormat="${this.dateRepresentationFormat}"
        .triggerElement=${this.triggerElement}
        @dw-dialog-closed=${e => this._triggerDatePickerOpenedChanged(false)}
        @dw-dialog-opened=${e => this._triggerDatePickerOpenedChanged(true)}
        @mode-changed=${this._onDatePickerModeChanged}
        @change=${this._onDatePickerValueChanged}
      >
      </dw-date-picker>
    `;
  }

  /**
   * Returns String that represents current value
   * @override
   */
  _getValue(value) {
    var text;
    try {
      text = this.valueTextProvider(value, true);
    } catch (e) {
      text = '';
    }

    if (text) {
      return text;
    }

    if (typeof value === 'string') {
      return value;
    }

    return '';
  }

  _onDatePickerValueChanged(e) {
    const value = e?.detail?.value || '';
    const selectedItem = find(this.items, 'showCustomDate');
    const DATE_FORMAT = 'YYYY-MM-DD';
    if (value) {
      const valueProvider = function () {
        return { end: dayjs(value).format(DATE_FORMAT) };
      };
      this.value = {
        ...selectedItem,
        ...{
          valueProvider,
        },
      };
    }
    this._selectedValueText = this._getValue(selectedItem);
    this._dispatchSelected(value);
    setTimeout(() => {
      this.validate();
    }, 0);
  }

  _onChange(e) {
    const value = e?.target?.value || '';
    const selectedItem = find(this.items, 'showCustomDate');
    const DATE_FORMAT = 'YYYY-MM-DD';
    if (value) {
      const valueProvider = function () {
        return { end: dayjs(value).format(DATE_FORMAT) };
      };
      this.value = {
        ...selectedItem,
        ...{
          valueProvider,
        },
      };
      this._selectedValueText = this._getValue(selectedItem);
      this._dispatchSelected(value);
      setTimeout(() => {
        this.validate();
      }, 0);
    }
  }

  firstUpdated(changeProps) {
    super.firstUpdated && super.firstUpdated(changeProps);
    if (!this.triggerElement) {
      this.triggerElement = this;
    }
  }

  willUpdate(changedProperties) {
    super.willUpdate && super.willUpdate(changedProperties);
    if (this.hideCustomDate === true) {
      this._hideCustomDate();
    }
  }

  _hideCustomDate() {
    const selectedItem = find(this.items, 'showCustomDate');
    const value = this.items;
    this.items = value && value.includes(selectedItem) ? without(value, selectedItem) : value;
  }

  get datePicker() {
    return this.renderRoot.querySelector('dw-date-picker');
  }

  get dateInputDialog() {
    return this.renderRoot.querySelector('dw-date-input-dialog');
  }

  async _onSelect(e) {
    if (e?.detail?.showCustomDate) {
      if (this.datePicker) {
        this.datePicker.opened = true;
      }
      return;
    }
    const value = this.value;
    const selectedItem = e.detail;
    this.value = this._valueProvider(selectedItem);
    this._selectedValueText = this._getValue(selectedItem);
    if (!this._vkb && typeof this._triggerElement?.focus === 'function') {
      this._triggerElement.focus();
    }
    this._query = undefined;
    await this.updateComplete;
    this.reportValidity();
    this._dispatchSelected(value);
  }

  _onTrigger(e) {
    if(this._opened || this._pickerOpned) return;

    if (!this.readOnly && !this.autoComplete) {
      this._opened = true;
    }
  }

  _triggerDateInputDialogOpenedChanged(opened) {
    this.dispatchEvent(
      new CustomEvent('date-input-dialog-opened-changed', {
        detail: {
          opened,
        },
      })
    );
  }

  _triggerDatePickerOpenedChanged(opened) {
    this._pickerOpned = opened;
    this.dispatchEvent(
      new CustomEvent('date-picker-opened-changed', {
        detail: {
          opened,
        },
      })
    );
  }

  _onDatePickerModeChanged(e) {
    if (this.dateInputDialog) {
      this.dateInputDialog.opened = true;
    }
  }

  _onDateInputDialogModeChanged(e) {
    if (this.datePicker) {
      this.datePicker.opened = true;
    }
  }
}

customElements.define('dw-date-select', DwDateSelect);
