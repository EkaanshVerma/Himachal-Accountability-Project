import os
import re

def update_html_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # --- 3. location modal handling ---
    # Update the modal in any file if it hasn't been updated yet.
    if 'location-modal-btn' in content and 'id="location-manual-modal-btn"' not in content:
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
