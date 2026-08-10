from pathlib import Path

from flask import Flask, render_template, send_from_directory


app = Flask(__name__)
APK_DIRECTORY = Path(app.static_folder) / "downloads"
APK_FILENAME = "Neuro-Learn-v1.0.0-arm64.apk"


@app.route("/")
def index():
    return render_template(
        "index.html",
        apk_available=(APK_DIRECTORY / APK_FILENAME).is_file(),
    )


@app.route("/download/android")
def download_android():
    return send_from_directory(
        APK_DIRECTORY,
        APK_FILENAME,
        as_attachment=True,
        download_name="Neuro-Learn.apk",
    )


if __name__ == "__main__":
    app.run(debug=True)
