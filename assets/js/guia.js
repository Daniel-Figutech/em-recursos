/* Efecto Mariposa · recursos web — JS compartido (vanilla, ligero) */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* pincelada del subrayador + reveal al entrar en pantalla */
  var marks = [].slice.call(document.querySelectorAll('.mark'));
  var revs  = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)){
    marks.forEach(function(m){ m.classList.add('in'); });
    revs.forEach(function(r){ r.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.55 });
    marks.forEach(function(m){ io.observe(m); });
    var io2 = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io2.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revs.forEach(function(r){ io2.observe(r); });
  }

  /* tracker y checklists: se acuerdan de ti (localStorage) */
  var pagina = location.pathname.replace(/\/+$/,'') || 'em';
  [].slice.call(document.querySelectorAll('input[type=checkbox][data-recuerda]')).forEach(function(ch){
    var clave = 'em:' + pagina + ':' + ch.getAttribute('data-recuerda');
    try{ if(localStorage.getItem(clave) === '1') ch.checked = true; }catch(e){}
    ch.addEventListener('change', function(){
      try{ localStorage.setItem(clave, ch.checked ? '1' : '0'); }catch(e){}
    });
  });

  /* test del metabolismo: suma y zona */
  var btnResultado = document.getElementById('ver-resultado');
  if (btnResultado){
    btnResultado.addEventListener('click', function(){
      var total = 0, contestadas = 0;
      [].slice.call(document.querySelectorAll('.preg')).forEach(function(p){
        var sel = p.querySelector('input:checked');
        if (sel){ total += parseInt(sel.value, 10); contestadas++; }
      });
      var faltan = document.querySelectorAll('.preg').length - contestadas;
      var aviso = document.getElementById('aviso-test');
      if (faltan > 0){
        if (aviso){ aviso.textContent = 'te faltan ' + faltan + ' preguntitas por marcar ✏️'; }
        return;
      }
      if (aviso){ aviso.textContent = ''; }
      var res = document.getElementById('resultado');
      res.classList.add('visible');
      document.getElementById('puntos').textContent = total;
      var zona = total <= 8 ? 'despierto' : (total <= 16 ? 'ralentizado' : 'adaptado');
      [].slice.call(document.querySelectorAll('.zona')).forEach(function(z){
        z.classList.toggle('activa', z.getAttribute('data-zona') === zona);
      });
      res.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }
})();
