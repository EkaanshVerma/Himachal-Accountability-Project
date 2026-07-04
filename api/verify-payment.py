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
    """Vercel serverless function handler for /api/verify-payment"""
    
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
        
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        
        # Validate required fields
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing required payment verification fields'})
            }
        
        key_secret = os.getenv('RAZORPAY_KEY_SECRET', '')
        if not key_secret:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Server misconfigured: missing Razorpay secret key'})
            }
        
        # Verify Payment Signature
        msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
        generated_sig = hmac.new(
            key_secret.encode('utf-8'),
            msg,
            hashlib.sha256
        ).hexdigest()
        
        if hmac.compare_digest(generated_sig, razorpay_signature):
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'status': 'success',
                    'message': 'Payment signature verified successfully'
                })
            }
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'status': 'failure',
                    'error': 'Payment signature mismatch. Transaction is not verified.'
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Internal server error: ' + str(e)})
        }
