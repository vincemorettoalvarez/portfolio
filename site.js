function revealCase(){const id=decodeURIComponent(location.hash.slice(1));const target=document.getElementById(id);if(target&&target.tagName==='DETAILS')target.open=true;}
document.querySelectorAll('.case-link').forEach(link=>link.addEventListener('click',()=>{const target=document.querySelector(link.getAttribute('href'));if(target)target.open=true;}));
window.addEventListener('hashchange',revealCase);
document.getElementById('learning-details').open=false;
