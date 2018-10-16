export type Language = {
    menu: {
        // main menu buttons
        start: string;
        save: string;
        load: string;
        prefs: string;
        mmenu: string;
        help: string;
        quit: string;
    };
    confirm: {
        // diverse confirm translations
        audio: string;    // the message for the pop up about playing sound
        audioBtn: string; // the button associated
        quit: string;     // quit game confirm
        mmenu: string;    // back to main menu confirm
        yes: string;
        no: string;
    };
};


export const translations: { [key: string]: Language } = {
    en: {
        menu: {
            start: "Start",
            save: "Save",
            load: "Load",
            prefs: "Preferences",
            mmenu: "Main Menu",
            help: "Help",
            quit: "Quit",
        },
        confirm: {
            audio: "Be aware that this page is playing audio.",
            audioBtn: "STFU and take me to the game",
            quit: "Are you sure you want to quit?",
            mmenu: "Are you sure you want to return to the main menu?<br>This will lose unsaved progress.",
            yes: "Yes",
            no: "No",
        }
    },
    fr: {
        menu: {
            start: "Commencer",
            save: "Sauvegarder",
            load: "Charger une partie",
            prefs: "Préférences",
            mmenu: "Menu Principal",
            help: "Aide",
            quit: "Quitter",
        },
        confirm: {
            audio: "Attention ! Cette page joue du son...",
            audioBtn: "OSEF ! Je veux jouer au jeu.",
            quit: "Êtes-vous sûr de vouloir quitter ?",
            mmenu: "Êtes vous sûr de vouloir retourner au menu principal ?<br>Toute progression non sauvegardée sera perdue.",
            yes: "Oui",
            no: "Non",
        }
    },
};
