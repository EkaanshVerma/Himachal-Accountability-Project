import os
import hmac
import hashlib
from flask import Flask, request, jsonify

# Try loading .env for local development
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

_razorpay_client = None

def get_razorpay_client():
    global _razorpay_client
    if _razorpay_client is None:
        if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
            raise RuntimeError("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment variables.")
        import razorpay
        _razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    return _razorpay_client

app = Flask(__name__)

@app.route('/api/create-order', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing request payload'}), 400
            
        amount = data.get('amount')
        currency = data.get('currency', 'INR')
        receipt = data.get('receipt', 'receipt_hap_order')
        
        if amount is None:
            return jsonify({'error': 'Amount is required'}), 400
            
        try:
            amount = int(amount)
        except (ValueError, TypeError):
            return jsonify({'error': 'Amount must be an integer'}), 400
            
        if amount < 100:
            return jsonify({'error': 'Amount must be at least 100 paise (₹1)'}), 400
            
        client = get_razorpay_client()

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
        
    except RuntimeError as e:
        return jsonify({'error': str(e)}), 500
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
        
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return jsonify({'error': 'Missing required payment verification fields'}), 400

        if not RAZORPAY_KEY_SECRET:
            return jsonify({'error': 'Server misconfigured: missing Razorpay secret key'}), 500
            
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
