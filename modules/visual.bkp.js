// ==UserScript==
// @name        vizwiki
// @namespace   vizwiki
// @description pruebas
// @include     http://es.wikipedia.org/wiki/Universidad_nacional_de_colombia
// @version     0.2
// @grant       none
// ==/UserScript==

var gap=100;


$(document).ready(function(){
    var minHeight=minWidth=100;
    var gap=100;
    var maxHeight=$(window).height()-gap;
    var maxWidth=$(window).width()-gap;
    var state=1;
    
    prepareHtml();
    events();
    
});






//Inserta la ventana de visualización
function prepareHtml(){
    $("body").prepend(
        '<div class="vw_window">'+
            '<div id="vw_title">'+
                '<div id="vw_name">Contexto</div>'+
                '<div id="vw_resize">+</div>'+
            '</div>'+
            '<div id="vw_canvas"></div>'+
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
}

//Crea los eventos asociados a la ventana
function events(){
    vizwiki.find(".vw_link").click(function(e){
        e.preventDefault();
    }).css("display","block");
    
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
}
    


////Captura pobremente los enlaces de los años
//var links=$("#bodyContent").find("a");
//var index=0;
//links.each(function(){
//    var title=parseInt($(this).attr("title"));
//    if(title>0 && title<3000){
//        $(this).attr("data-index",index);
//        
//        $(this).addClass("vw_link");
//        vwContent.append($(this).clone());
//        $(this).css("background","#00ff00");
//        index++;
//    }
//});
//
//
//
////Captura los enlaces del visualizador
//var vizlinks=vizwiki.find("a");
//
////Crea los wraps para los links
//vizlinks.each(function(){
//    $(this).wrap('<div class="vw_field" data-index="'+$(this).attr("data-index")+'" title="'+$(this).attr("title")+'"></div>');
//    $(this).after('<div  class="vw_items"></div>');
//});
//
////Captura los campos del visualizador
//var vizfields=vizwiki.find(".vw_field");
//
////Oculta los enlaces
//vizfields.hide();
//


//FUNCIONES
function processLinks(links){
    var maxToShow=4;    //Máximo a mostrar de la lista de acontecimientos
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
















////PRUEBAS DE THREE JS
//$(document).ready(function(){
//                var camera, scene, renderer;
//                var geometry, material, mesh;
//
//                init();
//                animate();
//                
//                
//                
//                $("body").click(function(){
//                    var a = new THREE.Vector3( 10, 20, -3 );
//                    camera.lookAt(a);
//                });
//                
//                
//
//                function init() {
//
//                    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
//                    camera.position.z = 1000;
//
//                    scene = new THREE.Scene();
//
//                    geometry = new THREE.CubeGeometry( 200, 200, 200 );
//                    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
//
//                    mesh = new THREE.Mesh( geometry, material );
//                    scene.add( mesh );
//
//                    renderer = new THREE.CanvasRenderer();
//                    renderer.setSize( window.innerWidth, window.innerHeight );
//
////                    document.body.appendChild( renderer.domElement );
//                    
//                    $("#vw_3d").prepend( renderer.domElement );
//                    
//                    
//                    
//                    // create the sphere's material
//var sphereMaterial =
//  new THREE.MeshLambertMaterial(
//    {
//      color: 0xCC0000
//    });
//                    
//                    // set up the sphere vars
//var radius = 50,
//    segments = 16,
//    rings = 16;
//
//// create a new mesh with
//// sphere geometry - we will cover
//// the sphereMaterial next!
//var sphere = new THREE.Mesh(
//
//  new THREE.SphereGeometry(
//    radius,
//    segments,
//    rings),
//
//  sphereMaterial);
//
//// add the sphere to the scene
//scene.add(sphere);
//
//
//
//// create a point light
//var pointLight =
//  new THREE.PointLight(0xFFFFFF);
//
//// set its position
//pointLight.position.x = 10;
//pointLight.position.y = 50;
//pointLight.position.z = 130;
//
//// add to the scene
//scene.add(pointLight);
//
//// draw!
//renderer.render(scene, camera);
//
//
//
//
//
//
//
//
//
//
//
//                }
//
//                function animate() {
//
//                    // note: three.js includes requestAnimationFrame shim
//                    requestAnimationFrame( animate );
//
//                    mesh.rotation.x += 0.01;
//                    mesh.rotation.y += 0.02;
//
//                    renderer.render( scene, camera );
//
//                }
//            });
