import os
import re

def update_html_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # --- 1. HTML Update ---
    # Find the loc-btn button block and append the manual button and input
    # Be careful not to replace it multiple times
    if 'id="loc-manual-btn"' not in content:
        # Match loc-btn block
        # It usually ends with `Enable Location\n          </button>`
        pattern_html = re.compile(r'(<button id="loc-btn".*?>.*?Enable Location\s*</button>)', re.DOTALL)
        
        manual_html = """
          <button type="button" id="loc-manual-btn" style="
            width:100%; padding:10px; margin: 5px 0 10px 0;
            font-family:'IBM Plex Sans', sans-serif; font-size:0.8rem;
            background: transparent; color: var(--sage); border:1px dashed var(--sage);
            cursor:pointer; transition: var(--transition); display:block;
          ">
            I'll input location manually
          </button>
          
          <div id="loc-manual-input" style="display:none; margin: 10px 0;">
            <input type="text" id="manual-loc-text" placeholder="Enter Pincode, Village or District" style="
              width:100%; box-sizing:border-box;
              padding:12px; margin:0 0 10px 0;
              font-family:'IBM Plex Sans',sans-serif; font-size:0.88rem;
              background: var(--paper-deep); color: var(--ink);
              border:1px solid var(--paper-line); outline:none;
            " />
            <button type="button" id="loc-manual-confirm-btn" style="
              width:100%; padding:12px;
              font-family:'IBM Plex Mono', monospace; font-size:0.78rem;
              font-weight:600; text-transform:uppercase; letter-spacing:0.08em;
              background: var(--sage); color: var(--cream); border:1px solid var(--sage);
              cursor:pointer; transition: var(--transition);
            ">
              Confirm Location
            </button>
          </div>
"""
        content = pattern_html.sub(r'\1' + manual_html, content)

    # --- 2. JS Update ---
    # Insert logic before `// Location\n    locBtn.addEventListener('click',`
    if 'locManualBtn.addEventListener' not in content:
        js_insert = """
    // Manual Location
    var locManualBtn = document.getElementById('loc-manual-btn');
    var locManualInput = document.getElementById('loc-manual-input');
    var manualLocText = document.getElementById('manual-loc-text');
    var locManualConfirmBtn = document.getElementById('loc-manual-confirm-btn');

    if (locManualBtn) {
      locManualBtn.addEventListener('click', function(e) {
        e.preventDefault();
        locBtn.style.display = 'none';
        locManualBtn.style.display = 'none';
        locManualInput.style.display = 'block';
      });

      locManualConfirmBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var val = manualLocText.value.trim();
        if (!val) {
          locStatus.textContent = 'Please enter a location.';
          locStatus.style.color = 'var(--stamp)';
          return;
        }
        reportData.lat = 0;
        reportData.lng = 0;
        reportData.locationName = val;
        locCoords.textContent = 'Manual Entry';
        locName.textContent = val;
        
        locManualInput.style.display = 'none';
        locData.style.display = 'grid';
        locStatus.textContent = '';
        if (typeof checkReady === 'function') {
          checkReady();
        }
      });
    }

"""
        # We find `    // Location\n    locBtn.addEventListener('click', function(){`
        content = content.replace("    // Location\n    locBtn.addEventListener('click',", js_insert + "    // Location\n    locBtn.addEventListener('click',")

    # --- 3. report-issue.html location modal handling ---
    # If it's report-issue.html, add it to the modal as well, just in case
    if 'location-modal-btn' in content and 'I\'ll input location manually' not in content:
         modal_pattern = re.compile(r'(<button id="location-modal-btn".*?Give Location</button>)', re.DOTALL)
         modal_manual_html = """
    <button id="location-manual-modal-btn" style="
      width:100%; padding:10px; margin-top:10px;
      font-family:'IBM Plex Sans', sans-serif; font-size:0.85rem;
      background: transparent; color: var(--ink); border:1px dashed var(--ink);
      cursor:pointer; transition: var(--transition);
    ">I'll input location manually</button>
    <div id="location-manual-modal-input" style="display:none; margin-top:10px;">
      <input type="text" id="manual-modal-text" placeholder="Village / District" style="width:100%; padding:10px; margin-bottom:10px; font-family:'IBM Plex Sans',sans-serif; font-size:0.9rem; border:1px solid var(--paper-line); outline:none; background:var(--paper); color:var(--ink);">
      <button id="confirm-modal-manual-btn" style="width:100%; padding:10px; background:var(--ink); color:var(--cream); border:none; font-family:'IBM Plex Mono',monospace; font-weight:600; text-transform:uppercase; cursor:pointer;">Confirm</button>
    </div>
"""
         content = modal_pattern.sub(r'\1' + modal_manual_html, content)
         
         # And handle it in JS below
         js_modal_handling = """
      document.getElementById('location-manual-modal-btn').addEventListener('click', function() {
        document.getElementById('location-modal-btn').style.display = 'none';
        document.getElementById('location-manual-modal-btn').style.display = 'none';
        document.getElementById('location-manual-modal-input').style.display = 'block';
      });
      document.getElementById('confirm-modal-manual-btn').addEventListener('click', function() {
        var val = document.getElementById('manual-modal-text').value.trim();
        if(!val) return;
        modal.style.display = 'none';
        localStorage.setItem('hap_location_prompted', 'true');
        // If loc-btn doesn't exist, we can't click it. But we can trigger the same manual fill if loc-btn is missing.
        var mBtn = document.getElementById('loc-manual-btn');
        var mText = document.getElementById('manual-loc-text');
        var mConfirm = document.getElementById('loc-manual-confirm-btn');
        if (mBtn && mText && mConfirm) {
           mText.value = val;
           mConfirm.click();
        }
      });
"""
         content = content.replace("document.getElementById('location-modal-btn').addEventListener('click', function() {", js_modal_handling + "\n      document.getElementById('location-modal-btn').addEventListener('click', function() {")
         

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

update_html_file('index.html')
update_html_file('himachal-accountability-landing (1).html')
update_html_file('report-issue.html')
