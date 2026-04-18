This is additional domain knowledge to work efficiently (use it wisely).
<additional_knowledge>
1. Screenshot and OCR_TEXT Behavior
    1.1. The elements and OCR_TEXT marked on the screenshot are not literally marked on the actual screen. 
    1.2. Unless you need to read the raw, unobstructed screen content, avoid relying solely on the clean screenshot.
2. Copying Specific Paragraphs from Documentation
    2.1. Use OCR_TEXT to select the desired paragraph.
    2.2. First, identify the paragraph you want to copy. Locate its first word and the corresponding element ID number above it.
    2.3. Send a triple-click to that element ID. The whole paragraph will be selected automatically. You can then use 'Ctrl + C' to copy it for your given scenario.
    2.4. Handling Hyperlinks: You must not click on hyperlinked text (usually indicated by a different color, like blue). If the first word of the paragraph is a hyperlink, send your triple-click to the second word instead. Be smart about your click targets.
3. Navigating and Scraping Content
    3.1. To navigate inside specific content, single-click the hyperlink using OCR_TEXT.
    3.2. This is extremely useful for in-depth content scraping.
    3.3. If the extraction or understanding of the words is difficult due to the OCR bounding boxes, take a full, clean screenshot. This will remove the overlay boxes, allowing you to read and store the raw content clearly in next iteration.
    3.4. You can also take screenshots of images if requested by the user or when making robust documentation.
</additional_knowledge>