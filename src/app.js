
import { mapListToDOMElements } from './dominteractions.js';
import { getShowsByTypeKey } from './requests.js';

class TvMaze {
    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = "harry";
        this.initializeApp();
    }

    initializeApp = () => {
        this.connectDOMElements();
        this.setupListeners();
        this.fetchAndDisplayShows();
    }

    connectDOMElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        const listOfShowNames = Array.from(document.querySelectorAll('[data-show-name]')).map(elem => elem.dataset.showName);

        console.log(document.querySelectorAll('[id]'));
        console.log(listOfIds);
        console.log(listOfShowNames);
        
        this.viewElems = mapListToDOMElements(listOfIds, 'id');
        this.showNameButtons = mapListToDOMElements(listOfShowNames, 'data-show-name');
        console.log(this.viewElems);
        console.log(this.showNameButtons);
        console.log(Object.keys(this.showNameButtons));
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter)
        });
    }

    setCurrentNameFilter = () => {
        this.selectedName = event.target.dataset.showName;
        this.fetchAndDisplayShows();
    }

    fetchAndDisplayShows = () => {
        getShowsByTypeKey(this.selectedName).then(shows => console.log(shows));
    }
}

document.addEventListener('DOMContentLoaded', new TvMaze());