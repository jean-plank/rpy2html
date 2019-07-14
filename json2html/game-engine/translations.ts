import { StrMap } from 'fp-ts/lib/StrMap'

export interface Translation {
    menu: {
        pause: string;
        prefs: string;
        // main menu buttons
        start: string;
        load: string;
        memory: string;
        help: string;
        quit: string;
        // game menu buttons
        resume: string;
        history: string;
        save: string;
        mainMenu: string;
        // armless wanker menu
        back: string;
        skip: string;
        qSave: string;
        qLoad: string;
        saved: string;
    }
    confirm: {
        // diverse confirm translations
        audio: string; // the message for the pop up about playing sound
        audioBtn: string; // the button associated
        quit: string; // quit game confirm
        unsaved: string; // any action which will lose unsaved progress
        override: string; // overriding an existing save confirm
        delete: string; // deleting a game's saves
        deleteAll: string; // deleting all game's saves
        yes: string;
        no: string;
    }
    prefs: {
        display: string;
        window: string;
        fullscreen: string;
    }
    memory: {
        about: string;
        bytes: string;
        delete: string;
        deleteAll: string;
        total: string;
        noGamesYet: string;
    }
    emptySlot: string
}

const translations: StrMap<Translation> = new StrMap({
    en: {
        menu: {
            pause: 'Pause',
            prefs: 'Preferences',
            start: 'Start',
            load: 'Load',
            memory: 'Memory',
            help: 'Help',
            quit: 'Quit',
            resume: 'Resume',
            history: 'History',
            save: 'Save',
            mainMenu: 'Main Menu',
            back: 'Back',
            skip: 'Skip',
            qSave: 'Quick save',
            qLoad: 'Quick load',
            saved: 'Saved!'
        },
        confirm: {
            audio: 'Be aware that this page is playing audio.',
            audioBtn: 'STFU and take me to the game',
            quit: 'Are you sure you want to quit?',
            unsaved: 'Are you sure?<br>Unsaved progress will be lost.',
            override: 'Are you sure you want to override the existing save?',
            delete: "Are you sure you want to delete this game's saves ?",
            deleteAll: "Are you sure you want to delete all games' saves ?",
            yes: 'Yes',
            no: 'No'
        },
        prefs: {
            display: 'Display',
            window: 'Window',
            fullscreen: 'Fullscreen'
        },
        memory: {
            about:
                'Saves are stored on local b&rowser storage. They are only avaible on this computer.',
            bytes: 'Bytes',
            delete: 'delete',
            deleteAll: 'delete all',
            total: 'total',
            noGamesYet: 'No games saved yet.'
        },
        emptySlot: 'empty slot'
    },
    fr: {
        menu: {
            pause: 'Pause',
            prefs: 'Préférences',
            start: 'Commencer',
            load: 'Charger une partie',
            memory: 'Mémoire',
            help: 'Aide',
            quit: 'Quitter',
            resume: 'Continuer',
            history: 'Historique',
            save: 'Sauvegarder',
            mainMenu: 'Menu Principal',
            back: 'Retour',
            skip: 'Passer',
            qSave: 'Sauvegarde rapide',
            qLoad: 'Chargement rapide',
            saved: 'Sauvegardé !'
        },
        confirm: {
            audio: 'Attention ! Cette page joue du son...',
            audioBtn: 'OSEF ! Je veux jouer au jeu.',
            quit: 'Êtes-vous sûr de vouloir quitter ?',
            unsaved:
                'Êtes vous sûr ?<br>Toute progression non sauvegardée sera perdue.',
            override:
                'Êtes vous sûr de vouloir écraser la sauvegarde existante ?',
            delete:
                'Êtes vous sûr de vouloir supprimer les sauvegardes pour ce jeu ?',
            deleteAll:
                'Êtes vous sûr de vouloir supprimer les sauvegardes de tous les jeux ?',
            yes: 'Oui',
            no: 'Non'
        },
        prefs: {
            display: 'Affichage',
            window: 'Fenêtré',
            fullscreen: 'Plein écran'
        },
        memory: {
            about:
                'Les sauvegardes sont stockées dans les fichiers locaux du navigateur. Elles ne sont disponibles que sur cet ordinateur.',
            bytes: 'Octets',
            delete: 'supprimer',
            deleteAll: 'tout supprimer',
            total: 'total',
            noGamesYet: 'Aucune jeu sauvegardé'
        },
        emptySlot: 'emplacement vide'
    }
})
export default translations
