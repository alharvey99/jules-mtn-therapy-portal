2026-05-19 — Form Controls & Accessibility Audit
Learning: Native <select> elements, bare checkboxes, and inconsistent buttons (SubmitButton vs ui/Button) are pervasive. Native <input type="color"> used for theme settings. Forms lack robust loading/error feedback.
Action: Replace all native selects with Shadcn UI Select component. Standardize button usage. Add proper focus styles and accessible markup.

2026-05-20 — SelectInput and Button Refactor
Learning: `SelectInput` components originally parsed React children to look for native `<option>` tags, which is an error-prone pattern. `SubmitButton` was completely redundant as standard Shadcn UI `Button` can support `isLoading` state. Native `<input type="color">` needs to be properly wrapped with state to work cleanly as an accessible, custom color picker widget.
Action: Remove `<option>` usage completely from `SelectInput` and enforce an explicit `options` array prop. Deprecate `SubmitButton` and use `Button` with an `isLoading` prop instead. Use the custom `ColorPicker` wrapper for all color inputs.
