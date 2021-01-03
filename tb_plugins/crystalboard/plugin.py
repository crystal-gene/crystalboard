from tensorboard.plugins import base_plugin
from metadata import PLUGIN_NAME, FRONTEND_FILE
import json
import os
import werkzeug
from werkzeug import wrappers
import re
from functools import partial


def get_abs_path(*rel_path):
    return os.path.join(
        os.path.dirname(os.path.abspath(__file__)), *rel_path
    )


def add_prefix_to_path(prefix, path):
    return os.path.join(prefix, path)


class CrystalPlugin(base_plugin.TBPlugin):
    plugin_name = PLUGIN_NAME

    def __init__(self, context):
        super(CrystalPlugin, self).__init__(context)
        self.multiplexer = context.multiplexer

    def get_plugin_apps(self):
        apps_list = {}
        root_dir = get_abs_path(FRONTEND_FILE)
        for (root, dirs, files) in os.walk(root_dir):
            root = root.lstrip(root_dir)
            route_root = root.replace(os.path.sep, "/")
            for file in files:
                path = os.path.join(root, file)
                apps_list[route_root + "/" + file] = partial(self._serve_file, path=os.path.join(root, path))

        return apps_list

    def frontend_metadata(self):
        return base_plugin.FrontendMetadata(
            es_module_path="/index.js", tab_name="Crystal"
        )

    @wrappers.Request.application
    def _serve_file(self, path):
        has_suffix = lambda suffix, pattern: \
            re.match(rf".+\.{re.escape(suffix)}$", path) is not None

        if has_suffix("json", path):
            content_type = "application/json"
        elif has_suffix("js", path):
            content_type = "text/javascript"
        elif has_suffix("css", path):
            content_type = "text/css"
        elif has_suffix("html", path):
            content_type = "text/html"
        else:
            content_type = None
        return self.make_response(path, content_type=content_type)

    @staticmethod
    def make_response(path, content_type=None):
        filepath = os.path.join(get_abs_path(FRONTEND_FILE, path))
        with open(filepath) as f:
            contents = f.read()
        return werkzeug.Response(contents, content_type=content_type)

    def is_active(self):
        return bool(self._multiplexer.PluginRunToTagToContent(PLUGIN_NAME))
