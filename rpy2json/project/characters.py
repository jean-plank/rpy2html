def parse(renpy_nodes, renpy_Define, py_eval_bytecode, renpy_ADVCharacter):
    """
    Retrieves all declared characters in renpy_nodes

    :param renpy_nodes:        all nodes from renpy game
                               (renpy.game.script.namemap)
    :param renpy_Define:       the renpy Define class (renpy.ast.Define)
    :param py_eval_bytecode:   the renpy py_eval_bytecode
                               (renpy.python.py_eval_bytecode)
    :param renpy_ADVCharacter: the renpy ADVCharacter class
                               (renpy.character.ADVCharacter)
    :returns:                  a dict with all characters
    """
    res = {}

    for _key, value in renpy_nodes.iteritems():
        # get all Define statements
        if isinstance(value, renpy_Define):
            char = py_eval_bytecode(value.code.bytecode)

            # only if it's defining an ADVCharacter
            if value.store == "store" and isinstance(char, renpy_ADVCharacter) and value.varname != "_narrator":
                color = char.who_args["color"] if "color" in char.who_args else None

                res[value.varname] = {
                    "name": char.name,
                    "color": color
                }

    return res
