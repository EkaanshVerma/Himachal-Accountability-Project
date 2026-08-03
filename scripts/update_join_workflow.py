import re

# Update google-apps-script-receiver.js
js_file = 'google-apps-script-receiver.js'
with open(js_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Insert into doPost
join_post_block = """    } else if (data.formType === 'join') {
      var sheet = ss.getSheetByName('Volunteers') || createJoinSheet(ss);

      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.email || '',
        data.tel || '',
        data.constituency || '',
        data.roles || '',
        data.statement || '',
        'New' // Status
      ]);

      sendJoinNotification(data);

"""
js_content = js_content.replace("    } else if (data.formType === 'contact') {", join_post_block + "    } else if (data.formType === 'contact') {")

# Insert into getOrCreateSpreadsheet
js_content = js_content.replace("createContactSheet(ss);", "createContactSheet(ss);\n  createJoinSheet(ss);")

# Add new functions at the bottom
join_functions = """
function createJoinSheet(ss) {
  var sheet = ss.insertSheet('Volunteers');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Phone', 'Constituency', 'Roles', 'Statement', 'Status'
    ]);

    var headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2D3B2D');
    headerRange.setFontColor('#F3F1E6');

    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 150);
    sheet.setColumnWidth(5, 200);
    sheet.setColumnWidth(6, 250);
    sheet.setColumnWidth(7, 400);
    sheet.setColumnWidth(8, 100);

    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendJoinNotification(data) {
  var email = Session.getActiveUser().getEmail();
  if (!email) return;

  var subject = '🙋 New Volunteer: ' + (data.name || 'Unknown');
  var body = 'New volunteer application received via HAP website.\\n\\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n' +
    'Name: ' + (data.name || '—') + '\\n' +
    'Email: ' + (data.email || '—') + '\\n' +
    'Phone: ' + (data.tel || '—') + '\\n' +
    'Constituency: ' + (data.constituency || '—') + '\\n' +
    'Roles: ' + (data.roles || '—') + '\\n' +
    'Statement:\\n' + (data.statement || '(no statement)') + '\\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n' +
    'Timestamp: ' + (data.timestamp || new Date().toISOString()) + '\\n';

  MailApp.sendEmail(email, subject, body);
}
"""
js_content += join_functions

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

# Update join.html
html_file = 'join.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Add the script to join.html if not already there
join_script = """
<script>
// Join Form Submit Handler
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwtGIYODqYbgOKkSfkykAc0oguxYe7h-bdxq_GG-J0eUVqGTL-Jw5G0S5CXBau6-j1R/exec';

const applyForm = document.getElementById('apply-form');
if (applyForm) {
  applyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    // Get checked roles
    const checkedRoles = Array.from(form.querySelectorAll('input[name="role"]:checked'))
      .map(cb => cb.value)
      .join(', ');

    const payload = {
      formType: 'join',
      name: document.getElementById('volunteer-name').value,
      email: document.getElementById('volunteer-email').value,
      tel: document.getElementById('volunteer-tel').value,
      constituency: document.getElementById('volunteer-constituency').value,
      roles: checkedRoles,
      statement: document.getElementById('volunteer-statement').value,
      timestamp: new Date().toISOString()
    };

    fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      document.getElementById('form-success').style.display = 'block';
      form.reset();
      window.scrollTo({
        top: document.getElementById('form-success').offsetTop - 120,
        behavior: 'smooth'
      });
    }).catch(err => {
      console.error('Error sending application:', err);
      alert("Oops! Something went wrong submitting your application. Please try again or email us directly.");
    }).finally(() => {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    });
  });
}
</script>
</body>
"""

if "// Join Form Submit Handler" not in html_content:
    html_content = html_content.replace('</body>', join_script)
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

print("Updates completed successfully.")
