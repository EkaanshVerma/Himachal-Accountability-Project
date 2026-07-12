import os

file_path = "google-apps-script-receiver.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the duplicate / misplaced createJoinSheet(ss); in the contact form block
bad_block = """    } else if (data.formType === 'contact') {
      var sheet = ss.getSheetByName('Contact Messages') || createContactSheet(ss);
  createJoinSheet(ss);"""

good_block = """    } else if (data.formType === 'contact') {
      var sheet = ss.getSheetByName('Contact Messages') || createContactSheet(ss);"""

if bad_block in content:
    content = content.replace(bad_block, good_block)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed misplaced createJoinSheet")
else:
    print("Bad block not found, already fixed?")
