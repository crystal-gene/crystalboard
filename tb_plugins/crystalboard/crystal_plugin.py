from tensorboard.plugins import base_plugin
from tensorboard.backend.http_util import Respond
from .crystal_metadata import PLUGIN_NAME, FRONTEND_FILE, META_TAG
import os
from werkzeug import wrappers
import re
from tensorboard.backend.event_processing.plugin_event_multiplexer import EventMultiplexer


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
        self._multiplexer: EventMultiplexer = context.multiplexer

    def get_plugin_apps(self):
        apps_list = {}
        top = get_abs_path(FRONTEND_FILE)
        for (root, dirs, files) in os.walk(top):
            rel_root = re.sub(re.escape(top), "", root)
            route_root = rel_root.replace(os.path.sep, "/")
            if not route_root.lstrip("/"):
                route_root = ""
            for file in files:
                apps_list[route_root + "/" + file] = \
                    self.make_route(path=os.path.join(root, file))

        apps_list["/tags"] = self._serve_run_list
        apps_list["/step"] = self._serve_step_file
        apps_list["/metadata"] = self._serve_metadata
        return apps_list

    def frontend_metadata(self):
        return base_plugin.FrontendMetadata(
            es_module_path="/index.js", tab_name="Crystal", disable_reload=True,
        )

    @staticmethod
    def make_route(path):
        def make_response(request, content_type=None):
            filepath = get_abs_path(FRONTEND_FILE, path)
            if content_type != "application/font-woff2":
                with open(filepath, encoding="utf-8") as f:
                    contents = f.read()
            else:
                with open(filepath, "rb") as f:
                    contents = f.read()
            if content_type == "text/html":
                return Respond(
                    request,
                    contents,
                    content_type=content_type,
                    csp_scripts_sha256s=["mhkFuE16s38tikh4Y603deeRkLOuByjCE70D2JHo9Ls="]
                )
            else:
                return Respond(
                    request,
                    contents,
                    content_type=content_type
                )

        def has_suffix(suffix):
            return re.match(rf".+\.{re.escape(suffix)}$", path) is not None

        @wrappers.Request.application
        def _serve_file(request):
            if has_suffix("json"):
                content_type = "application/json"
            elif has_suffix("js"):
                content_type = "text/javascript"
            elif has_suffix("css"):
                content_type = "text/css"
            elif has_suffix("html"):
                content_type = "text/html"
            elif has_suffix("woff2"):
                content_type = "application/font-woff2"
            else:
                content_type = "text/plain"
            return make_response(request, content_type=content_type)

        return _serve_file

    def is_active(self):
        return bool(self._multiplexer.PluginRunToTagToContent(PLUGIN_NAME))

    @wrappers.Request.application
    def _serve_run_list(self, request):
        active_data = self._multiplexer.PluginRunToTagToContent(PLUGIN_NAME)
        resp = []
        for run, tags in active_data.items():
            for tag in tags.keys():
                if re.match(rf".+{re.escape(META_TAG)}$", tag) is None:
                    resp.append({
                        "run": run,
                        "tag": tag
                    })
        return Respond(request, resp, content_type="application/json")

    @wrappers.Request.application
    def _serve_step_file(self, request):
        run = request.args.get("run")
        tag = request.args.get("tag")
        if run is None:
            return Respond(request, 'query parameter "run" is required', 'text/plain',
                           400)
        if tag is None:
            return Respond(request, 'query parameter "tag" is required', 'text/plain',
                           400)
        resp = self._multiplexer.Tensors(run, tag)

        resp = [r_out[2].string_val[0].decode("utf-8") for r_out in resp]

        resp = "[" + ",".join(resp) + "]"

        return Respond(request, resp, content_type="application/json")

    @wrappers.Request.application
    def _serve_metadata(self, request):
        run = request.args.get("run")
        tag = request.args.get("tag")
        if run is None:
            return Respond(request, 'query parameter "run" is required', 'text/plain',
                           400)
        if tag is None:
            return Respond(request, 'query parameter "tag" is required', 'text/plain',
                           400)
        resp = self._multiplexer.Tensors(run, tag + META_TAG)

        resp = [r_out[2].string_val[0].decode("utf-8") for r_out in resp]

        resp = "[" + ",".join(resp) + "]"

        return Respond(request, resp, content_type="application/json")
