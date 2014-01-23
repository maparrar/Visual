/*
 * Visual plugin for JQuery
 * Mediawiki Visualization Context Extension
 * https://github.com/maparrar/Visual
 * maparrar (http://maparrar.github.io/ - maparrar(at)gmail(dot)com )
 * Jan 2014
 **/

/*
* Se usa el plugin en el body del documento. Es posible pasar varios
* parámetros para configurar la ventana minimizada y maximizada.
* @param {int} minHeight: Alto en pixeles de la ventana cuando está minimizada
* @param {int} minWidth: Ancho en pixeles de la ventana cuando está minimizada
* @param {object} mw_body: Cuerpo de la página de mediawiki
*/
;(function($){
    //Variable que contiene las variables 3D: renderer, scene y camera
    var three={
        scene:false,
        camera:false,
        renderer:false
    };
    
    $.fn.visual=function(optUser,element){
        switch(optUser){
            default:
                return this.each(function() {
                    init($(this),optUser);
                });
        }
    };
    
    /*
     * Crea una instancia del objeto en el elemento pasado
     * @param {object} obj: Objeto en el que se inserta el plugin
     * @param {object} optUser: Objeto que contiene las opciones de usuario
     */
    function init(obj,optUser){
        //Variables por defecto
        var def = {
            server: "http://localhost/wiki/",
            minHeight: 100,
            minWidth: 100,
            mw_body: $(".mw-body")      //Cuerpo de la página de mediawiki
        };
        var opts = $.extend(def,optUser);
        
        //Se inserta el HTML y
        //se agregan las variables de opciones a la ventana del visualizador
        var visual=$.extend(insertHtml(obj),opts);
        
        //Se inicializa el renderizador 3D
        initRenderer(visual);
        
        //Asigna los eventos de los objetos
        events(visual);
        
        //Pruebas de three.js
//        test3d(visual);
        test3dSprites(visual);
        
        //Procesa los datos y/o links de la página de la Wiki
        processWikiPage(opts);
    };
    
    
    
    /*
     * Inicializa el renderizador 3D con una cámara y una escena por defecto
     * @param {object} visual: objeto con los elementos de la ventana del visualizador
     * @returns {undefined}
     */
    function initRenderer(visual){
//        if (!Detector.webgl)
//            Detector.addGetWebGLMessage();
        three.renderer=new THREE.WebGLRenderer();
        maximize(visual);
        three.camera = new THREE.PerspectiveCamera( 75, visual.canvas.width() / visual.canvas.height(), 1, 3000 );
        three.camera.position.z = 1000;
        three.scene = new THREE.Scene();
        three.scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );
        three.renderer = new THREE.WebGLRenderer();
        three.renderer.setSize(visual.canvas.width(),visual.canvas.height());
        visual.canvas.append(three.renderer.domElement);
    };
    
    /*
     * Crea e inserta el código HTML en el body del documento. Retorna un objeto
     * con los elementos del visualizador.
     * @param {object} obj: Objeto en el que se inserta el plugin
     * @returns {object}: Objeto con los elementos del visualizador
     */
    function insertHtml(obj){
        obj.prepend(
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
        var window=$(".vw_window");
        return {
            window:window,
            title:window.find("#vw_title"),
            resize:window.find("#vw_resize"),
            canvas:window.find("#vw_canvas"),
            content:window.find("#vw_content")
        };
    };
    
    /*
     * Minimiza la ventana del visualizador
     * @param {object} visual: objeto con los elementos de la ventana del visualizador
     */
    function minimize(visual){
        visual.mw_body.width("auto");
        visual.window.removeClass("vw_max");
        visual.window.height(visual.minHeight);
        visual.canvas.height(visual.minHeight-visual.title.height()-4);
        visual.canvas.width(visual.minHeight-6);
        visual.content.hide();
        three.renderer.setSize(visual.canvas.width(),visual.canvas.height());
    };
    /*
     * Maximiza la ventana del visualizador
     * @param {object} window: objeto con los elementos de la ventana del visualizador
     */
    function maximize(visual){
        visual.window.addClass("vw_max");
        visual.mw_body.width(visual.mw_body.width()-visual.window.width());
        visual.window.height($(window).height());
        visual.canvas.height(visual.window.width());
        visual.canvas.width(visual.window.width()-6);
        visual.canvas.css("margin-left",3);
        visual.content.show();
        visual.content.css("top",visual.window.width()+visual.title.height()+3);
        three.renderer.setSize(visual.canvas.width(),visual.canvas.height());
    };
    
    /*
     * Define los eventos de la ventana
     * @param {object} visual: Objeto con los elementos de la ventana de visualización
     */
    function events(visual){
        visual.resize.click(function(){
            if(visual.window.hasClass("vw_max")){
                minimize(visual);
            }else{
                maximize(visual);
            }
        });
    };
    
    
    
    function test3d(visual){
        var particles, geometry, materials = [];
        var parameters, i, h, color;
        var mouseX = 0, mouseY = 0;
        var windowHalfX = visual.canvas.width() / 2;
        var windowHalfY = visual.canvas.height() / 2;

        init();
        animate();

        function init() {
            geometry = new THREE.Geometry();
            for ( i = 0; i < 2000; i ++ ) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2000 - 1000;
                vertex.y = Math.random() * 2000 - 1000;
                vertex.z = Math.random() * 2000 - 1000;
                geometry.vertices.push( vertex );
            }
            parameters = [
                [ [1, 1, 0.5], 5 ],
                [ [0.95, 1, 0.5], 4 ],
                [ [0.90, 1, 0.5], 3 ],
                [ [0.85, 1, 0.5], 2 ],
                [ [0.80, 1, 0.5], 1 ]
            ];

            for ( i = 0; i < parameters.length; i ++ ) {
                color = parameters[i][0];
                size  = parameters[i][1];

                materials[i] = new THREE.ParticleSystemMaterial( { size: size } );

                particles = new THREE.ParticleSystem( geometry, materials[i] );
                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;

                three.scene.add(particles);
            }

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            document.addEventListener( 'touchstart', onDocumentTouchStart, false );
            document.addEventListener( 'touchmove', onDocumentTouchMove, false );
            window.addEventListener( 'resize', onWindowResize, false );
        };

        function onWindowResize() {
            three.camera.aspect =visual.canvas.width()/visual.canvas.height();
            three.camera.updateProjectionMatrix();
            three.renderer.setSize(visual.canvas.width(),visual.canvas.height());
        };
        function onDocumentMouseMove(event) {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        };
        function onDocumentTouchStart( event ) {
            if ( event.touches.length === 1 ) {
                event.preventDefault();
                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;
            }
        };
        function onDocumentTouchMove(event){
            if(event.touches.length === 1) {
                event.preventDefault();
                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;
            }
        };
        function animate(){
            requestAnimationFrame(animate);
            render();
        };
        function render(){
            var time = Date.now() * 0.00005;
            three.camera.position.x += ( mouseX - three.camera.position.x ) * 0.05;
            three.camera.position.y += ( - mouseY - three.camera.position.y ) * 0.05;
            three.camera.lookAt( three.scene.position );
            for (i = 0; i < three.scene.children.length; i++) {
                var object = three.scene.children[ i ];
                if (object instanceof THREE.ParticleSystem) {
                    object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
                }
            }
            for (i = 0; i < materials.length; i++) {
                color = parameters[i][0];
                h = (360 * (color[0] + time) % 360) / 360;
                materials[i].color.setHSL(h, color[1], color[2]);
            }
            three.renderer.render(three.scene, three.camera);
        };
    };
        
    function test3dSprites(visual){
        var particles, geometry, material, i, h, color, sprite, size;
        var mouseX = 0, mouseY = 0;
        var windowHalfX = visual.canvas.width() / 2;
        var windowHalfY = visual.canvas.height() / 2;

        init();
        animate();

        function init() {
            geometry = new THREE.Geometry();
//            sprite = THREE.ImageUtils.loadTexture("textures/sprites/disc.png");
            sprite = THREE.ImageUtils.loadTexture(visual.server+"extensions/Visual/modules/textures/sprites/disc.png");
            for (i = 0; i < 500; i++) {
                var vertex = new THREE.Vector3();
                vertex.x = 2000 * Math.random() - 1000;
                vertex.y = 2000 * Math.random() - 1000;
                vertex.z = 2000 * Math.random() - 1000;
                geometry.vertices.push(vertex);
            }
            material = new THREE.ParticleSystemMaterial({size: 35, sizeAttenuation: false, map: sprite, transparent: true});
            material.color.setHSL(1.0, 0.3, 0.7);
            particles = new THREE.ParticleSystem(geometry, material);
            particles.sortParticles = true;
            three.scene.add(particles);
            
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('touchstart', onDocumentTouchStart, false);
            document.addEventListener('touchmove', onDocumentTouchMove, false);
            window.addEventListener('resize', onWindowResize, false);
        }
        function onWindowResize() {
            three.camera.aspect =visual.canvas.width()/visual.canvas.height();
            three.camera.updateProjectionMatrix();
            three.renderer.setSize(visual.canvas.width(),visual.canvas.height());
        }
        function onDocumentMouseMove(event) {
            var canvas = $(".vw_window");
            var position = canvas.position();
            if(event.clientX>=position.left && event.clientY>=position.top){
                mouseX = event.clientX - windowHalfX;
                mouseY = event.clientY - windowHalfY;
            }
        }
        function onDocumentTouchStart(event) {
            if (event.touches.length == 1) {
                event.preventDefault();
                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;
            }
        }
        function onDocumentTouchMove(event) {
            if (event.touches.length == 1) {
                event.preventDefault();
                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;
            }
        }
        function animate() {
            requestAnimationFrame(animate);
            render();
        }
        function render() {
            var time = Date.now() * 0.00005;
            three.camera.position.x += (mouseX - three.camera.position.x) * 0.05;
            three.camera.position.y += (-mouseY - three.camera.position.y) * 0.05;
            three.camera.lookAt(three.scene.position);
            h = (360 * (1.0 + time) % 360) / 360;
            material.color.setHSL(h, 0.5, 0.5);
            three.renderer.render(three.scene, three.camera);
        }
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
     * FUNCIÓN EN ESTADO PRE-PRE-ALPHA
     * Procesa los datos de la Wiki para obtener los datos a visualizar
     * No procesa de manera eficiente
     * Refactorizar y tratar con otras fuentes
     */

    function processWikiPage(opts) {
        var vizwiki, vwContent, wikiBody, vizlinks, vizfields;
        prepareHtml();
        init();
        events();
        //FUNCIONES
        function init(){
            //Captura pobremente los enlaces de los años
            var links=$("#bodyContent").find("a");
            var index=0;
            links.each(function(){
                var title=parseInt($(this).attr("title"));
                var name=$(this).attr("title");
                if(title>0 && title<3000 && (typeof name==="string" && name.indexOf("la página no existe")===-1)){
                    $(this).attr("data-index",index);
                    $(this).addClass("vw_link");
                    vwContent.append($(this).clone());
                    $(this).css("background","#00ff00");
                    index++;
                }
            });

            //Captura los enlaces del visualizador
            vizlinks=vizwiki.find("a");

            //Crea los wraps para los links
            vizlinks.each(function(){
                $(this).wrap('<div class="vw_field" data-index="'+$(this).attr("data-index")+'" title="'+$(this).attr("title")+'"></div>');
                $(this).after('<div  class="vw_items"></div>');
            });

            //Captura los campos del visualizador
            vizfields=vizwiki.find(".vw_field");

            //Oculta los enlaces
            vizfields.hide();

        }
        
        //Inserta la ventana de visualización
        function prepareHtml(){
            vizwiki=$(".vw_window");
            vwContent=$("#vw_content");
            wikiBody=$(".mw-body");
        };
        
        //Crea los eventos asociados a la ventana
        function events() {
            vizwiki.find(".vw_link").css("display", "block");

            //Detecta el scroll
            $(document).scroll(function() {
                var visibles = new Array();
                vizfields.each(function() {
                    var link = $("#bodyContent a[data-index='" + $(this).attr("data-index") + "']");
                    if (isOnScreen(link)) {
                        $(this).show();
                        var title=$(this).attr("title");
                        //Si contiene el texto de que no existe en el link, no se busca con la API
                        var exist = title.indexOf("la página no existe");
                        if(exist===-1){
                            visibles.push(title);
                        }
                    } else {
                        $(this).hide();
                    }
                });
                if (visibles.length) {
                    processLinks(visibles);
                }
            });

            //Hace scroll un pixel para que cargue las iniciales
            $(document).scrollTop(1);
        };
        
        
        function processLinks(links){
            var maxToShow=4;    //Máximo a mostrar de la lista de acontecimientos
            $.getJSON(
                opts.server+"api.php?action=query&prop=revisions&rvprop=content&format=json&titles="+links.join("|")+"&callback=?",
                function(data){
                    for(var i in data.query.pages){
                        var page=data.query.pages[i];
                        var title=page.title;
                        if(typeof page.revisions!=="undefined"){
                            var content=page.revisions[0]["*"];
                            var lines=content.split("\n");
                            var element=vizwiki.find(".vw_field[title='"+title+"']");
                            element.find(".vw_items").empty();
                            for(var j in lines){
                                var selected=j%(parseInt(lines.length/(maxToShow+1)));
                                if(lines[j].indexOf("*")>=0&&lines[j].indexOf("[[")>=0&&!selected){
                                    var string=replace("\\[\\[",'<a href="/wiki/index.php/',lines[j]);
                                    string=replace("\\]\\]",'">LINK</a>',string);
                                    string=replace("\\*",'',string);
                                    element.find(".vw_items").append('<div class="vw_item">'+string+'</div>');
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
//                                    var obj, i;
//                                    for ( i = three.scene.children.length - 1; i >= 0 ; i -- ) {
//                                        obj = three.scene.children[ i ];
//                                        if (  obj !== three.camera) {
//                                            three.scene.remove(obj);
//                                        }
//                                    }
//                                    
//                                    
//                                    var particles, geometry, materials = [];
//                                    var geometry = new THREE.Geometry();
////                                    for ( i = 0; i < 0; i ++ ) {
//                                        var vertex = new THREE.Vector3();
//                                        vertex.x = Math.random() * 2000 - 1000;
//                                        vertex.y = Math.random() * 2000 - 1000;
//                                        vertex.z = Math.random() * 2000 - 1000;
//                                        geometry.vertices.push( vertex );
////                                    }
//                                    parameters = [
//                                        [ [1, 1, 0.5], 50 ],
//                                        [ [0.95, 1, 0.5], 50 ],
//                                        [ [0.90, 1, 0.5], 50 ],
//                                        [ [0.85, 1, 0.5], 50 ],
//                                        [ [0.80, 1, 0.5], 50 ]
//                                    ];
//
//                                    for ( i = 0; i < parameters.length; i ++ ) {
//                                        color = parameters[i][0];
//                                        size  = parameters[i][1];
//
//                                        materials[i] = new THREE.ParticleSystemMaterial( { size: size } );
//
//                                        particles = new THREE.ParticleSystem( geometry, materials[i] );
//                                        particles.rotation.x = Math.random() * 6;
//                                        particles.rotation.y = Math.random() * 6;
//                                        particles.rotation.z = Math.random() * 6;
//
//                                        three.scene.add(particles);
//                                    }
//                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                }
                            }
                        }
                    }
                    var links=vwContent.find("a");
                    links.each(function(){
                        var name=replace('/wiki/index.php/','',$(this).attr("href"));
                        $(this).text(name);
                        $(this).attr("href",encodeURIComponent(name));
                    });
                    
                }
            );
        };
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
        replace=function(search,replace,string){
            var regexp = new RegExp(search,"g");
            return string.replace(regexp,replace);
        };
    };
        
        
        
        
        
        
})(jQuery);