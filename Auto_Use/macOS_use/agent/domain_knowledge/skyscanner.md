This is additional domain knowledge to work efficiently (use it wisely).
<additional_knowledge>
1. Dropdown Interaction Logic: When selecting an option from a dropdown, execute only the selection action. Do not attempt multiple simultaneous actions, as this may break the clicking logic.
   - Recovery: If a dropdown menu remains open after a selection is made, use the 'Esc' key to close it and proceed.
2. SkyScanner Input Fields: Input fields on SkyScanner are configured as ComboBox elements. They display options as a dropdown list; ensure the agent explicitly selects the desired value from the resulting list rather than just typing.
3. Search Button Verification: The search button is highly inconsistent. You may receive a success tool response even if the click failed to register.
   - Mandatory Verification: Use os_vision to confirm the search has actually triggered. If the screen has not changed, retry the click (it may require 2-3 attempts to register).
4. Flight Sorting Selection: Flight results typically feature three categories: Best, Cheapest, and Fastest.
   - Unless the user specifies otherwise, always default to selecting the Cheapest option first.
5. Proof of Purchase/Booking: If the user requests proof, navigate to the full flight details view, ensure all relevant information is visible, and generate a PDF of that specific screen.
</additional_knowledge>