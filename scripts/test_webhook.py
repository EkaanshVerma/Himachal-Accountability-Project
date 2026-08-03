import urllib.request
import json
import ssl

url = "https://script.google.com/macros/s/AKfycbwNaNhg0hj9CKEsPYICc73EMaAQhp0g597mi8R2r7vg8oNhqgWSpmaWvSjF-SV0P32x/exec"
data = {
    "formType": "join",
    "name": "Test Name",
    "email": "test@example.com",
    "tel": "1234567890",
    "constituency": "Shimla",
    "roles": "Observer",
    "statement": "Test statement"
}

req = urllib.request.Request(url, method="POST")
req.add_header('Content-Type', 'text/plain')
data_bytes = json.dumps(data).encode('utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(req, data=data_bytes, context=ctx) as response:
        print("Status code:", response.getcode())
        print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print("Error response:", e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
