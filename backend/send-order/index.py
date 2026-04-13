"""
Отправка заявки с сайта на почту vyatkalux@yandex.ru
"""
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    try:
        body = json.loads(event.get('body', '{}'))
    except Exception:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Неверный формат данных'})
        }

    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Заполните имя и телефон'})
        }

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    sender_email = 'vyatkalux@yandex.ru'
    recipient_email = 'vyatkalux@yandex.ru'

    subject = f'Новая заявка с сайта RUBITEL — {name}'

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: #111; padding: 24px 32px; border-top: 4px solid #fbb034;">
          <h1 style="margin: 0; color: #fbb034; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">
            RUBITEL
          </h1>
          <p style="margin: 4px 0 0; color: #888; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">
            Новая заявка с сайта
          </p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Имя / Компания</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #222; font-size: 15px; font-weight: bold;">{name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Телефон</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #222; font-size: 15px; font-weight: bold;">{phone}</td>
            </tr>
            {"<tr><td style='padding: 10px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;'>Сообщение</td><td style='padding: 10px 0; color: #222; font-size: 14px; line-height: 1.6;'>" + message + "</td></tr>" if message else ""}
          </table>
        </div>
        <div style="background: #f9f9f9; padding: 16px 32px; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #aaa; font-size: 12px;">Заявка отправлена с сайта RUBITEL</p>
        </div>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(sender_email, smtp_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'success': True, 'message': 'Заявка отправлена!'})
    }