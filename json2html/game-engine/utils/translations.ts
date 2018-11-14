import IObj from '../classes/IObj';


export interface ILanguage {
    menu: {
        // main menu buttons
        start: string;
        resume: string;
        save: string;
        load: string;
        prefs: string;
        memory: string;
        mmenu: string;
        help: string;
        quit: string;
    };
    confirm: {
        // diverse confirm translations
        audio: string;    // the message for the pop up about playing sound
        audioBtn: string; // the button associated
        quit: string;     // quit game confirm
        unsaved: string;  // any action which will lose unsaved progress
        override: string; // overriding an existing save confirm
        yes: string;
        no: string;
    };
    memory: {
        about: string;
        delete: string;
        deleteAll: string;
        total: string;
    };
    emptySlot: string;
    bytes: string;
    noGamesYet: string;
}


const translations: IObj<ILanguage> = {
    en: {
        menu: {
            start: 'Start',
            resume: 'Resume',
            save: 'Save',
            load: 'Load',
            prefs: 'Preferences',
            memory: 'Memory',
            mmenu: 'Main Menu',
            help: 'Help',
            quit: 'Quit',
        },
        confirm: {
            audio: 'Be aware that this page is playing audio.',
            audioBtn: 'STFU and take me to the game',
            quit: 'Are you sure you want to quit?',
            unsaved: 'Are you sure?<br>Unsaved progress will be lost.',
            override: 'Are you sure you want to override the existing save?',
            yes: 'Yes',
            no: 'No',
        },
        memory: {
            about: 'Jean Plank games are saved on local browser storage.<br>They are only avaible on this computer.',
            delete: 'delete',
            deleteAll: 'deleteAll',
            total: 'total',
        },
        emptySlot: 'empty slot',
        bytes: 'Bytes',
        noGamesYet: 'No games saved yet.',
    },
    fr: {
        menu: {
            start: 'Commencer',
            resume: 'Continuer',
            save: 'Sauvegarder',
            load: 'Charger une partie',
            prefs: 'Préférences',
            memory: 'Mémoire',
            mmenu: 'Menu Principal',
            help: 'Aide',
            quit: 'Quitter',
        },
        confirm: {
            audio: 'Attention ! Cette page joue du son...',
            audioBtn: 'OSEF ! Je veux jouer au jeu.',
            quit: 'Êtes-vous sûr de vouloir quitter ?',
            unsaved: 'Êtes vous sûr ?<br>Toute progression non sauvegardée sera perdue.',
            override: 'Êtes vous sûr de vouloir écraser la sauvegarde existante ?',
            yes: 'Oui',
            no: 'Non',
        },
        memory: {
            about: 'Les sauvegardes des jeux Jean Plank se trouvent dans les fichiers locaux du navigateur. Elles ne sont disponibles que sur cet ordinateur.',
            delete: 'supprimer',
            deleteAll: 'tout supprimer',
            total: 'total',
        },
        emptySlot: 'emplacement vide',
        bytes: 'Octets',
        noGamesYet: 'Aucune jeu sauvegardé',
    },
};

export default translations;
