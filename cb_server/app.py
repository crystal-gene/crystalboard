from flask import Flask
import flask
from pymongo import MongoClient
from pymatgen.core import Structure
import crystal_toolkit.components as ctc
import json
import numpy as np


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


if __name__ == '__main__':
    app.run()
