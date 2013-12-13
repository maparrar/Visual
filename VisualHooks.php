<?php
class VisualHooks {
    /**
     * BeforePageDisplay hook
     */
    public static function addResources($out){
        global $wgExtensionAssetsPath;
        $out->addScriptFile("$wgExtensionAssetsPath/Visual/modules/visual.js",8);
        $out->addExtensionStyle("$wgExtensionAssetsPath/Visual/modules/visual.css?1" );
        return true;
    }
}
