function changeNav(element) {
    const selected = document.getElementsByClassName('selectedNavBar');
    if(element.className !== 'selectedNavBar') {
        for(var i = 0; i < selected.length; i++)
            selected[i].className = '';
        element.className = 'selectedNavBar';
    }
    const body = document.querySelectorAll(".Home,.Skills,.Experience");
    for(var i = 0; i < body.length; i++) {
        if(body[i].classList.contains(element.innerHTML) && body[i].classList.contains('invisible')) {
            body[i].classList.remove('invisible');
        } else if(!body[i].classList.contains(element.innerHTML) && !body[i].classList.contains('invisible')) {
            body[i].classList.add('invisible');
        }
    }
}