from flask import Flask, render_template, jsonify, request
import random
import os

app = Flask(__name__)

system_status = "OFF"

stations = {
    "A": 220,
    "B": 210,
    "C": 230
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/data')
def data():
    result = {}

    for key in stations:
        if system_status == "ON":
            voltage = random.randint(170, 260)
        else:
            voltage = 0

        if system_status == "OFF":
            fault = "SYSTEM OFF"
        else:
            fault = "FAULT" if (voltage > 240 or voltage < 180) else "NORMAL"

        result[key] = {
            "voltage": voltage,
            "fault": fault
        }

    return jsonify({
        "status": system_status,
        "stations": result
    })

@app.route('/control', methods=['POST'])
def control():
    global system_status
    data = request.get_json(silent=True)
    if data and "action" in data:
        system_status = data["action"]
    return jsonify({"status": system_status})

# Only used for local testing — Render uses gunicorn
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))