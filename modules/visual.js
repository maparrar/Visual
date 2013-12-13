// ==UserScript==
// @name        vizwiki
// @namespace   vizwiki
// @description pruebas
// @include     http://es.wikipedia.org/wiki/Universidad_nacional_de_colombia
// @version     1
// @grant       none
// ==/UserScript==

var minHeight=minWidth=100;
var gap=100;
var maxHeight=$(window).height()-gap;
var maxWidth=$(window).width()-gap;
var state=1;

var styles='.vw_window{background:#A64B00;bottom:0;color:#fff;font-size:.8em;height:100px;line-height:15px;overflow:auto;position:fixed;right:0;width:100px;z-index:255}.vw_med{width: 20%;}.vw_window #vw_title{background:#A64B00;height:15px}.vw_window #vw_title #vw_name{float:left;text-indent:3px}.vw_window #vw_title #vw_resize{cursor:pointer;float:right;text-align:center;width:15px}.vw_window #vw_content{background:#FFB273;bottom:3px;left:3px;overflow:auto;position:absolute;right:3px;top:15px}';

//Inserta los estilos
$('head').append('<style>'+styles+'</style>');

//Inserta la ventana de visualizaciÃ³n
$("body").prepend(
    '<div class="vw_window">'+
        '<div id="vw_title">'+
            '<div id="vw_name">Contexto</div>'+
            '<div id="vw_resize">+</div>'+
        '</div>'+
        '<div id="vw_content">'+
        '</div>'+
    '</div>'
);
var vizwiki=$(".vw_window");
var vwContent=$("#vw_content");
var resize=vizwiki.find("#vw_resize");
var wikiBody=$(".mw-body");
resize.click(function(){
    if(vizwiki.hasClass("vw_med")){
        wikiBody.width(wikiBody.width()+vizwiki.width());
        vizwiki.removeClass("vw_med");
        vizwiki.height(minHeight);
    }else{
        vizwiki.addClass("vw_med");
        wikiBody.width(wikiBody.width()-vizwiki.width());
        vizwiki.height($(window).height());
    }
});

//Captura pobremente los enlaces de los aÃ±os
var links=$("#bodyContent").find("a");
var index=0;
links.each(function(){
    var title=parseInt($(this).attr("title"));
    if(title>0 && title<3000){
        $(this).attr("data-index",index);
        $(this).addClass("vw_link");
        vwContent.append($(this).clone());
        index++;
    }
});

vizwiki.find(".vw_link").click(function(e){
    e.preventDefault();
}).css("display","block");

//Captura los enlaces del visualizador
var vizlinks=vizwiki.find("a");

//Crea los wraps para los links
vizlinks.each(function(){
    $(this).wrap('<div class="vw_field" data-index="'+$(this).attr("data-index")+'" title="'+$(this).attr("title")+'"></div>');
    $(this).after('<div  class="vw_items"></div>');
});

//Captura los campos del visualizador
var vizfields=vizwiki.find(".vw_field");

//Oculta los enlaces
vizfields.hide();

//Detecta el scroll
$(document).scroll(function(){
    var visibles=new Array();
    vizfields.each(function(){
        var link=$("#bodyContent a[data-index='"+$(this).attr("data-index")+"']");
        if(isOnScreen(link)){
            $(this).show();
            visibles.push($(this).attr("title"));
        }else{
            $(this).hide();
        }
    });
    if(visibles.length){
        processLinks(visibles);
    }
});

//Hace scroll un pixel para que cargue las iniciales
$(document).scrollTop(1);

//FUNCIONES
function processLinks(links){
    var maxToShow=3;    //MÃ¡ximo a mostrar de la lista de acontecimientos
    $.getJSON(
        "http://es.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles="+links.join("|")+"&callback=?",
        function(data){
            for(var i in data.query.pages){
                var page=data.query.pages[i];
                var title=page.title;
                var content=page.revisions[0]["*"];
                var lines=content.split("\n");

                //console.log(title);
                var element=vizwiki.find(".vw_field[title="+title+"]");
                element.find(".vw_items").empty();
                
                for(var j in lines){
                    var selected=j%(parseInt(lines.length/(maxToShow+1)));
                    if(lines[j].indexOf("*")>=0&&lines[j].indexOf("[[")>=0&&!selected){
                        element.find(".vw_items").append("<div>"+lines[j]+"</div>");
                    }
                }
            }
        }
    );
}

function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
        );
}
function isOnScreen(el){
     
    var win = $(window);
     
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
     
    var bounds = el.offset();
    bounds.right = bounds.left + el.outerWidth();
    bounds.bottom = bounds.top + el.outerHeight();
     
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
     
};