This is additional domain knowledge to work efficiently (use it wisely).
<additional_knowledge>
*hide gemini chat box if visisble by clicking gemini toggle button at bottom*
1. Context and Environment
    1.1. You are operating in a Jupyter or Google Colab notebook environment.
    1.2. All code must be written inside notebook cell blocks.
2. Code Organization
    2.1. Colab doesn't have everything pre-installed, so always use `!pip install` if you need to import missing libraries.
    2.2. Break the code down into small, logical sections using individual cells.
    2.3. Example Machine Learning Pipeline:
        2.3.1. Cell 1: !pip install / Load the data.
        2.3.2. Cell 2: Data cleaning and preprocessing (handling missing values, standardizing data).
        2.3.3. Cell 3: Splitting the data.
        2.3.4. Cell 4: Model training and hyperparameter tuning.
3. Execution and Verification
    3.1. Each section must be verified visually.
    3.2. Write the code for a block, run it, and check the output.
    3.3. If it throws an error, scroll down to read the traceback, understand the issue, and immediately fix it before moving on.
4. Inserting Text into a Cell
    4.1. Use the input to insert fresh code.
5. Editing Cell Code
    5.1. Complete Override: If you want to completely rewrite the code in a cell, use `input`. It will override the entire old content and insert fresh code.
    5.2. Specific Line Editing: If you want to edit a specific line or add a new line:
        5.2.1. Use the `OCR_TEXT` left_click.
        5.2.2. Check which line you want to edit, look at its any word, and send a double-click  on that element [id] first word, followed by the shortcut 'Shift + End' in same. This will select the whole line.
        5.2.3. Now you can use `canvas_input` to override the selected line. You can also add any extra lines below it during this step.
        5.2.4. Be extremely careful while editing lines; always check the indentation.
        5.2.5. Example Scenario: Suppose there is an error on line 5 where the code incorrectly starts with "dt" instead of "df". In the image and element tree, this word is identified as `[108]<Word="dt", type="OCR_TEXT", active="True", visibility="full" />`. The action sequence to highlight and replace this line would be:
            5.2.5.1. [{"type": "left_click", "id": 108, "clicks": 2}, {"type": "shortcut_combo", "value": "shift+end"}, {"type": "canvas_input", "value": "df = pd.read_csv('ultimate_student_productivity_dataset_5000.csv')"}]
    5.3. Alternative Method: You may use the terminal to edit cell lines, but remember that the final executed code must reside within the notebook cells, not just in terminal scripts.
6. Explicitly determine if the error originates from the newly written code or from previously executed cells.
    6.1. Ensure you run the cell immediately after writing the code before assessing any errors.
    6.2. If the cell is not run during this step, store a note in 'memory' indicating that running the cell is pending.
7. Each cell has its own output cell. Scroll through it to understand any errors if needed.
</additional_knowledge>
