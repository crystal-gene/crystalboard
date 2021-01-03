from summary import CrystalSummaryWriter
import pymongo
from pymatgen.core import Structure

db = pymongo.MongoClient()["material_dataset"]
collection = db["materials_project"]

writer = CrystalSummaryWriter()

for s in collection.aggregate([{"$sample": {"size": 100}}]):
    structure = Structure.from_dict(s["structure"])
    writer.add_crystal("0", structure, info={})
