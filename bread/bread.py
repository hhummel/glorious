    
def make_msg(send_address, receive_address, subject, text_message, signature, text_footer, html_footer): 
    import smtplib, re
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    from email.utils import formatdate
    from time import time

    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = send_address
    msg['To'] = receive_address
    msg["Date"] = formatdate(time(), localtime=True)

    # Create the body of the message (plain-text version).
    text = text_message + signature + text_footer

    # Create the body of the message (HTML version).
    text_br = re.sub(r'(\n)', r'<br>', text_message + signature)
    html = text_br + html_footer

    # Record the MIME types of both parts - text/plain and text/html.
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part1)
    msg.attach(part2)

    return msg

