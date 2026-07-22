import os
import re

def switch_to_milaap(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove razorpay script
    content = content.replace('<script src="https://checkout.razorpay.com/v1/checkout.js"></script>', '')

    # 2. Change text
    content = content.replace('Payments via Razorpay · UPI · Net banking · Cards', 'Payments via Milaap · UPI · Net banking · Cards')
    content = content.replace('was successfully processed via Razorpay.', 'was successfully processed via Milaap.')

    # 3. Replace JS logic
    old_js_start = "    // --- Razorpay Standard Checkout Integration ---"
    old_js_end = "    function showError(msg) {"
    
    start_idx = content.find(old_js_start)
    end_idx = content.find(old_js_end)
    
    if start_idx != -1 and end_idx != -1:
        new_js = """    // --- Milaap Integration Placeholder ---
    document.getElementById('donate-btn').addEventListener('click', function(e) {
      e.preventDefault();
      if (!selectedAmt || selectedAmt < 1) {
        showError("Amount must be at least ₹1.");
        return;
      }
      
      const originalText = this.textContent;
      this.textContent = "Redirecting to Milaap...";
      this.style.pointerEvents = "none";
      this.style.opacity = "0.7";
      
      // Placeholder: In real implementation, redirect to your specific Milaap campaign URL
      // optionally passing the selected amount as a query parameter if supported.
      setTimeout(() => {
        window.location.href = "https://milaap.org/"; 
      }, 800);
    });

"""
        content = content[:start_idx] + new_js + content[end_idx:]

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Switched {filename} to Milaap.")

switch_to_milaap('donate.html')
