from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import setuptools


setuptools.setup(
    name="crystalboard",
    version="0.1.0",
    description="TensorBoard plugin for crystal visualization.",
    packages=["crystalboard"],
    package_data={
        "crystalboard": ["build/**"],
    },
    install_requires=['werkzeug', 'tensorboard', 'numpy', "crystal-toolkit"],
    entry_points={
        "tensorboard_plugins": [
            "example = crystalboard.crystal_plugin:CrystalPlugin",
        ],
    },
)
