from flask import Flask
import flask
from pymongo import MongoClient
from pymatgen.core import Structure, Element
import crystal_toolkit.components as ctc
import json
import numpy as np
import random


db = MongoClient()["material_dataset"]
collection = db["materials_project"]
app = Flask(__name__)


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


def sample_structure():
    structure_dict = next(collection.aggregate([{"$sample": {"size": 1}}]))["structure"]
    structure = Structure.from_dict(structure_dict)
    return structure


def random_action(structure: Structure):
    structure = structure.copy()
    if 0.1 < random.random() < .2:
        structure.perturb(
            distance=0.5,
            min_distance=0.
        )
    else:
        i = random.randint(1, len(structure.sites)) - 1
        structure[i] = Element.from_Z(random.randint(1, 100))
    return structure


def get_layout(structure):
    return ctc.StructureMoleculeComponent(
        structure,
        unit_cell_choice="conventional",
        show_compass=False
    ).initial_data["scene"]


def generate_tract():
    for i in range(20):
        trace = []
        structure = sample_structure()
        for j in range(i):
            layout_dict = get_layout(structure)
            trace.append(layout_dict)
            structure = random_action(structure)
        layout_dict = get_layout(structure)
        trace.append(layout_dict)
        save(trace, f"Trace_{i}_{len(trace)}.json")


def save(obj, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(obj, f, cls=NumpyEncoder, indent=1)


if __name__ == '__main__':
    generate_tract()