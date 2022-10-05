import { mapListToDOMElements, createDOMElem } from "./dominteractions.js";
import { getShowsByTypeKey, getShowsByTypeId } from "./requests.js";

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
  };

  connectDOMElements = () => {
    const listOfIds = Array.from(document.querySelectorAll("[id]")).map(
      (elem) => elem.id
    );
    const listOfShowNames = Array.from(
      document.querySelectorAll("[data-show-name]")
    ).map((elem) => elem.dataset.showName);

    // console.log(document.querySelectorAll('[id]')); //nodelist
    // console.log(listOfIds);
    // console.log(listOfShowNames);

    this.viewElems = mapListToDOMElements(listOfIds, "id");
    this.showNameButtons = mapListToDOMElements(
      listOfShowNames,
      "data-show-name"
    );
    // console.log(this.viewElems);
    // console.log(this.showNameButtons);
    // console.log(Object.keys(this.showNameButtons));
  };

  setupListeners = () => {
    Object.keys(this.showNameButtons).forEach((showName) => {
      this.showNameButtons[showName].addEventListener(
        "click",
        this.setCurrentNameFilter
      );
    });
  };

  setCurrentNameFilter = () => {
    this.selectedName = event.target.dataset.showName;
    this.fetchAndDisplayShows();
  };

  fetchAndDisplayShows = () => {
    getShowsByTypeKey(this.selectedName).then((shows) =>
      this.renderCardsOnList(shows)
    );
  };

  renderCardsOnList = (shows) => {
    Array.from(document.querySelectorAll("[data-show-id]")).forEach((button) =>
      button.removeEventListener("click", this.openDetailsView)
    );
    this.viewElems.showsWrapper.innerHTML = "";

    for (const { show } of shows) {
      const card = this.createShowCard(show);
      this.viewElems.showsWrapper.appendChild(card);
    }
  };

  createShowCard = (show, isDetailed) => {
    console.log(show);
    const divCard = createDOMElem("div", "card");
    const divCardBody = createDOMElem("div", "card-body");
    const h5 = createDOMElem("h5", "card-title", show.name);
    const btn = createDOMElem(
      "button",
      "btn btn-primary btn-show-details",
      "Show details"
    );
    let img, h6Genres, h6Premiered, p;

    if (show.image) {
      if (isDetailed) {
        img = createDOMElem("img", "card-preview-bg");
        img.style.backgroundImage = `url('${show.image.original}')`;
      } else {
        img = createDOMElem("img", "card-img-top", null, show.image.medium);
      }
    } else {
      if (isDetailed) {
        img = createDOMElem("img", "card-preview-bg");
        img.style.backgroundImage = `url("../assets/images/Placeholder.png")`;
        btn.innerText = "Hide details";
      } else {
        img = createDOMElem(
          "img",
          "card-img-top",
          null,
          "../assets/images/Placeholder.png"
        );
      }
    }

    if (show.genres) {
      h6Genres = createDOMElem(
        "h6",
        "genres",
        show.genres.toString().replaceAll(",", ", ")
      );
    }

    if (show.premiered) {
      h6Premiered = createDOMElem(
        "h6",
        "premiered",
        `Premiered: ${show.premiered}`
      );
    }

    if (show.summary) {
      if (isDetailed) {
        p = createDOMElem(
          "p",
          "card-text",
          show.summary.replace(/(<([^>]+)>)/gi, "")
        );
      } else {
        p = createDOMElem(
          "p",
          "card-text",
          `${show.summary.replace(/(<([^>]+)>)/gi, "").slice(0, 100)}...`
        );
      }
    } else {
      p = createDOMElem(
        "p",
        "card-text",
        "There is no summary for that show yet"
      );
    }

    btn.dataset.showId = show.id;

    if (isDetailed) {
      btn.addEventListener("click", this.closeDetailsView);
      btn.innerText = "Hide details";
    } else {
      btn.addEventListener("click", this.openDetailsView);
    }

    divCard.appendChild(img);
    divCard.appendChild(divCardBody);
    divCardBody.appendChild(h5);
    if (isDetailed) {
      divCardBody.appendChild(h6Genres);
      divCardBody.appendChild(h6Premiered);
    }
    divCardBody.appendChild(p);
    divCardBody.appendChild(btn);

    return divCard;
  };

  openDetailsView = (event) => {
    const { showId } = event.target.dataset;
    getShowsByTypeId(showId).then((show) => {
      const card = this.createShowCard(show, true);
      this.viewElems.showPreview.appendChild(card);
      this.viewElems.showPreview.style.display = "block";
    });
  };

  closeDetailsView = (event) => {
    const { showId } = event.target.dataset;
    const closeBtn = document.querySelector(
      `[id="showPreview"] [data-show-id="${showId}"]`
    );
    closeBtn.removeEventListener("click", this.closeDetailsView);
    this.viewElems.showPreview.style.display = "none";
    this.viewElems.showPreview.innerHTML = "";
  };
}

document.addEventListener("DOMContentLoaded", new TvMaze());
