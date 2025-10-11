// ===== CODE.GS =====

/**

- Shows a sidebar in the Google Doc UI.
  */
  function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile(‘Sidebar’)
  .setTitle(‘Color Contrast Checker’);
  DocumentApp.getUi().showSidebar(html);
  }

/**

- Gets the color attributes of the currently selected text.
- If there’s no selection, it uses the text at the cursor’s position.
- 
- @returns {object} An object containing the foreground and background
- colors in hex format.
  */
  function getSelectedColors() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  var foreground = ‘#000000’; // Default to black
  var background = ‘#ffffff’; // Default to white

if (selection) {
var elements = selection.getRangeElements();
if (elements.length > 0) {
var element = elements[0].getElement();

```
  // Check if the element is a Text element and not a partial selection
  if (element.asText) {
    var text = element.asText();
    var startOffset = elements[0].getStartOffset();
    
    // Ensure we check a valid character index
    var checkOffset = startOffset === -1 ? 0 : startOffset;
    
    var attrs = text.getAttributes(checkOffset);
    
    if (attrs[DocumentApp.Attribute.FOREGROUND_COLOR]) {
      foreground = attrs[DocumentApp.Attribute.FOREGROUND_COLOR];
    }
    
    if (attrs[DocumentApp.Attribute.BACKGROUND_COLOR]) {
      background = attrs[DocumentApp.Attribute.BACKGROUND_COLOR];
    }
  }
}
```

}

return { foreground: foreground, background: background };
}

// ===== SIDEBAR.HTML =====

<!DOCTYPE html>

<html>
<head>
  <base target="_top">
  <!-- Using Tailwind CSS for styling -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      padding: 1rem;
      background-color: #f8f8fc;
    }

```
.color-input-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-picker {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  background-color: transparent;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 0.375rem;
}

.color-picker::-moz-color-swatch {
  border: none;
  border-radius: 0.375rem;
}

#results-card {
  transition: all 0.3s ease-in-out;
}
```

  </style>
</head>
<body class="text-gray-800">

  <h1 class="text-xl font-bold mb-4 text-gray-900">Color Contrast Checker</h1>

  <!-- Color Selection -->

  <div class="space-y-4 mb-6">
    <div>
      <label for="foregroundColor" class="block text-sm font-medium text-gray-700 mb-1">Foreground Color</label>
      <div class="color-input-container">
        <input type="color" id="foregroundColor" value="#000000" class="color-picker">
        <input type="text" id="foregroundColorHex" value="#000000" class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
    </div>

```
<div>
  <label for="backgroundColor" class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
  <div class="color-input-container">
    <input type="color" id="backgroundColor" value="#ffffff" class="color-picker">
    <input type="text" id="backgroundColorHex" value="#ffffff" class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
  </div>
</div>
```

  </div>

  <!-- Action Button -->

  <button id="getSelectedBtn" class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-6 flex items-center justify-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16"><path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146a.5.5 0 0 0-.196.12l-.5.5a.5.5 0 0 0-.146.353v.353l-.354.146a1.207 1.207 0 0 0 0 1.708l1.5 1.5a1.207 1.207 0 0 0 1.708 0l.146-.354h.353a.5.5 0 0 0 .353-.146l.5-.5a.5.5 0 0 0 .12-.196L12 7.707l1.147 1.146a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-1.5-1.5zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"/></svg>
    Get Selected Text Colors
  </button>

  <!-- Results Display -->

  <div id="results-card" class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <h2 class="text-lg font-bold mb-3 text-gray-900">Results</h2>
    <div class="flex justify-between items-center mb-4">
      <span class="text-sm font-medium text-gray-600">Contrast Ratio:</span>
      <span id="contrastRatio" class="text-2xl font-bold text-gray-900">--</span>
    </div>

```
<div class="space-y-3">
  <div class="flex items-center justify-between">
    <h3 class="font-semibold">Normal Text (12pt)</h3>
    <div id="wcag-normal" class="flex items-center gap-4">
      <span id="wcag-normal-aa" class="px-3 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-700">AA: Fail</span>
      <span id="wcag-aaa-normal" class="px-3 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-700">AAA: Fail</span>
    </div>
  </div>

  <div class="flex items-center justify-between">
    <h3 class="font-semibold">Large Text (18pt)</h3>
    <div id="wcag-large" class="flex items-center gap-4">
      <span id="wcag-aa-large" class="px-3 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-700">AA: Fail</span>
      <span id="wcag-aaa-large" class="px-3 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-700">AAA: Fail</span>
    </div>
  </div>
</div>
```

  </div>

  <script>
    // --- ELEMENT REFERENCES ---
    var fgColorPicker = document.getElementById('foregroundColor');
    var bgColorPicker = document.getElementById('backgroundColor');
    var fgHexInput = document.getElementById('foregroundColorHex');
    var bgHexInput = document.getElementById('backgroundColorHex');
    var getSelectedBtn = document.getElementById('getSelectedBtn');
    
    var contrastRatioEl = document.getElementById('contrastRatio');
    var wcagNormalEl = document.getElementById('wcag-normal');
    var wcagAaaNormalEl = document.getElementById('wcag-aaa-normal');
    var wcagAaLargeEl = document.getElementById('wcag-aa-large');
    var wcagAaaLargeEl = document.getElementById('wcag-aaa-large');
    
    // --- COLOR PICKER SYNCHRONIZATION ---
    fgColorPicker.addEventListener('input', function() {
      fgHexInput.value = fgColorPicker.value;
      updateContrastCheck();
    });
    
    fgHexInput.addEventListener('input', function() {
      fgColorPicker.value = fgHexInput.value.toUpperCase();
      updateContrastCheck();
    });
    
    bgColorPicker.addEventListener('input', function() {
      bgColorPicker.value = bgHexInput.value;
      updateContrastCheck();
    });
    
    bgHexInput.addEventListener('input', function() {
      bgColorPicker.value = bgHexInput.value;
      updateContrastCheck();
    });
    
    getSelectedBtn.addEventListener('click', function() {
      getSelectedBtn.textContent = 'Getting colors...';
      getSelectedBtn.disabled = true;
      google.script.run
        .withSuccessHandler(updateUIWithSelectedColors)
        .withFailureHandler(onFailure)
        .getSelectedColors();
    });
    
    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', updateContrastCheck);
    
    // --- FUNCTIONS ---
    
    /**
     * Callback for successful retrieval of colors from the document.
     */
    function updateUIWithSelectedColors(colors) {
      fgColorPicker.value = colors.foreground;
      bgColorPicker.value = colors.background;
      fgHexInput.value = colors.foreground.toUpperCase();
      bgHexInput.value = colors.background.toUpperCase();
      updateContrastCheck();
      
      getSelectedBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16"><path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146a.5.5 0 0 0-.196.12l-.5.5a.5.5 0 0 0-.146.353v.353l-.354.146a1.207 1.207 0 0 0 0 1.708l1.5 1.5a1.207 1.207 0 0 0 1.708 0l.146-.354h.353a.5.5 0 0 0 .353-.146l.5-.5a.5.5 0 0 0 .12-.196L12 7.707l1.147 1.146a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-1.5-1.5zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"/></svg>Get Selected Text Colors';
      getSelectedBtn.disabled = false;
    }
    
    /**
     * Handles failure from the server-side call.
     */
    function onFailure(error) {
      console.error(error);
      alert('An error occurred: ' + error.message);
      getSelectedBtn.textContent = 'Error. Try again.';
      getSelectedBtn.disabled = false;
    }
    
    /**
     * Core function to update all UI elements based on current colors.
     */
    function updateContrastCheck() {
      var fgColor = fgColorPicker.value;
      var bgColor = bgColorPicker.value;
      var ratio = calculateContrast(fgColor, bgColor);
      
      contrastRatioEl.textContent = ratio.toFixed(2);
      
      // Update normal text results
      if (ratio >= 7) {
        document.getElementById('wcag-aa-normal').className = 'px-3 py-1 text-xs font-bold rounded-full bg-green-200 text-green-700';
        document.getElementById('wcag-aa-normal').textContent = 'AA: Pass';
      } else if (ratio >= 4.5) {
        document.getElementById('wcag-aa-normal').className = 'px-3 py-1 text-xs font-bold rounded-full bg-yellow-200 text-yellow-700';
        document.getElementById('wcag-aa-normal').textContent = 'AA: Pass';
      } else {
        document.getElementById('wcag-aa-normal').className = 'px-3 py-1 text-xs font-bold rounded-full bg-red-200 text-red-700';
        document.getElementById('wcag-aa-normal').textContent = 'AA: Fail';
      }
      
      if (ratio >= 7) {
        document.getElementById('wcag-aaa-normal').className = 'px-3 py-1 text-xs font-bold rounded-full bg-green-200 text-green-700';
        document.getElementById('wcag-aaa-normal').textContent = 'AAA: Pass';
      } else {
        document.getElementById('wcag-aaa-normal').className = 'px-3 py-1 text-xs font-bold rounded-full bg-red-200 text-red-700';
        document.getElementById('wcag-aaa-normal').textContent = 'AAA: Fail';
      }
      
      // Update large text results
      if (ratio >= 4.5) {
        document.getElementById('wcag-aa-large').className = 'px-3 py-1 text-xs font-bold rounded-full bg-green-200 text-green-700';
        document.getElementById('wcag-aa-large').textContent = 'AA: Pass';
      } else if (ratio >= 3) {
        document.getElementById('wcag-aa-large').className = 'px-3 py-1 text-xs font-bold rounded-full bg-yellow-200 text-yellow-700';
        document.getElementById('wcag-aa-large').textContent = 'AA: Pass';
      } else {
        document.getElementById('wcag-aa-large').className = 'px-3 py-1 text-xs font-bold rounded-full bg-red-200 text-red-700';
        document.getElementById('wcag-aa-large').textContent = 'AA: Fail';
      }
      
      if (ratio >= 4.5) {
        document.getElementById('wcag-aaa-large').className = 'px-3 py-1 text-xs font-bold rounded-full bg-green-200 text-green-700';
        document.getElementById('wcag-aaa-large').textContent = 'AAA: Pass';
      } else {
        document.getElementById('wcag-aaa-large').className = 'px-3 py-1 text-xs font-bold rounded-full bg-red-200 text-red-700';
        document.getElementById('wcag-aaa-large').textContent = 'AAA: Fail';
      }
    }
    
    /**
     * Calculate contrast ratio between two hex colors
     */
    function calculateContrast(color1, color2) {
      var lum1 = getLuminance(color1);
      var lum2 = getLuminance(color2);
      var brightest = Math.max(lum1, lum2);
      var darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }
    
    /**
     * Get relative luminance of a hex color
     */
    function getLuminance(hex) {
      var rgb = hexToRgb(hex);
      var a = rgb.map(function(v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    
    /**
     * Convert hex to RGB array
     */
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    }
  </script>

</body>
</html>