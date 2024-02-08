from flask import Flask, render_template, request, send_from_directory
app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/slack_bot', methods=['POST'])
def run_slack_bot():
    import slack_bot
    slack_bot.__main__()
    return render_template('slack_bot.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)