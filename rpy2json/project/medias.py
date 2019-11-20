from os import path


def load(GAME_BASE_DIR, res, media_type, key, media):
    if media != None:
        full_path = path.join(GAME_BASE_DIR, media)
        if path.isfile(full_path):
            res[media_type][key] = full_path
            return
        else:
            var_name = full_path
    else:
        var_name = key
    print('[WARNING] couldn\'t import %s %s' % (media_type[:-1], var_name))
