from torch.utils.tensorboard import SummaryWriter
from pymatgen.core import Structure
import json
from tensorboard.compat.proto.summary_pb2 import Summary, SummaryMetadata
from tensorboard.compat.proto.tensor_pb2 import TensorProto
from tensorboard.compat.proto.tensor_shape_pb2 import TensorShapeProto
import crystal_toolkit.components as ctc
import numpy as np
from metadata import PLUGIN_NAME


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


def get_layout(structure: Structure):
    return ctc.StructureMoleculeComponent(
        structure,
        show_compass=True
    ).initial_data["scene"]


def _create_summary_metadata(description):
    return SummaryMetadata(
        summary_description=description,
        plugin_data=SummaryMetadata.PluginData(
            plugin_name=PLUGIN_NAME,
            content=b"Version:0.1.0",  # no need for summary-specific metadata
        ),
    )


def crystal(tag, structure_layout, info, description=None):
    obj_to_write = {
        "structure": structure_layout,
        "info": info
    }
    stringfy_obj = json.dumps(obj_to_write, cls=NumpyEncoder)
    metadata = _create_summary_metadata(description=description)
    tensor = TensorProto(dtype='DT_STRING',
                         string_val=[stringfy_obj.encode(encoding='utf_8')],
                         tensor_shape=TensorShapeProto(dim=[TensorShapeProto.Dim(size=1)]))
    return Summary(value=[Summary.Value(tag=tag, tensor=tensor, metadata=metadata)])


class CrystalSummaryWriter(SummaryWriter):
    def add_crystal(
            self,
            tag,
            structure: Structure,
            info,
            global_step=None,
            walltime=None
    ):
        """Add crystal structure to summary.

        Args:
            tag (string): Data identifier
            structure (string): structure to show
            global_step (int): Global step value to record
            info (dict): all the additional info to save/show on the screen
            walltime (float): Optional override default walltime (time.time())
              seconds after epoch of event
        """
        self._get_file_writer().add_summary(
            crystal(tag, get_layout(structure), info), global_step, walltime
        )
