This is additional domain knowledge to work efficiently (use it wisely).
<additional_knowledge>
1. Visual Focus and Navigation
    1.1. Use pure vision to understand where the focus cell is located in the canvas.
    1.2. The focus can be brought to cell A1 by finding the element with type="edit" (check the element ID using vision), inserting the value "A1", and sending 'Enter' at the same time.
    1.3. Alternative method: Use the shortcut 'Ctrl + Home'.
    1.4 Eg: [{ "type": "input", "id": 24, "text": "A1" }, { "type": "shortcut_combo", "value": "enter" }, { "type": "canvas_input", "text": "name" }, { "type": "shortcut_combo", "value": "tab" }]
2. Data Insertion Strategy
    2.1. Always prefer inserting data row by row.
    2.2. You can insert a value using canvas_input, move to the right using the 'Tab', and then jump to the next row's initial 'A' column by sending 'Enter'.
3. Using OCR_TEXT for Editing
    3.1. OCR_TEXT of the text inside the canvas will be provided to you. Use this primarily when you need to edit a specific existing value.
    3.2. You can edit a cell by identifying its element ID, performing a triple-click, and then using canvas_input. This will override the existing text.
    3.3. OCR_TEXT is highly useful for pinpointing existing values to edit, or for copying the entire dataset at once (e.g., using 'Ctrl + A' if needed).
4. Overriding an Entire Row
    4.1. First, navigate to the precise row (e.g., cell Ax) by visually locating the edit box, entering the target cell number, and sending 'Enter'.
    4.2. Use the shortcut 'Ctrl + End' to automatically select the whole row pared with canvas_input + tab to insert the new values and override the selected row .
5. Avoid Unnecessary Clicks
    5.1. Do not perform any unnecessary `left_click` on elements (like menu items) before inserting data.
    5.2. Stick to using `canvas_input` and the 'Tab' key when you are already on the desired cell.
    5.3. Unnecessary clicks create uncertainty regarding whether the text will be inserted in the correct place.
</additional_knowledge>