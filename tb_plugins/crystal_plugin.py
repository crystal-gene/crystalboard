from tensorboard.plugins import base_plugin
from metadata import PLUGIN_NAME


class CrystalPlugin(base_plugin.TBPlugin):
    plugin_name = PLUGIN_NAME

    def __init__(self, context):
        super(CrystalPlugin, self).__init__(context)
        self.multiplexer = context.multiplexer

    def get_plugin_apps(self):
        return {"/crystal": self._serve_crystal}

    def _serve_crystal(self):
        ...

    def frontend_metadata(self):
        return base_plugin.FrontendMetadata(
            es_module_path="/index.js", tab_name="Crystal"
        )

    def is_active(self):
        return bool(self._multiplexer.PluginRunToTagToContent(PLUGIN_NAME))
