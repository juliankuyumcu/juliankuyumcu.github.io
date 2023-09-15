const sections = document.querySelectorAll('section');
let currentSectionIndex = 0;
let scrollThrottle = false;
let currentBook = 2;
let y = 0;

let vectorX = 0;
let vectorY = 0;
let prevState = null;

function scrollToSection(index) {
  sections[index].scrollIntoView({
    behavior: 'smooth',
    scrollTiming: 'ease'
  });
  currentSectionIndex = index;
  console.log(index);
}

function moveCarouselLeft() {
  if (currentBook == 1) return;
  currentBook--;
  const carouselContent = $('.carouselContent');

  if (currentBook == 1) {
    carouselContent.removeClass("carouselCentred");
    carouselContent.addClass("carouselLeft");
  }
  else if (currentBook == 2) {
    carouselContent.removeClass("carouselRight");
    carouselContent.addClass("carouselCentred");
  }

  changeActiveBook(currentBook, "left");
}

function moveCarouselRight() {
  if (currentBook == 3) return;
  currentBook++;
  const carouselContent = $('.carouselContent');

  if (currentBook == 2) {
    carouselContent.removeClass("carouselLeft");
    carouselContent.addClass("carouselCentred");
    
  }
  else if (currentBook == 3) {
    carouselContent.removeClass("carouselCentred");
    carouselContent.addClass("carouselRight");
  }

  changeActiveBook(currentBook, "right");
}

function changeActiveBook(bookNum, direction) {
  const books = document.getElementsByClassName("book");
  books[bookNum - 1].classList.remove("notActive");
  books[bookNum - 1].classList.add("active");

  if (direction === 'left') {
    books[bookNum].classList.remove("active");
    books[bookNum].classList.add("notActive");

    books[bookNum].classList.remove("open");
    books[bookNum].classList.add("notOpen");
  } else if (direction === 'right') {
    books[bookNum - 2].classList.remove("active");
    books[bookNum - 2].classList.add("notActive");

    books[bookNum - 2].classList.remove("open");
    books[bookNum - 2].classList.add("notOpen");
  }
}

function openBook(book) {
  let p = document.getElementById(book).classList.add("open");
  console.log(p);
}

function clickedBook(book) {
  if (book.classList.contains("notActive")) {
    const books = document.getElementsByClassName("book");
    let bookIndex = -1;
    console.log(books);
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === book.id) {
        bookIndex = i + 1;
        break;
      }
    }

    if (bookIndex < currentBook) {
      moveCarouselLeft();
    } else if (bookIndex > currentBook) {
      moveCarouselRight();
    }
    
    return;
  }

  if (book.classList.contains("open")) {
    book.classList.remove("open");
    book.classList.add("notOpen");
  } else {
    book.classList.remove("notOpen");
    book.classList.add("open");
  }
}

function toggleHead(head) {
  if (head.classList.contains("open")) {
    head.classList.remove('open');
    head.classList.remove('wasClosed');
    head.classList.add('notOpen');
    head.classList.add('wasOpen');
  } else if (head.classList.contains("notOpen")) {
    head.classList.remove('notOpen');
    head.classList.remove('wasOpen');
    head.classList.add('open');
    head.classList.add('wasClosed');

    if (!head.classList.contains("wasOpen")) {
      const doves = document.getElementsByClassName('dove');
      Array.from(doves).forEach(dove => {
        dove.classList.add('flying');
      });
      const divider = document.getElementById('titleDivider');
      divider.classList.add('grow');
      const mainTitle = document.getElementById('mainTitle');
      mainTitle.classList.add('fadeIn');
      const subtitle = document.getElementById('subtitle');
      subtitle.classList.add('fadeIn');
      const sun = document.getElementById('sun');
      sun.classList.add('rising');
    }
  }
}

function previewHead() {
  for (let i = 0; i > -100; i--) {
    document.documentElement.style.setProperty('--headPreview', (i/100) + "deg");
  }
}

function unpreviewHead() {
  for (let i = -100; i < 0; i++) {
    document.documentElement.style.setProperty('--headPreview', (i/100) + "deg");
  }
}

function moveQuoteHead(e) {
  const quoteHead = document.getElementById('quoteHead');
  const headX = quoteHead.offsetLeft;
  const headY = quoteHead.offsetTop;
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const transformX = (headX - mouseX) * 0.01;
  const transformY = (headY - mouseY) * 0.005;

  document.documentElement.style.setProperty('--quoteHeadPosX', transformX.toString() + 'px');
  document.documentElement.style.setProperty('--quoteHeadPosY', transformY.toString() + 'px');
}

function openQuote(e) {
  let quote = e.target;

  if (quote.id === 'mouth') {
    quote.classList.add('talking');
    setTimeout(() => {
      quote.classList.remove('talking');
    }, 2000);
    return;
  }

  if (quote.classList.contains("hidden")) {
    quote.classList.remove("readyHidden");
    quote.classList.add("shown");
    quote.classList.remove("hidden");

    setTimeout(() => {
      quote.classList.add("readyShown")
    }, 1000);

    const mouth = document.getElementById('mouth');
    if (!mouth.classList.contains('talking'))
    {
      mouth.classList.add('talking');
      setTimeout(() => {
        mouth.classList.remove('talking');
      }, 2000);
    }
    else
    {
      mouth.classList.remove('talking');
      mouth.classList.add('talking');
    }
  } else if (quote.classList.contains("shown")) {
    quote.classList.remove("readyShown");
    quote.classList.remove("shown");
    quote.classList.add("hidden");
    setTimeout(() => {
      quote.classList.add("readyHidden")
    }, 1000);
  }
}

function overBritain() {
  console.log("over britain");
}

function scrollHandler(e) {
  const delta = Math.sign(e.deltaY);

  if (delta > 0 && y > -2000) {
    const moveDownClass = y === 0 ? 'moveDownFromTop' : 'moveDown';
    y -= 500;

    const main = document.getElementById('mainContent');

    main.classList.add(moveDownClass);

    setTimeout(() => {
      main.classList.remove(moveDownClass);
      document.documentElement.style.setProperty('--mainContentPos', y.toString() + 'vh');
    }, (moveDownClass === 'moveDownFromTop' ? 4000 : 1500));

    if (moveDownClass === 'moveDownFromTop') {
      setTimeout(() => {
        document.documentElement.style.setProperty('--blinkOpacity', '1');

        setTimeout(() => {
          document.documentElement.style.setProperty('--blinkOpacity', '0');
        }, 500);

      }, 1800);
    }
  } else if (delta < 0 && y < 0) {
    y += 500;

    
    const main = document.getElementById('mainContent');

    main.classList.add('moveUp');

    setTimeout(() => {
      main.classList.remove('moveUp');
      document.documentElement.style.setProperty('--mainContentPos', y.toString() + 'vh');
    }, 1500);
  }
}

function enterState(state) {
  state.classList.add("hovered");
}

function leaveState(state) {
  state.classList.remove("hovered");
}

function zoomOnState(state) {
  let map = document.getElementById('map2');
  const statePath = state.target;
  let scalar = 3;

  if (statePath.classList.contains("enlarged")) {
    statePath.classList.remove("enlarged");
    prevState = null;
    zoomOutState();
    return;
  }

  const empireMap = document.getElementById('empireMap');
  console.log(empireMap.clientWidth + "," + empireMap.clientHeight);
  empireMap.classList.add('enlarged');
  const banner = document.getElementById('banner');
  if (banner.classList.contains('invisible')) {
    banner.classList.remove('invisible');
    banner.classList.add('visible')
  }
  const bannerText = document.getElementById('bannerText');
  bannerText.innerHTML = statePath.id;

  statePath.classList.add("enlarged");

  if (prevState) {
    prevState.classList.remove("enlarged");
  } else {
    scalar = 1;
  }

  const stateBBox = statePath.getBoundingClientRect();
  const stateCenter = {
    x: (stateBBox.x + stateBBox.width / 2),
    y: (stateBBox.y + stateBBox.height / 2)
  };

  const mapContainer = document.getElementById('empireMap');
  const mapContainerBBox = mapContainer.getBoundingClientRect();
  const mapContainerCenter = {
    x: (mapContainerBBox.x + mapContainerBBox.width / 2), 
    y: (mapContainerBBox.y + mapContainerBBox.height / 2)
  };

  const vector = {
    x: mapContainerCenter.x - stateCenter.x,
    y: mapContainerCenter.y - stateCenter.y
  };
  vectorX += vector.x / scalar;
  vectorY += vector.y / scalar;

  document.documentElement.style.setProperty('--wavesSize', '512px');
  map.style.transform = `scale(3) translateX(${vectorX}px) translateY(${vectorY}px)`;
  map.style.transition = "transform 1.0s";
  prevState = statePath;
}

function zoomOutState() {
  document.documentElement.style.setProperty('--wavesSize', '171px');
  const banner = document.getElementById('banner');
  if (banner.classList.contains('visible')) {
    banner.classList.remove('visible');
    banner.classList.add('invisible')
  }
  const map = document.getElementById('map2');
  map.style.transform = `scale(1) translateX(0px) translateY(0px)`;
  map.style.transition = "transform 1.0s";
  vectorX = 0;
  vectorY = 0;

  const empireMap = document.getElementById('empireMap');
  empireMap.classList.remove('enlarged');
}

document.addEventListener('DOMContentLoaded', function() {
  $(window).on("load", () => {
    document.getElementById('loadingScreen').classList.add('loaded');
  });

  document.body.onmousedown = function(e) { if (e.button === 1) return false; }

  document.addEventListener('wheel', (e) => {
    e.preventDefault();

    const delta = Math.sign(e.deltaY);

    if (delta > 0 && y <= -2000) {
      return;
    }
    if (delta < 0 && y >= 0) {
      return;
    }

    if (!scrollThrottle) {
        setTimeout(() => {scrollThrottle = false;}, (y === 0 ? 4000 : 1500));
        scrollThrottle = true;
        scrollHandler(e);
    }
  }, {passive: false});

  const states = document.getElementsByTagName('path');
  for (const state of states) {
    state.addEventListener('click', zoomOnState);
  }
});