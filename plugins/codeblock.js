/**
    @module plugins/codeblock
    @author RED Interactive <greg.connell@ff0000.com>
    @desc
      This module improves the ability to add code snippets throughout your @description tag content.

      Simply contain the code with <codeblock></codeblock> tags, and it will be rendered with Sunlight
      syntax-highlighting. See more here: http://sunlightjs.com/docs.html#plugins
 */

'use strict';


exports.handlers = {
  newDoclet: function( e ) {
    var codeblockRegex = /(\<codeblock\>[^\n]*)([^]*?)([^\n]*\<\/codeblock\>)/ig
    if( 'description' in e.doclet ) {
      var codeblocks = [];
      var match = [];
      // if there are <codeblock>...</codeblock> matches in the description:
      while( match = codeblockRegex.exec( e.doclet.description )) {
        var codeblock = match[ 2 ];

        // discover the common indentation
        var lines = codeblock.split( '\n' );
        var indents = [];
        for( var i=1; i < lines.length - 1; i++ ) {

          // empty lines
          if( lines[ i ].search( /^\s*$/ ) != -1 )
            continue;

          // count tabs, allow mixed spaces
          var tabSpaceMatch = lines[ i ].match( /^[\s\t]*/ );
          var numTabs = 0;
          if( tabSpaceMatch ) {
            //console.log( tabSpaceMatch ); // <----- debugging
            for( var j=0, len=tabSpaceMatch[ 0 ].length; j < len; j++ ) {
              if( tabSpaceMatch[ 0 ][ j ] == '\t' ) 
                numTabs++;
            }
          }
          indents.push( numTabs );
        }
        var commonIndent = Math.min.apply( null, indents );

        // remove the common indentation
        for( i=1; i < lines.length - 1; i++ ) {
          lines[ i ] = lines[ i ].slice( commonIndent );
        }
        codeblocks.push(
          '<pre class="sunlight-highlight-javascript">' +
            lines.join( '\n' ) +
          '</pre>'
        );
      }   

      // replace each codeblock with adjusted matches
      if( codeblocks.length ) {
        i = 0;
        e.doclet.description = e.doclet.description.replace( codeblockRegex, function() {
          return codeblocks[ i++ ];
        });
      }
    }
  }
}