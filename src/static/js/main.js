
// NE MOBILITE 2030 - JS //

var largeScreen = 950,
    isLargeScreen = jQuery(window).width() > largeScreen;

jQuery(document).ready(function() {
    jQuery('.collapser').click(function(){
    	jQuery(this).toggleClass('open');
    });


    /* ------ Second-nav / Menu mobile ------  */

    if (isLargeScreen) {
        jQuery('#nav-collapser').click(function(evt){
            evt.preventDefault();
            jQuery('#second-nav').toggleClass('open');
        });

    } else {

        var jPM = jQuery.jPanelMenu({
            menu: '#menus',
            trigger: '#nav-collapser',
            direction: 'right',
            excludedPanelContent: 'nav'
        });
        jPM.on();
        jQuery('#jPanelMenu-menu').find('li.active a').click(function(evt){
            evt.preventDefault();
            jPM.close();

            // Cible à atteindre
            var target = $('#' + $(this).attr('href').split('#')[1]);
            if(target.length > 0){
                h = target.offset().top - 75;
                
                $('html, body').animate({scrollTop:h}, 600);                
                window.location.hash = $(this).attr('href');
            }
            $(this).blur();
        })
    }


    /* ------ Sous-menu ------ */

    var chapters = [],
        currentChapter = 0,
        screenHeight = jQuery(window).height();
        preventActivatingMenu = false,
        Submenu = $('#main-nav').find('li.active ul'),
        SubmenuLi = Submenu.find('li'),
        SubmenuA = Submenu.find('a'); // Empêche que le scrolling active un menu

    if (isLargeScreen && Submenu.length > 0) {

        // Ajoute la position verticale de chaque chapitre dans le tableau
        $("body > section > article").each(function(){
            var h = $(this).offset().top
            chapters.push(h);
        })
        
        // Au clic sur un lien à ancre, anime le scroll jusqu'au chapitre correspondant
        SubmenuA.click(function(evt){
            evt.preventDefault();
            
            // Ajoute la classe sur le menu cliqué et empêche que le scrolling active un autre menu pendant la durée de l'animation
            var chapter = $(this).parent().index();
            switchActiveClass(SubmenuLi, chapter, 'active-submenu');
            preventActivatingMenu = true;
            
            // Cible à atteindre
            var target = $('#' + $(this).attr('href').split('#')[1]);
            if(target.length > 0){
                h = target.offset().top - $('nav').height();
                
                $('html, body').animate({scrollTop:h}, 600);
                setTimeout(function(){
                    preventActivatingMenu = false;
                }, 700);
                
                window.location.hash = $(this).attr('href');
            }
            $(this).blur();
        });
    
        jQuery(window).scroll(scrollerMenu);
        switchActiveClass(SubmenuLi, currentChapter, 'active-submenu');
        scrollerMenu();

    }

    function scrollerMenu(){
        if(!preventActivatingMenu) {
            // Si la position du scroll dépasse le chapitre actuel, donne la classe "active" au bon menu
            if(jQuery(window).scrollTop() > chapters[currentChapter]) {
                currentChapter++;
                switchActiveClass(SubmenuLi, currentChapter, 'active-submenu');
                
            } else if(jQuery(window).scrollTop() < chapters[currentChapter - 1]) {
                currentChapter--;
                switchActiveClass(SubmenuLi, currentChapter, 'active-submenu');
            }
        }
    };
    
    /* Init encode email function */
    initMail();

    
    /* ------ Homepage ------  */

    var $homeMap = jQuery('#home-map');

    if($homeMap.length > 0 && !jQuery('html').hasClass('lt-ie9')){

        var navH = (isLargeScreen) ? 130 : 115;
        jQuery('nav').height(navH);
        $homeMap.css({
            height: jQuery(window).height() - navH
        });
    
        $homeMap.find('.btn-decouvrir').click(function(evt){
            if(evt.target.id === 'supporting_committee_link') {
                return;
            } else {
                evt.preventDefault();
                evt.stopPropagation();
                $homeMap.toggleClass('overlay-visible');
            }
        });
    
        $homeMap.find('.overlay').click(function(evt){
            if(evt.target.id === 'video_link' || evt.target.id === 'doc_link' || evt.target.id === 'agenda_link' || evt.target.id === 'supporting_committee_link' || evt.target.id === 'facebook_link1' || evt.target.id === 'facebook_link2') {
                return;
            } else {

                evt.preventDefault();

                var posX = evt.offsetX / jQuery(this).width(),
                    posY = evt.offsetY / jQuery(this).height();

                // Si clic dans la moitié inférieure droite 
                if (posX + posY > 1) {
                    $homeMap.removeClass('overlay-visible');
                }
            }
        });

        $homeMap.click(function(evt){
            if(jQuery(evt.target).is('canvas')){
                jQuery('#layerTree').removeClass('open');
            }
        })
    
        // Map
        if(QueryString.feature) {
            $homeMap.removeClass('overlay-visible');
            mb.map.initMap(QueryString.feature);
        } else {
            mb.map.initMap('zoom_full_extent');
        }
        
        jQuery('#footer-collapser').click(function(){
            jQuery('footer').toggleClass('open');
        });
        
        jQuery('#layerTree-collapser').click(function(){
            jQuery('#layerTree').toggleClass('open');
        });
        
        jQuery('#featureInfo-collapser').click(function(){
            jQuery('#featureInfo').css('visibility', 'hidden');
        });
    }

    
    /* ------ Piliers ------  */

    if(jQuery('#piliers').length > 0 && window.location.hash){
        var target = jQuery(window.location.hash);
        
        target.addClass('open');
        h = target.offset().top - $('nav').height();    
        jQuery('html, body').animate({scrollTop:h}, 600);

    }
});


/* Gestion du scroll */
jQuery(window).scroll(function () {

    if (!isLargeScreen) {

        /* Gestion de l'affichage du du menu au scroll */
        if (jQuery(this).scrollTop() > 1) {
            jQuery('nav').not('.home').addClass("smaller");
        }
        else {
            jQuery('nav').removeClass("smaller");
        }
    }
});

/* ------------- Recharge la page si le format change ------------- */

var w = jQuery(window).width();

window.onresize = function () {
    var newWidth = jQuery(window).width()
    if ((w < largeScreen && newWidth > largeScreen) || (w > largeScreen && newWidth < largeScreen)) {
        refresh();
    };
};

function refresh() {
    if (window.RT)
        clearTimeout(window.RT);
    window.RT = setTimeout(function () {
        this.location.reload(false); /* false to get page from cache */
    }, 100);
}

/* ------------- switchActiveClass ------------- */

function switchActiveClass(group, active, className) {
    if(!className) className = 'active';

    group.removeClass(className);
    if(typeof(active) === 'number') {
        group.eq(active).addClass(className);
    } else {
        active.addClass(className);
    }
}

/* ------------- Home map QueryString ------------- */

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();


/* ------------- Init encode email function ------------- */
function initMail() {
    jQuery('span.mail').each(function (index, value) {
        var eml1 = jQuery(this).data('eml-pre');
        var eml2 = jQuery(this).data('eml-post');
        var msg = jQuery(this).data('msg');
        var style = jQuery(this).data('style');
        var attr = jQuery(this).data('attr');
        var parent = jQuery(this).parent();

        jQuery(this).remove();
        parent.append(generateMailLink(eml1, eml2, msg, style, attr));
    });
}

function generateMailLink(eml_1, eml_2, msg, style, attr) {
    style = typeof style !== 'undefined' ? style : '';
    attr = typeof attr !== 'undefined' ? attr : '';
    var eml = '';
    if (eml_1 != '' && eml_2 != '') {
        eml = eml_1 + "&#64;" + eml_2;
    }

    var noseml = eml.replace("&#64;", " (at) ");
    var nosmsg = msg.replace("&#64;", " (at) ");
    eml = eml.replace("&#64;", "@");
    msg = msg.replace("&#64;", "@");

    var styleinfo = 'class="' + style + '"';

    return "<a " + styleinfo + " href=\"mailto:" + eml + attr + "\">" + msg + "</a>";
}