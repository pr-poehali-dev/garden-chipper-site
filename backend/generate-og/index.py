import os
import boto3
import requests
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    """Возвращает Liberation Sans шрифт нужного размера"""
    if bold:
        path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
    else:
        path = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    return ImageFont.truetype(path, size)

def handler(event: dict, context) -> dict:
    """Генерирует OG-картинку Rubitel: логотип + крупные надписи, шрифт скачивается динамически"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': ''}

    W, H = 1200, 630
    orange = (245, 158, 11)
    white = (255, 255, 255)
    bg = (26, 26, 26)

    img = Image.new('RGB', (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Загружаем и перекрашиваем логотип
    logo_url = "https://cdn.poehali.dev/projects/30589419-8040-421a-8f96-70e5f7c9160c/bucket/6b67ee50-70c7-45fa-a36e-ef28f9047b4d.png"
    resp = requests.get(logo_url, timeout=15)
    logo_orig = Image.open(BytesIO(resp.content)).convert("RGBA")

    logo_size = 300
    logo = logo_orig.resize((logo_size, logo_size), Image.LANCZOS)
    new_data = []
    for r, g, b, a in logo.getdata():
        new_data.append((orange[0], orange[1], orange[2], a) if a > 10 else (0, 0, 0, 0))
    logo.putdata(new_data)

    logo_x = 80
    logo_y = (H - logo_size) // 2
    img.paste(logo, (logo_x, logo_y), logo)

    # Шрифты — скачиваем Roboto
    font_title = get_font(170, bold=True)
    font_sub = get_font(56, bold=False)

    # Текст справа
    text_x = logo_x + logo_size + 60
    draw.text((text_x, 150), "RUBITEL", font=font_title, fill=white)
    draw.text((text_x, 360), "INDUSTRIAL EQUIPMENT", font=font_sub, fill=orange)

    # Оранжевая полоса снизу
    draw.rectangle([(0, H - 12), (W, H)], fill=orange)

    buf = BytesIO()
    img.save(buf, format='JPEG', quality=95)
    buf.seek(0)

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    import json
    key = 'og/rubitel-og-v6.jpg'
    s3.put_object(Bucket='files', Key=key, Body=buf.read(), ContentType='image/jpeg')

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({"url": cdn_url})
    }