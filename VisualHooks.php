<?php
class VisualHooks {
    /**
     * BeforePageDisplay hook
     */
    public static function addResources($out){
        global $wgExtensionAssetsPath;
        $out->addScriptFile("$wgExtensionAssetsPath/Visual/modules/visual.js",1);
        $out->addScriptFile("$wgExtensionAssetsPath/Visual/modules/jquery.visual.js",2);
        $out->addScriptFile("$wgExtensionAssetsPath/Visual/modules/three/three.min.js",3);
        $out->addScriptFile("$wgExtensionAssetsPath/Visual/modules/three/anaglyph.js",4);
        $out->addExtensionStyle("$wgExtensionAssetsPath/Visual/modules/visual.css?1" );
        return true;
    }
}
