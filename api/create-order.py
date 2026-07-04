import os
import hmac
import hashlib
import json

# Try loading .env for local development
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def handler(request):
    """Vercel serverless function handler for /api/create-order"""
    from http.server import BaseHTTPRequestHandler
    
    # Only allow POST
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request body
        body = request.body
        if isinstance(body, bytes):
            body = body.decode('utf-8')
        data = json.loads(body) if body else {}
        
        amount = data.get('amount')  # in paise
        currency = data.get('currency', 'INR')
        receipt = data.get('receipt', 'receipt_hap_order')
        
        # Validate amount
        if amount is None:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Amount is required'})
            }
        
        try:
            amount = int(amount)
        except (ValueError, TypeError):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Amount must be an integer'})
            }
        
        if amount < 100:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Amount must be at least 100 paise (₹1)'})
            }
        
        # Get Razorpay credentials
        key_id = os.getenv('RAZORPAY_KEY_ID', '')
        key_secret = os.getenv('RAZORPAY_KEY_SECRET', '')
        
        if not key_id or not key_secret:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Server misconfigured: missing Razorpay credentials'})
            }
        
        # Create order via Razorpay API
        import razorpay
        client = razorpay.Client(auth=(key_id, key_secret))
        
        order_data = {
            'amount': amount,
            'currency': currency,
            'receipt': receipt,
            'payment_capture': 1
        }
        
        order = client.order.create(data=order_data)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'order_id': order.get('id'),
                'amount': order.get('amount'),
                'currency': order.get('currency'),
                'key_id': key_id
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Internal server error: ' + str(e)})
        }
