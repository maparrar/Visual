/*
 * Visual plugin for JQuery
 * Mediawiki Visualization Context Extension
 * https://github.com/maparrar/Visual
 * maparrar (http://maparrar.github.io/ - maparrar(at)gmail(dot)com )
 * Jan 2014
 **/
$(window).load(function(){
    /*
     * Se usa el plugin en el body del documento. Es posible pasar varios
     * parámetros para configurar la ventana minimizada y maximizada.
     * @param {int} minHeight: Alto en pixeles de la ventana cuando está minimizada
     * @param {int} minWidth: Ancho en pixeles de la ventana cuando está minimizada
     */
    $("body").visual();
});