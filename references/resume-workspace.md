# Reusable Resume Workspace

Use this reference when importing a resume for the first time, resuming job-description (JD) tailoring, or packaging files for another Agent or conversational AI.

## Purpose

Avoid reparsing the same PDF for every application. A PDF or Word resume is an initial calibration source. After extraction and user confirmation, later tailoring should normally use lightweight Markdown plus the saved layout profile.

## Files

Keep three independent layers:

1. `经历库.md` — the richest factual source, including evidence not currently selected for a resume.
2. `基础简历.md` — the user's current general-purpose resume content and section order, without tailoring it to one company.
3. `简历版式档案.md` — the visual and structural defaults needed to recreate the source design.
4. `基础简历.html` — optional but preferred reusable editable master containing the proven toolbar, CSS, print logic, and current base content.

The original PDF or Word file may remain as optional archival evidence. Do not require it on every run.

## Building the base resume

On the first useful resume import:

1. extract its visible text, sections, order, dates, bullets, and links;
2. record content in neutral Markdown without OCR line-wrap artifacts;
3. record typography, colors, page margins, dividers, alignment, date placement, column use, and density separately;
4. show the extracted base content and material layout choices for correction;
5. save the files when writing is available or provide them for download.

Do not infer that every fact in the evidence bank belongs in the base resume. The base resume records current selection; the evidence bank records available truth.

## Optional direction baselines and project material

At first baseline creation, ask which roles or directions the user is targeting, unless already known. For recurring use across distinct directions, offer a few direction baselines and explain that they save repeated selection and drafting. One direction needs only one baseline; let the actual goals determine the number. Create additional directions only when the user chooses them. See README for the benefits.

Keep a direction index and only load the closest draft. Each direction is a reusable starting selection, followed by fresh JD analysis, evidence lookup and Grooming. Preserve the chosen visual design. Company-specific omissions stay scoped to that version; explicit long-term decisions are reused.

Maintain an optional project material library using `project-material-library.md`. The evidence bank supplies facts, project material supplies selectable angles, and direction baselines supply starting drafts.

## Later job-description (JD) runs

Before asking for another resume file, search the current workspace or supplied package for these files. If present:

- use `基础简历.md` to compare current coverage, wording, and section selection;
- use the evidence index and only relevant evidence sections to find stronger or overlooked material;
- use `简历版式档案.md` when generating the final artifact;
- when `基础简历.html` exists, duplicate and patch it rather than rebuilding the HTML shell;
- ask whether the saved base is still current only when there is a concrete sign it may be stale.

Request a new source resume only when the user says it changed, wants a new source design, or a required field cannot be reconstructed from the saved files. Do not request a PDF merely because a new job description (JD) arrived.

## Updating

- New facts, corrected data, and later developments update the evidence bank.
- A tailored application remains a company-specific output.
- Update `基础简历.md` only when the user wants an accepted change to become the new general default.
- Update `简历版式档案.md` only when the default visual system changes.
- Update `基础简历.html` after an approved general content change or editor fix; company-specific wording does not overwrite it.
- Preserve a `last confirmed` date in both reusable files so staleness can be judged without reopening the source PDF.

## Portable package

For an Agent without persistent filesystem access, offer a downloadable package containing:

```text
经历库.md
基础简历.md
简历版式档案.md
```

The user can upload this small package to a new conversation instead of repeatedly uploading and parsing a PDF. Other requested formats may be added, but Markdown remains the default portable source.
