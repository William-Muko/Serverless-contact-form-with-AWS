import json
import boto3
import os

ses = boto3.client('ses', region_name='us-east-1')  # Change region if needed

SENDER = os.environ.get('SENDER_EMAIL', 'janedoe@example.com')  # From email (must be verified in SES)
RECIPIENT = os.environ.get('RECIPIENT_EMAIL', 'johndoe@example.com')  # To email (can be same as sender in Sandbox)

def lambda_handler(event, context):
    print(f"Event received: {json.dumps(event)}")
    
    # CORS headers for all responses
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    }
    
    # Handle preflight OPTIONS request
    if event.get('httpMethod') == 'OPTIONS':
        print("Handling OPTIONS request")
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        # Debug: Show all event keys
        print(f"Event keys: {list(event.keys())}")
        print(f"Body exists: {'body' in event}")
        print(f"Body value: {event.get('body')}")
        print(f"Body type: {type(event.get('body'))}")
        
        # Handle different event structures
        if 'body' in event and event['body']:
            # API Gateway format
            request_body = event['body']
            if event.get('isBase64Encoded', False):
                import base64
                request_body = base64.b64decode(request_body).decode('utf-8')
            print(f"Request body: {request_body}")
            body = json.loads(request_body)
            name = body.get('name')
            email = body.get('email')
            message = body.get('message')
        elif 'name' in event and 'email' in event and 'message' in event:
            # Direct Lambda test format
            print("Using direct event format")
            name = event.get('name')
            email = event.get('email')
            message = event.get('message')
        else:
            print("No valid data format found")
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid request format'})
            }
        
        print(f"Parsed data - Name: {name}, Email: {email}, Message: {message}")

        if not (name and email and message):
            print("Missing required fields")
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Missing name, email, or message'})
            }

        # Compose the email
        subject = f"New contact form submission from {name}"
        body_text = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

        # Check SES verified identities first
        try:
            verified_emails = ses.list_verified_email_addresses()
            print(f"Verified emails: {verified_emails['VerifiedEmailAddresses']}")
        except Exception as verify_error:
            print(f"Error checking verified emails: {verify_error}")
        
        # Send the email using SES
        print(f"Sending email from {SENDER} to {RECIPIENT}")
        
        try:
            response = ses.send_email(
                Source=SENDER,
                Destination={'ToAddresses': [RECIPIENT]},
                Message={
                    'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                    'Body': {
                        'Text': {'Data': body_text, 'Charset': 'UTF-8'},
                        'Html': {'Data': f'<p><strong>Name:</strong> {name}</p><p><strong>Email:</strong> {email}</p><p><strong>Message:</strong></p><p>{message}</p>', 'Charset': 'UTF-8'}
                    }
                }
            )
            print(f"SES SUCCESS - MessageId: {response['MessageId']}")
            print(f"Full SES Response: {response}")
        except Exception as ses_error:
            print(f"SES ERROR: {str(ses_error)}")
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': f'SES Error: {str(ses_error)}'})
            }
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': f'Email sent successfully. MessageId: {response["MessageId"]}'})
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }