function enableDarkMode() {
    document.body.classList.add('dark-mode');
}


function disableDarkMode() {
    document.body.classList.remove('dark-mode');
}

function toggleDarkMode() {
    var body = document.body;
    var sidebar = document.getElementById('sidebar');
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        sidebar.style.backgroundColor = 'white';
    } else {
        body.classList.add('dark-mode');
        sidebar.style.backgroundColor = '#ddd';
    }
}
