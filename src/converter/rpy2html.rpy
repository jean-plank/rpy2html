init python:
    import os

    print("Hello world!")

    js = """
import toto from '../src/game-engine/functions.js';
import '../src/game-engine/base.css';
import './converted.css';


toto();
    """

    css = """
p {
    color: blue;
}
    """

    # print("os.path.dirname(__file__) =", os.path.dirname(__file__))
    # print("os.getcwd() =", os.getcwd())
    # print("__file__ =", __file__)

    if not os.path.exists("dist"):
        os.makedirs("dist")

    with open("dist/converted.js", "w") as f:
        f.write(js)

    with open("dist/converted.css", "w") as f:
        f.write(css)
