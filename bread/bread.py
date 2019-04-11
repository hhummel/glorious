    
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

#Write logfile message
def write_log_message(status, iteration, file_path, address, message):
  with open(file_path, 'a') as f:
    if status=="attempt":
        if f:
            print ("Sending to " + address + " message: " + message, file=f)
        else:
            print ("Sending to " + address + " message: " + message)

    elif status=="success":
        if f:
            print ("Success sending to " + address + " message: " + message, file=f)
        else:
            print ("Success sending to " + address + " message: " + message)

    elif status=="connect_success":
        if f:
            print ("Success connecting to " + address + " message: " + message, file=f)
        else:
            print ("Success connecting to " + address + " message: " + message)

    elif status=="login_success":
        if f:
            print ("Success logging in to " + address + " message: " + message, file=f)
        else:
            print ("Success logging in to " + address + " message: " + message)

    elif status=="quit_success":
        if f:
            print ("Success quitting " + address + " message: " + message, file=f)
        else:
            print ("Success quitting " + address + " message: " + message)

    elif status=="failure":
        if f:
            print ("Failed attempt sending to " + address + " message: " + message, file=f)
        else:
            print ("Failed attempt sending to " + address + " message: " + message)

    elif status=="connect_failure":
        if f:
            print ("Failed attempt connecting to " + address + " message: " + message, file=f)
        else:
            print ("Failed attempt connecting to " + address + " message: " + message)

    elif status=="disconnect_failure":
        if f:
            print ("Server disconnected sending to " + address + " message: " + message, file=f)
        else:
            print ("Server disconnected sending to " + address + " message: " + message)

    elif status=="login_failure":
        if f:
            print ("Failed attempt logging into " + address + " message: " + message, file=f)
        else:
            print ("Failed attempt logging into " + address + " message: " + message)

    elif status=="quit_failure":
        if f:
            print ("Failed quitting " + address + " message: " + message, file=f)
        else:
            print ("Failed quitting " + address + " message: " + message)

    else:
        if f:
            print ("Error in write_log_message: Encountered illegal status: " + status, file=f)
        else:
            print ("Error in write_log_message: Encountered illegal status: " + status)

def mailer(subject, message, sender, recipients, log_file):
    import smtplib, time
    import email.mime.text
    import email.utils
    import datetime

    from glorious.passwords import EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_SENDER, EMAIL_ASSISTANT
    
    with open(log_file, 'a') as f:
        #Connect to server
            try:
                server=smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT)
                #Insert this for AWS
                server.starttls()
                write_log_message("connect_success", "0", log_file, EMAIL_SERVER, str(EMAIL_PORT))
            except (smtplib.socket.gaierror, smtplib.socket.error, smtplib.socket.herror):
                write_log_message("connect_failure", "0", log_file, EMAIL_SERVER, str(EMAIL_PORT))

            #Log in to connected server
            try:
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                write_log_message("login_success", "0", log_file, EMAIL_USER, datetime.datetime.now().strftime("%Y-%m-%d, %H:%M:%S"))

            except smtplib.SMTPAuthenticationError:
                write_log_message("login_failure", "0", log_file, EMAIL_USER, datetime.datetime.now().strftime("%Y-%m-%d, %H:%M:%S"))
                return "failed"

            #Fire emails to the mailing list with the appropriate subject and message
            for recipient in recipients:
                #Make the msg object
                subject = subject
                send_address = sender
                receive_address = recipient
                text_message = message
                msg = make_msg(send_address, receive_address, subject, text_message, '', '', '')

                #Send it
                try:
                    server.sendmail(send_address, recipient, msg.as_string())
                    write_log_message("success", "0", log_file, recipient, subject)

                except smtplib.SMTPServerDisconnected:
                    write_log_message("disconnect_failure", "0", log_file, recipient, subject)
                except Exception:
                    write_log_message("failure", "0", log_file, recipient, subject)

            #Close connection to mail server
            try:
                server.quit()
                write_log_message("quit_success", "0", log_file, EMAIL_SERVER, datetime.datetime.now().strftime("%Y-%m-%d, %H:%M:%S"))
                return "success"

            except():
                write_log_message("quit_failure", "0", log_file, EMAIL_SERVER, datetime.datetime.now().strftime("%Y-%m-%d, %H:%M:%S"))
                return "failed"


