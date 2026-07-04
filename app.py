import os
import hmac
import hashlib
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
import razorpay

# Load environment variables
load_dotenv()

# Fetch Razorpay keys
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise ValueError("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment variables.")

# Initialize Razorpay Client
client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Initialize Flask app
# Serve static files out of the root project folder
app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    # Route matching static HTML files and static assets
    return send_from_directory('.', path)

@app.route('/api/create-order', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing request payload'}), 400
            
        amount = data.get('amount') # in paise
        currency = data.get('currency', 'INR')
        receipt = data.get('receipt', 'receipt_hap_order')
        
        # Validate amount
        if amount is None:
            return jsonify({'error': 'Amount is required'}), 400
            
        try:
            amount = int(amount)
        except (ValueError, TypeError):
            return jsonify({'error': 'Amount must be an integer'}), 400
            
        if amount < 100:
            return jsonify({'error': 'Amount must be at least 100 paise (₹1)'}), 400
            
        # Create order via Razorpay API
        order_data = {
            'amount': amount,
            'currency': currency,
            'receipt': receipt,
            'payment_capture': 1
        }
        
        order = client.order.create(data=order_data)
        
        return jsonify({
            'order_id': order.get('id'),
            'amount': order.get('amount'),
            'currency': order.get('currency'),
            'key_id': RAZORPAY_KEY_ID
        })
        
    except razorpay.errors.SignatureVerificationError as e:
        return jsonify({'error': 'Signature verification error: ' + str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error: ' + str(e)}), 500

@app.route('/api/verify-payment', methods=['POST'])
def verify_payment():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing verification payload'}), 400
            
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        
        # Validate required fields
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return jsonify({'error': 'Missing required payment verification fields'}), 400
            
        # Verify Payment Signature
        # Signature verification formula: HMAC-SHA256(order_id + "|" + payment_id, SECRET_KEY)
        msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
        generated_sig = hmac.new(
            RAZORPAY_KEY_SECRET.encode('utf-8'),
            msg,
            hashlib.sha256
        ).hexdigest()
        
        if hmac.compare_digest(generated_sig, razorpay_signature):
            return jsonify({
                'status': 'success',
                'message': 'Payment signature verified successfully'
            })
        else:
            return jsonify({
                'status': 'failure',
                'error': 'Payment signature mismatch. Transaction is not verified.'
            }), 400
            
    except Exception as e:
        return jsonify({'error': 'Internal server error: ' + str(e)}), 500

if __name__ == '__main__':
    # Start Flask application on port 8000
    # Port 8000 matches the port the user previewed earlier
    app.run(host='0.0.0.0', port=8000, debug=True)
