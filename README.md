# `<dw-date-select>` [![Published on npm](https://img.shields.io/npm/v/@dreamworld/dw-date-select.svg)](https://www.npmjs.com/package/@dreamworld/dw-date-select)

A Lit Web Component for Material Design date selection. It extends [`dw-select`](https://github.com/DreamworldSolutions/dw-select) to provide a dropdown of predefined date items (each backed by a `valueProvider` function) alongside an optional integrated date picker for custom date entry.

---

## 1. User Guide

### Installation & Setup

```bash
yarn add @dreamworld/dw-date-select
```

Import the component as an ES module:

```javascript
import '@dreamworld/dw-date-select/dw-date-select.js';
```

### Basic Usage

Define your items array, where each item has a `label` and a `valueProvider` function returning `{ end: 'YYYY-MM-DD' }`. Include one item with `showCustomDate: true` to enable the built-in date picker.

```javascript
import dayjs from 'dayjs/esm/index.js';

const DATE_FORMAT = 'YYYY-MM-DD';

const items = [
  {
    label: 'End of This Month',
    valueProvider: () => ({
      end: dayjs().endOf('month').format(DATE_FORMAT),
    }),
  },
  {
    label: 'End of Last Month',
    valueProvider: () => ({
      end: dayjs().subtract(1, 'months').endOf('month').format(DATE_FORMAT),
    }),
  },
  {
    label: 'Select date',
    showCustomDate: true,
  },
];
```

```html
<dw-date-select
  label="Select Date"
  .items="${items}"
  .value="${currentValue}"
  @selected="${onSelected}"
></dw-date-select>
```

```javascript
function onSelected(e) {
  if (e.detail && e.detail.valueProvider) {
    // e.detail.valueProvider() returns { end: 'YYYY-MM-DD' }
    const value = e.detail.valueProvider();
  }
}
```

---

### API Reference

#### Properties

| Property | Attribute | Type | Default | Required | Description |
|---|---|---|---|---|---|
| `value` | — | `Object` | — | No | The currently selected item object. For custom dates, contains `valueProvider` and `showCustomDate`. |
| `valueFormat` | — | `String` | `'YYYY-MM-DD'` | No | Format used when storing the date value internally and passing it to `dw-date-picker`. |
| `dateRepresentationFormat` | — | `String` | `'DD MMM YYYY'` | No | Format used when displaying the selected date as text in the trigger. |
| `dateInputFormat` | — | `String` | `'DD/MM/YYYY'` | No | Format expected from user input inside the date picker. |
| `hideCustomDate` | — | `Boolean` | `false` | No | When `true`, removes the item with `showCustomDate: true` from the `items` list and hides the date picker. |
| `triggerElement` | — | `Object` | `this` (self) | No | The DOM element that triggers the date picker overlay. Defaults to the component itself on `firstUpdated`. |
| `appendTo` | — | `Object \| String` | `'parent'` | No | Where the date picker dialog is appended. Passed directly to `dw-date-picker`. |
| `zIndex` | — | `Number` | `9999` | No | Z-index of the date picker overlay. |
| `mobileMode` | `mobile-mode` | `Boolean` | `false` | No | When `true`, renders the date picker as a full-screen modal instead of a popover. Reflected as an HTML attribute. |
| `tabletMode` | `tablet-mode` | `Boolean` | `false` | No | Enables tablet-optimized rendering of the date picker. Reflected as an HTML attribute. |
| `darkTheme` | `dark-theme` | `Boolean` | — | No | Signals that the app is using a dark theme. Reflected as an HTML attribute. Passed to the date picker. |

#### Events

| Event | Detail Type | Description |
|---|---|---|
| `selected` | `Object` | Fired when the user selects an item from the dropdown or confirms a custom date. The detail is the selected item object (with `valueProvider` for custom dates). Inherited from `dw-select`. |
| `date-picker-opened-changed` | `{ opened: Boolean }` | Fired when the integrated `dw-date-picker` dialog opens or closes. |

#### CSS Custom Properties

These are set on `:host` and cascade into child components:

| Property | Default | Description |
|---|---|---|
| `--dw-popover-border-radius` | `16px` | Border radius of the select popover. |
| `--dw-dialog-border-radius` | `16px` | Border radius of the date picker modal dialog. |
| `--dw-select-content-padding` | `16px 0` | Padding applied to the dropdown content area. |
| `--dw-dialog-header-padding` | `4px 4px 4px 16px` | Padding applied to the dialog header. |
| `--mdc-text-field-label-ink-color` | `var(--mdc-theme-text-secondary-on-surface)` | Color of the text field label. |
| `--mdc-theme-text-primary` | `var(--mdc-theme-text-primary-on-surface)` | Primary text color within the component. |
| `--mdc-text-field-ink-color` | `var(--mdc-theme-text-primary-on-surface)` | Color of text entered in the text field. |

#### Item Object Schema

Each object in the `items` array must conform to one of these shapes:

```javascript
// Standard item — a predefined date option
{
  label: String,           // Required. Text shown in the dropdown list.
  valueProvider: Function, // Required. Returns { end: 'YYYY-MM-DD' }.
}

// Custom date item — triggers the integrated date picker
{
  label: String,           // Required. Text shown in the dropdown list.
  showCustomDate: true,    // Required. Marks this item as the custom date trigger.
  // valueProvider is added dynamically after the user picks a date.
}
```

---

### Configuration Options

The following defaults are set in the constructor:

| Option | Default | How to Override |
|---|---|---|
| `valueFormat` | `'YYYY-MM-DD'` | Set as a property: `.valueFormat="MM/DD/YYYY"` |
| `dateRepresentationFormat` | `'DD MMM YYYY'` | Set as a property: `.dateRepresentationFormat="MMM D, YYYY"` |
| `dateInputFormat` | `'DD/MM/YYYY'` | Set as a property: `.dateInputFormat="MM/DD/YYYY"` |
| `appendTo` | `'parent'` | Set as a property: `.appendTo=${someElement}` |
| `zIndex` | `9999` | Set as a property: `.zIndex=${200}` |
| `mobileMode` | `false` | Set attribute: `mobile-mode` or property: `.mobileMode=${true}` |
| `tabletMode` | `false` | Set attribute: `tablet-mode` or property: `.tabletMode=${true}` |

---

### Advanced Usage

#### Hiding the Custom Date Option

When `hideCustomDate` is `true`, the component calls `_hideCustomDate()` internally during `willUpdate`, which removes the item with `showCustomDate: true` from the `items` array. The `dw-date-picker` is also not rendered.

```html
<dw-date-select
  .items="${items}"
  .hideCustomDate="${true}"
></dw-date-select>
```

#### Dark Theme

Pass the `dark-theme` attribute to signal the dark theme context to internal Material components:

```html
<dw-date-select dark-theme .items="${items}"></dw-date-select>
```

#### Custom Trigger Element

By default, the component itself is the trigger for the date picker. To use a different element:

```javascript
const btn = document.querySelector('#my-button');
dateSelect.triggerElement = btn;
```

---

## 2. Developer Guide / Architecture

### Architecture Overview

**Inheritance — Extension pattern**
`DwDateSelect` extends `DwSelect` (`@dreamworld/dw-select`). All base select behaviors (dropdown rendering, keyboard navigation, validation, `selected` event dispatch) are inherited. `DwDateSelect` overrides `_onSelect`, `_onTrigger`, `_getValue`, `render`, `firstUpdated`, and `willUpdate` to inject date-specific behavior.

**Composition — Embedded date picker**
The `render()` method calls `super.render()` (the base select) and appends a `<dw-date-picker>` element via `datePickerTemplate`. The date picker is conditionally omitted when `hideCustomDate` is `true`.

**Value Provider Pattern**
Items do not carry static date values. Instead, each item holds a `valueProvider()` function that computes `{ end: 'YYYY-MM-DD' }` at call time. This ensures "End of This Month" always resolves to the current month, regardless of when the component was initialized.

**Custom Date Selection Flow**
1. User selects the item with `showCustomDate: true`.
2. `_onSelect` detects `e.detail.showCustomDate` and opens `this.datePicker` instead of updating the value.
3. User picks a date in the picker; `@change` fires `_onDatePickerValueChanged`.
4. `_onDatePickerValueChanged` constructs a new `valueProvider` closure for the picked date, merges it onto the `showCustomDate` item, and assigns it to `this.value`.
5. `_dispatchSelected` and `validate()` are called.

**Adaptive UI**
`mobileMode` controls whether the date picker renders as a `'popover'` (desktop) or `'modal'` (mobile). The `type` binding on `<dw-date-picker>` switches between these two modes.

**Value Equator**
The constructor installs a custom `valueEquator` function on the base class. It handles three comparison cases:
- Both values are plain objects: uses `lodash-es/isEqual`.
- One or both values have a `valueProvider`: compares the resolved outputs.
- One value is `'SELECT_DATE'` or has `showCustomDate`: treated as equal to any custom-date value with an `end`.

**Trigger Guard**
`_onTrigger` checks both `this._opened` (base select state) and `this._pickerOpned` (date picker open state) before opening the dropdown. This prevents the select from reopening while the date picker dialog is visible.

### Module Responsibilities

| Module | Role |
|---|---|
| `dw-date-select.js` | Main component class; all logic described above |
| `@dreamworld/dw-select` | Base class providing dropdown UI, keyboard nav, validation |
| `@dreamworld/dw-date-input` (`dw-date-picker`) | Date picker overlay component |
| `dayjs` | Date formatting and arithmetic inside `valueProvider` functions |
| `lodash-es` (`isEqual`, `find`, `without`) | Value comparison, item lookup, item removal |
