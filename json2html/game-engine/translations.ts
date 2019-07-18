import { StrMap } from 'fp-ts/lib/StrMap'

export interface Translation {
    menu: {
        start: string;
        resume: string;
        history: string;
        save: string;
        load: string;
        prefs: string;
        mainMenu: string;
        memory: string;
        help: string;
        return: string;
    }
    armless: {
        back: string;
        skip: string;
        qSave: string;
        qLoad: string;
        saved: string;
    }
    confirm: {
        // miscellaneous confirm translations
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
        volume: string;
        music: string;
        sound: string;
        voice: string;
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
            start: 'Start',
            resume: 'Resume',
            history: 'History',
            save: 'Save',
            load: 'Load',
            prefs: 'Preferences',
            mainMenu: 'Main Menu',
            memory: 'Memory',
            help: 'Help',
            return: 'Return'
        },
        armless: {
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
            fullscreen: 'Fullscreen',
            volume: 'Volume',
            music: 'Music',
            sound: 'Sound',
            voice: 'Voice'
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
            start: 'Commencer',
            resume: 'Continuer',
            history: 'Historique',
            save: 'Sauvegarder',
            load: 'Charger une partie',
            prefs: 'Préférences',
            mainMenu: 'Menu Principal',
            memory: 'Mémoire',
            help: 'Aide',
            return: 'Retour'
        },
        armless: {
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
            fullscreen: 'Plein écran',
            volume: 'Volume',
            music: 'Musique',
            sound: 'Sons',
            voice: 'Voix'
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
