import glob

files = glob.glob('*.html')
old_url = 'https://script.google.com/macros/s/AKfycbzxCXtZW9mhDhxQRXo0YPH--RnOVf0waTqg1YZEorAwFzPaVSSF_8e1Vn2AzqqcAavw/exec'
new_url = 'https://script.google.com/macros/s/AKfycbwNaNhg0hj9CKEsPYICc73EMaAQhp0g597mi8R2r7vg8oNhqgWSpmaWvSjF-SV0P32x/exec'

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_url in content:
        content = content.replace(old_url, new_url)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
