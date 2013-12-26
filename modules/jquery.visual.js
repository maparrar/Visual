/*
 * Visual plugin for JQuery
 * Mediawiki Visualization Context Extension
 * https://github.com/maparrar/Visual
 * maparrar (http://maparrar.github.io/ - maparrar(at)gmail(dot)com )
 * Dec 2013
 **/

/*
* Se usa el plugin en el body del documento. Es posible pasar varios
* parámetros para configurar la ventana minimizada y maximizada.
* @param {int} minHeight: Alto en pixeles de la ventana cuando está minimizada
* @param {int} minWidth: Ancho en pixeles de la ventana cuando está minimizada
* @param {object} mw_body: Cuerpo de la página de mediawiki
*/
;(function($){
    $.fn.visual=function(optUser,element){
        switch(optUser){
            case "function1":
                function1(this,element);
                break;
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
            minHeight: 100,
            minWidth: 100,
            mw_body: $(".mw-body")      //Cuerpo de la página de mediawiki
        };
        var opts = $.extend(def,optUser);
        
        //Se inserta el HTML y
        //se agregan las variables de opciones a la ventana del visualizador
        var visual=$.extend(insertHtml(obj),opts);
        maximize(visual);
        
        //Asigna los eventos de los objetos
        events(visual);
        
        //Pruebas de three.js
        test3d1(visual);
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
        }
    }
    
    
    /*
     * Minimiza la ventana del visualizador
     * @param {object} visual: objeto con los elementos de la ventana del visualizador
     */
    function minimize(visual){
        visual.mw_body.width("auto");
        visual.window.removeClass("vw_max");
        visual.window.height(visual.minHeight);
        visual.canvas.height(visual.minHeight-visual.title.height());
        visual.canvas.width(visual.minHeight-6);
        visual.content.hide();
    }
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
    }
    
    
    
    
    
    
    
    
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
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function test3d1(visual){
			var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color;
			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				visual.canvas.append( container );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

				geometry = new THREE.Geometry();

				for ( i = 0; i < 20000; i ++ ) {

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

					scene.add( particles );

				}

				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );


				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var time = Date.now() * 0.00005;

				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

				camera.lookAt( scene.position );

				for ( i = 0; i < scene.children.length; i ++ ) {

					var object = scene.children[ i ];

					if ( object instanceof THREE.ParticleSystem ) {

						object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

					}

				}

				for ( i = 0; i < materials.length; i ++ ) {

					color = parameters[i][0];

					h = ( 360 * ( color[0] + time ) % 360 ) / 360;
					materials[i].color.setHSL( h, color[1], color[2] );

				}

				renderer.render( scene, camera );

			}
    }
    
    function test3d2(visual){
        var container;
			var camera, scene, projector, raycaster, renderer;

			var mouse = new THREE.Vector2(), INTERSECTED;
			var radius = 100, theta = 0;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				visual.canvas.append( container );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - interactive cubes';
				container.appendChild( info );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

				scene = new THREE.Scene();

				var light = new THREE.DirectionalLight( 0xffffff, 2 );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );

				var light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( -1, -1, -1 ).normalize();
				scene.add( light );

				var geometry = new THREE.CubeGeometry( 20, 20, 20 );

				for ( var i = 0; i < 2000; i ++ ) {

					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

					object.position.x = Math.random() * 800 - 400;
					object.position.y = Math.random() * 800 - 400;
					object.position.z = Math.random() * 800 - 400;

					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;

					object.scale.x = Math.random() + 0.5;
					object.scale.y = Math.random() + 0.5;
					object.scale.z = Math.random() + 0.5;

					scene.add( object );

				}

				projector = new THREE.Projector();
				raycaster = new THREE.Raycaster();

				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xf0f0f0 );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.sortObjects = false;
				container.appendChild(renderer.domElement);


				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				theta += 0.1;

				camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
				camera.lookAt( scene.position );

				// find intersections

				var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
				projector.unprojectVector( vector, camera );

				raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

				var intersects = raycaster.intersectObjects( scene.children );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						INTERSECTED.material.emissive.setHex( 0xff0000 );

					}

				} else {

					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

				}

				renderer.render( scene, camera );

			}
    }
    
    
    function test3d3(visual){
        var container;

			var camera, scene, renderer, effect;

			var mesh, lightMesh, geometry;
			var spheres = [];

			var directionalLight, pointLight;

			var mouseX = 0;
			var mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			document.addEventListener( 'mousemove', onDocumentMouseMove, false );

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				visual.canvas.append( container );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.z = 3200;

				scene = new THREE.Scene();

				var geometry = new THREE.SphereGeometry( 100, 32, 16 );

				var path = "textures/cube/";
				var format = '.png';
				var urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

				var textureCube = THREE.ImageUtils.loadTextureCube( urls );
				var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

				for ( var i = 0; i < 500; i ++ ) {

					var mesh = new THREE.Mesh( geometry, material );

					mesh.position.x = Math.random() * 10000 - 5000;
					mesh.position.y = Math.random() * 10000 - 5000;
					mesh.position.z = Math.random() * 10000 - 5000;

					mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

					scene.add( mesh );

					spheres.push( mesh );

				}

				// Skybox

				var shader = THREE.ShaderLib[ "cube" ];
				shader.uniforms[ "tCube" ].value = textureCube;

				var material = new THREE.ShaderMaterial( {

					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					side: THREE.BackSide

				} ),

				mesh = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000 ), material );
				scene.add( mesh );

				//

				renderer = new THREE.WebGLRenderer();
				container.appendChild( renderer.domElement );

				var width = window.innerWidth || 2;
				var height = window.innerHeight || 2;

				effect = new THREE.AnaglyphEffect( renderer );
				effect.setSize( width, height );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2,
				windowHalfY = window.innerHeight / 2,

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				effect.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove(event) {

				mouseX = ( event.clientX - windowHalfX ) * 10;
				mouseY = ( event.clientY - windowHalfY ) * 10;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var timer = 0.0001 * Date.now();

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				for ( var i = 0, il = spheres.length; i < il; i ++ ) {

					var sphere = spheres[ i ];

					sphere.position.x = 5000 * Math.cos( timer + i );
					sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

				}

				effect.render( scene, camera );

			}
    }
    
    
    
    
    function test3d4(visual){
        var container;
			var camera, scene, renderer, particles, geometry, material, i, h, color, sprite, size;
			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				visual.canvas.append( container );

				camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

				geometry = new THREE.Geometry();

//				sprite = THREE.ImageUtils.loadTexture( "modules/textures/sprites/disc.png" );
				sprite = THREE.ImageUtils.loadTexture( "http://threejs.org/examples/textures/sprites/disc.png" );

				for ( i = 0; i < 10000; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = 2000 * Math.random() - 1000;
					vertex.y = 2000 * Math.random() - 1000;
					vertex.z = 2000 * Math.random() - 1000;

					geometry.vertices.push( vertex );

				}

				material = new THREE.ParticleSystemMaterial( { size: 35, sizeAttenuation: false, map: sprite, transparent: true } );
				material.color.setHSL( 1.0, 0.3, 0.7 );

				particles = new THREE.ParticleSystem( geometry, material );
				particles.sortParticles = true;
				scene.add( particles );

				//

				renderer = new THREE.WebGLRenderer( { clearAlpha: 1 } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//


				//

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}
			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var time = Date.now() * 0.00005;

				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

				camera.lookAt( scene.position );

				h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
				material.color.setHSL( h, 0.5, 0.5 );

				renderer.render( scene, camera );

			}
    }
    
    
    /**
     * Agrega un objeto al slider y recalcula su tamaño
     * @param {type} obj
     * @param {element} object elemento a agregar
     */
    function function1(obj,object){
        
    };
})(jQuery);