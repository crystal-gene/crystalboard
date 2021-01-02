from flask import Flask, request
from flask import abort
import flask
from pymongo import MongoClient
from pymatgen.core import Structure
import crystal_toolkit.components as ctc
import json
import numpy as np
import os


class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


db = MongoClient()["material_dataset"]
collection = db["materials_project"]
app = Flask(__name__)


def sample_structure():
    structure_dict = next(collection.aggregate([{"$sample": {"size": 1}}]))["structure"]
    structure = Structure.from_dict(structure_dict)
    layout_dict = ctc.StructureMoleculeComponent(
        structure,
        unit_cell_choice="conventional",
        show_compass=True
    ).initial_data["scene"]
    return layout_dict


@app.route("/sample", methods=["POST", "GET"])
def sample():
    resp = flask.Response(
        json.dumps(sample_structure(), cls=NumpyEncoder)
    )
    resp.headers["Content-Type"] = "application/json"
    return resp


@app.route("/list", methods=["POST", "GET"])
def get_trac_list():
    file_list = os.listdir("static")
    resp_obj = [{
        "name": file.rstrip(".json"),
        "reward": 0
    } for file in file_list]
    resp = flask.Response(
        json.dumps(resp_obj)
    )
    resp.headers["Content-Type"] = "application/json"
    return resp


@app.route("/step", methods=["POST", "GET"])
def get_step_content():
    trac_name = request.args.get("name", None)
    if trac_name is None or not os.path.exists(
            os.path.join("static", trac_name+".json")
    ):
        abort(404)
    with open(os.path.join("static", trac_name+".json"), "r", encoding="utf-8") as f:
        step_file = json.load(f)

    resp = flask.Response(
        json.dumps({
            "step_metadata": [{"Action": "unknown", "Step Reward": 1.} for _ in range(len(step_file)-1)],
            "structures": step_file,
            "summary": {
                "Total Reward": 0,
                "Step Length": len(step_file) - 1
            }
        })
    )
    resp.headers["Content-Type"] = "application/json"
    return resp


if __name__ == '__main__':
    app.run()
