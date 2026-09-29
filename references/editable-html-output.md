# Editable HTML Resume Output

Read this file whenever the user selects HTML as the final resume format. A static HTML page is not sufficient: the delivered file must remain directly editable after generation.

## Required editing controls

- Use block-level editing: make each heading, paragraph, row field, and bullet directly editable instead of placing one `contenteditable` attribute on the whole page.
- `Enter` must create a usable paragraph/list break; `Shift+Enter` must create a soft line break. Empty editable paragraphs must remain visible and deletable.
- Provide font-size decrease and increase controls.
- Provide paragraph-spacing controls plus insert-paragraph and delete-current-paragraph controls.
- Provide a text-color picker.
- Provide bold, left-align, center, right-align, and justify controls.
- Provide undo and redo where the browser supports them.
- Provide a one-page auto-fit control.
- Provide a visible `生成 PDF` or equivalent print button that calls `window.print()`.
- Before opening the print dialog, show browser-specific instructions for disabling browser-generated headers and footers. For Chrome or Edge, direct the user to `更多设置 → 取消“页眉和页脚”`; for Safari, direct the user to `显示详细信息 → 取消“打印页眉和页脚”`.
- Provide local save and download-updated-HTML controls so manual edits survive closing or sharing the file.

Use [the editable base template](../assets/editable-resume-base.html) as the implementation baseline. Adapt its visual design to the source resume; do not discard its editing behavior when changing the layout.

## Text-color safety

- Save the user's current text selection before the color picker receives focus, then restore that selection before applying the color.
- Apply only the CSS `color` property. Do not change font size, family, weight, line height, spacing, alignment, display mode, or surrounding block structure.
- If there is no non-collapsed selection inside the resume page, do not apply a color to a whole paragraph or section.
- Verify color changes on a selection within one line and across multiple inline elements. Line wrapping, order, alignment, and spacing must remain unchanged.

## One-page A4 fitting

- Measure occupation against the full A4 page height, including the top and bottom page margins. Do not report the percentage of only the inner writable area: that can label a visually 90%–92% page as 99% full.
- Define the displayed percentage as the vertical position of the last visible content edge measured from the top edge of the full A4 page. Use the same definition for the status display, automatic fitting, and print preflight.
- Keep 95%–98% as the acceptable range, but default automatic fitting to roughly 96%–97% so print-font and unit rounding have safety room. Do not force 98% when it causes a second page.
- After content edits, the auto-fit control must remeasure the actual content and work from the current page-level settings rather than resetting the resume first.
- Whether compressing an overflowing page or expanding an under-filled page, adjust line height first, then paragraph or bullet spacing, then section spacing, then font size, and page margins last.
- Use small bounded steps and continue searching when one property would overshoot 98%; do not stop the entire fit operation after the first rejected step.
- Recommended body-font floor: 9.5pt for a dense Chinese resume; prefer 10–11pt.
- Recommended line-height floor: 1.25.
- Do not reduce page margins below roughly 8mm without approval.
- Never hide overflow, delete content, or compress text to an unreadable size to simulate a one-page result.
- If safe auto-fitting fails, show a warning and ask the user to approve a content or layout adjustment.
- Show the measured occupied-height percentage after fitting so the user can verify that the control had an effect.
- Measure against the print-equivalent page box and retain a small print safety buffer; a screen-only 98% calculation is insufficient.
- Report both occupied-height percentage and whether the current print layout is expected to remain one page. Do not label fitting successful while the print-equivalent layout overflows.
- Immediately before `window.print()`, switch the page into its actual print dimensions and run a compression-only preflight. Open the print dialog only when this preflight fits within the safety threshold.
- Run the same preflight from `beforeprint` so browser-menu printing also recalculates after manual edits.

## Default single-column layout

- Every section, including skills, languages, tools, and certificates, defaults to one column.
- Do not introduce CSS grid, multi-column CSS, or a two-column flex arrangement for section content merely to save space.
- If a two-column section may materially improve a crowded resume, explain which section and why, then obtain user approval before using it.
- Rows that place a date on the right are still a single-column document structure; their left text field must permit manual line breaks without moving text into a second content column.

## Layout preservation

When a source resume has a usable design, preserve its typography, colors, section order, spacing, dividers, alignment, and date placement. Port the editor controls into that design. Use the base template's visible styling only when there is no source layout to preserve.

## Printing and delivery

- Hide the toolbar and warnings in print CSS.
- Use `@page { size: A4; margin: 0; }`. Measure against an A4-height preflight box, but let the printed `.page` element use content-driven height after a successful preflight; a fixed 297 mm element can round onto a blank second sheet in some browsers.
- Verify that print preview has the intended page count and no clipping or overlap.
- Verify that the saved PDF contains no browser-added date, web-page title, page number, URL, `file://` address, or local HTML path. These may come from the browser print layer and cannot be reliably disabled by page CSS.
- Deliver the editable HTML file. Do not generate a separate PDF unless the user asks for one.
- Name the file `<姓名>-<公司名>.html`, using a fictional example such as `李明-示例科技.html`. Do not add the position, job-description (JD) title, date, version, or `editable` / `可编辑版` suffix unless requested.

## Functional verification

Before delivery, test that:

1. text can be edited directly;
2. every toolbar control changes only its intended property;
3. text color does not alter layout;
4. undo and redo work where supported;
5. auto-fit never deletes content;
6. auto-fit handles an under-filled page, an overflowing page, and new text added after an earlier fit;
7. the final occupied-height percentage is visible and falls within 95%–98% whenever the content can safely reach that range;
8. the PDF button opens the browser print dialog;
9. the toolbar is absent from printed output.
10. a degree or education detail can be split across lines without disturbing the date;
11. pressing Enter in skills creates a new line below rather than a new right-hand column;
12. blank paragraphs can be inserted and deleted, and paragraph spacing visibly changes;
13. the generated PDF has exactly one page after auto-fit.

## Patch an existing master instead of rebuilding

When a reusable editable master HTML exists, duplicate it and edit only the content blocks and approved section structure needed for the new job description (JD). Preserve its CSS, toolbar, editor script, print logic, and layout primitives byte-for-byte unless the user requested a design or editor change.

Do not regenerate the full HTML shell for every application. Rebuilding is allowed only when no master exists, the master is incompatible with the requested output, or the user approves a redesign. After an editor fix, update the master once so later variants inherit it.


## Description-only copying for application forms

Include the base template's non-printing `网申正文复制` panel. Each experience is one plain-text block containing its overview and bullets, in order; employer, role, dates, location and department are excluded. Show identifying fields as labels outside the copied text. Do not claim this improves automatic ATS parsing.

The base template detects entries from `.row` elements containing `b.row-main`, ending at the next entry or `h2`. Description paragraphs and list items follow the header. Mark standalone metadata paragraphs with `data-copy-exclude="true"`; never mark real body text for exclusion based on bold styling or specific organization names. Keep dates and locations inside header rows, not body paragraphs. If an existing master uses different markup, adapt the entry selector or provide explicit grouping while preserving its design.

Example with fictional placeholder content:

```html
<div class="row"><b class="row-main edit-block">Example Company | Intern</b><span class="row-date edit-block">2024–2025</span></div>
<p class="edit-block" data-copy-exclude="true">Example department</p>
<p class="edit-block">Overview of the work.</p>
<ul><li class="edit-block">Description of a contribution.</li></ul>
```

Build copy text from the live edited DOM, not a frozen duplicate. Refresh it after body edits and whenever the panel opens. Use plain-text clipboard writes; only show success after the write resolves. On denial or unavailable clipboard support, select the read-only textarea and explain the keyboard shortcut. Keep the panel outside `.page` so it cannot affect fitting, and hide it in print CSS.

Verify overview and bullet ordering, metadata exclusion, multiple entries/languages, edited content, clipboard fallback and print exclusion. Run `node tests/copy-description.test.cjs` for the DOM-extraction regression tests; this does not replace browser clipboard/print verification.
