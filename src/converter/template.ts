// css
import '../game-engine/base.css';
import './converted.css';

// classes
import { Story, StoryDatas } from '../game-engine/ts/classes/Story';
import { Image, Images } from '../game-engine/ts/classes/Image';
import { Font, Fonts } from '../game-engine/ts/classes/Font';
import { Sound, Sounds } from '../game-engine/ts/classes/Sound';
import { Char, Chars } from '../game-engine/ts/classes/Char';
import { Nodes, Menu, MenuItem, Say, If, IfBlock, PyExpr, Scene, Show, Hide, Play, Stop } from '../game-engine/ts/classes/nodes';


// const
const GAME_NAME: string = ${game_name};

const GAME_VERSION: string = ${game_version};

const LANG: string = ${game_lang};

const SHOW_NAME: boolean = ${show_name};

const MAIN_MENU_MUSIC: string = ${main_menu_music};

let HELP: string;
try {
    HELP = require("../game-engine/help/"+LANG+".md");
} catch (error) {
    HELP = require("../game-engine/help/en.md");
}


// images
import GAME_ICON from ${path_game_icon};
import MAIN_MENU_BG from ${path_main_menu_bg};
import MAIN_MENU_OVERLAY from ${path_main_menu_overlay};
import GAME_MENU_BG from ${path_game_menu_bg};
import GAME_MENU_OVERLAY from ${path_game_menu_overlay};
import TEXTBOX_BG from ${path_textbox};
import CHOICE_BTN_BG from ${path_choice_btn_bg};
import CHOICE_BTN_HOVER from ${path_choice_btn_hover};
import SLOT_BG from ${path_slot_bg};
import SLOT_HOVER from ${path_slot_hover};
import NAMEBOX_BG from ${path_namebox_bg};
import CONFIRM_OVERLAY from ${path_confirm_overlay};
import FRAME_BG from ${path_frame_bg};

${imgs_imports}

const IMAGES: Images = ${imgs_dic};


// fonts
${fonts_imports}

const FONTS: Fonts = ${fonts_dic};


// sounds
${snds_imports}

const SOUNDS: Sounds = ${snds_dic};


// chars
const CHARS: Chars = ${chars};


// story
const STORY: Story = Story.getInstance();


// reference ressources in story object
const datas: StoryDatas = {
    name: GAME_NAME,
    version: GAME_VERSION,
    lang: LANG,
    help: HELP,
    showName: SHOW_NAME,
    icon: GAME_ICON,
    main_menu_bg: MAIN_MENU_BG,
    main_menu_music: MAIN_MENU_MUSIC,
    main_menu_overlay: MAIN_MENU_OVERLAY,
    game_menu_bg: GAME_MENU_BG,
    game_menu_overlay: GAME_MENU_OVERLAY,
    choice_btn_bg: CHOICE_BTN_BG,
    choice_btn_hover: CHOICE_BTN_HOVER,
    slot_bg: SLOT_BG,
    slot_hover: SLOT_HOVER,
    textbox_bg: TEXTBOX_BG,
    namebox_bg: NAMEBOX_BG,
    confirm_overlay: CONFIRM_OVERLAY,
    frame_bg: FRAME_BG,
    images: IMAGES,
    fonts: FONTS,
    sounds: SOUNDS,
    chars: CHARS
};

STORY.setDatas(datas);


// nodes
const NODES: Nodes = ${nodes};


// start story
STORY.setNodes(NODES);
