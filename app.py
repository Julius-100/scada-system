from flask import Flask, render_template, jsonify, request
import random

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
    global stations

    result = {}

    for key in stations:
        if system_status == "ON":
            stations[key] = random.randint(170, 260)

        voltage = stations[key]

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

    data = request.get_json()
    if data and "action" in data:
        system_status = data["action"]

    return jsonify({"status": system_status})

if __name__ == '__main__':
    
    import os

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))