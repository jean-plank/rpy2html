def parse(renpy):
    '''
    Retrieves all declared characters in renpy.game.script.namemap
    Returns a dict with all characters.
    '''
    res = {}

    for _key, value in renpy.game.script.namemap.iteritems():
        # get all Define statements
        if isinstance(value, renpy.ast.Define):
            char = renpy.python.py_eval_bytecode(value.code.bytecode)

            # only if it's defining an ADVCharacter
            if (value.store == 'store'
                and isinstance(char, renpy.character.ADVCharacter)
                and value.varname != '_narrator'
                and value.varname != 'centered'
                    and value.varname != 'vcentered'):
                color = char.who_args['color'] if 'color' in char.who_args else None

                res[value.varname] = {
                    'name': char.name,
                    'color': color
                }

    return res
