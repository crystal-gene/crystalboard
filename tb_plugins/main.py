# as above
import dash
import os
os.environ["HOME"] = r"C:\Users\v-yuxingfei"
import dash_html_components as html

import dash_core_components as dcc
import crystal_toolkit.components as ctc
# standard Dash imports for callbacks (interactivity)
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate

from pymatgen import Structure, Lattice

app = dash.Dash()

# now we give a list of structures to pick from
structures = [
    Structure(Lattice.cubic(4), ["Na", "Cl"], [[0, 0, 0], [0.5, 0.5, 0.5]]),
    Structure(Lattice.cubic(5), ["K", "Cl"], [[0, 0, 0], [0.5, 0.5, 0.5]]),
]

# we show the first structure by default
structure_component = ctc.StructureMoleculeComponent(structures[0])

# and we create a button for user interaction
my_button = html.Button("Next", id="next-crystal")

# now we have two entries in our app layout,
# the structure component's layout and the button
my_layout = html.Div([structure_component.layout(), my_button])

ctc.register_crystal_toolkit(app=app, layout=my_layout, cache=None)

# for the interactivity, we use a standard Dash callback


def get_file_list():
    dirlist = os.listdir(r"D:\COD\cif\1\00\00")
    for i in dirlist:
        print(i)
        structure = Structure.from_file(os.path.join(r"D:\COD\cif\1\00\00", i))
    return dirlist


@app.callback(
    Output(structure_component.id(), "data"),
    [Input("next-crystal", "n_clicks")],
)
def update_structure(n_clicks):
    # on load, n_clicks will be None, and no update is required
    # after clicking on the button, n_clicks will be an int and incremented
    if not n_clicks:
        raise PreventUpdate
    file_list = get_file_list()
    structure = file_list[n_clicks % len(file_list)]
    structure = Structure.from_file(os.path.join(r"D:\COD\cif\1\00\00", structure))
    return structure


# as above
if __name__ == "__main__":
    # app.run_server(debug=True, port=8050)
    get_file_list()
