---
description: How to add a new project to the portfolio
---

# Adding a New Project

1.  **Create a New Folder**
    -   Go to `e:/antigravity/nexhaus/images/`
    -   Create a folder named `project_02` (or `project_03`, etc.)

2.  **Add Images**
    -   Place your project images inside this new folder.
    -   Name them sequentially (e.g., `01.jpg`, `02.jpg`) or keep their original names.

3.  **Update HTML (`index.html`)**
    -   Open `index.html`.
    -   Copy the entire `<section>` block that looks like:
        ```html
        <section class="portfolio">
            <h2 class="section-title">Project Name</h2>
            ...
        </section>
        ```
    -   Paste it below the last project section.
    -   Update the Title (`h2`) and Description.
    -   Update the `data-src` paths in the `img` tags to point to your new folder (e.g., `images/project_02/01.jpg`).

4.  **Save**
    -   Save the file and refresh your browser. The new project with its gallery will appear.
