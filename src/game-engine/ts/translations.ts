export type Language = {
    mainMenu: {
        // main menu buttons
        start: string;
        load: string;
        prefs: string;
        help: string;
        quit: string;
    };
    confirm: {
        // diverse confirm translations
        audio: string;    // the message for the pop up about playing sound
        audioBtn: string; // the button associated
        quit: string;     // quit confirm
        yes: string;
        no: string;
    };
};


export const translations: { [key: string]: Language } = {
    en: {
        mainMenu: {
            start: "Start",
            load: "Load",
            prefs: "Preferences",
            help: "Help",
            quit: "Quit",
        },
        confirm: {
            audio: "Be aware that this page is playing audio.",
            audioBtn: "STFU and take me to the game",
            quit: "Are you sure you want to quit?",
            yes: "Yes",
            no: "No",
        }
    },
    fr: {
        mainMenu: {
            start: "Commencer",
            load: "Charger une partie",
            prefs: "Préférences",
            help: "Aide",
            quit: "Quitter",
        },
        confirm: {
            audio: "Attention ! Cette page joue du son...",
            audioBtn: "OSEF ! Je veux jouer au jeu.",
            quit: "Êtes-vous sûr de vouloir quitter ?",
            yes: "Oui",
            no: "Non",
        }
    },
};
