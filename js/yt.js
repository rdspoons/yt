var $ = function ( n ) {
    if ( typeof n === "string" && n .substr ( 0, 1 ) === "#" ) {
        return document .getElementById ( n .substr ( 1, n .length - 1 ) ) ;
    }else{
        return document .querySelectorAll ( n ) ;
    }
}
var utube = {
	lastVideo : [ '' , '' ] ,
	indexed: [],
	shiftit : function ( n ) {
		var si = $ ( "#s1" ) .selectedIndex ;
		var ul = $ ( "#s1" ) .options.length ;
		switch ( n ){
			case ( "prev" ) :
				if ( si > 0 )
					$ ( "#s1" ) .selectedIndex = si - 1 ;
				else
					$ ( "#s1" ) .selectedIndex = ul - 1 ;
				break ;
			case ( "next" ) :
				if ( si < ul - 1 )
					$ ( "#s1" ) .selectedIndex = si + 1 ;
				else
					$ ( "#s1" ) .selectedIndex = 0 ;
				break ;
		}
		if ( "createEvent" in document ) {
			var evt = document .createEvent ( "HTMLEvents" ) ;
			evt.initEvent ( "change", false, true ) ;
			$ ( "#s1" ) .dispatchEvent ( evt );
		}
		else
			$ ( "#s1" ) .fireEvent ( "onchange" );
	},
	albumnizeMovies : function ( ) {
		var mvs = albums [ "Movies" ] ;
		var cnt1 = cnt2 = 0;
		for ( var i in mvs ) {
			if ( cnt1++ % 16 == 0 ) {
				albums [ "Movies"+ ++cnt2 ] = { }
			}
			albums [ "Movies" + cnt2 ] [ i ] = mvs [ i ] ;
		}
		albums [ "Movies" ] = null ;
		
		var icnt = 0;
		for ( var i in albums ) {
			for ( var j in albums [ i ] )
				for ( var k in albums [ i ] [ j ] )
				utube .indexed [ icnt++ ] = [ j , k , i , albums [ i ] [ j ] [ k ] ] ;
		}
		
	},
	vshow : function ( n ) {
		var s = '' ;
		for ( var i in n )
			for ( j in n [ i ] )
				s += '<a class="btn btn-default m-3" href="#" onclick="utube.showMe(this);return false;" data-url="'+i+'">' + j + '</a>' ;
		return s ;
	},
	showViedo : function ( v , title ) {
		var url = "https://www.youtube.com/embed/@yt@?autoplay=1&autohide=1&controls=2&loop=0&enablejsapi=1" ;
		url = url .replace ( /@yt@/ , v ) ;
		this.lastVideo = [ v , title ] ;
		var s = '<iframe id="ytplayer" src="' + url + '" width="420" height="315" frameborder="0" allowfullscreen></iframe>\n' ;
		s += '\n<scr' + 'ipt>\n'
			+ 'var $ = function(n){\n'
			+ '\t  if(typeof n === "string" && n.substr(0,1)==="#"){\n'
		    + '\t\t			return document.getElementById(n.substr(1,n.length-1));\n'
			+ '\t  } else {\n'
			+ '\t\t    return document.querySelectorAll(n);\n'
			+ '\t  }\n'
			+ '}\n'
			+ 'window.onresize = function(){\n'
			+ '\t  $("#ytplayer").width = window.innerWidth;\n'
            + '\t  $("#ytplayer").height = window.innerHeight;\n'
			+ '}\n'
			+ '\t  $("#ytplayer").width = window.innerWidth;\n'
            + '\t  $("#ytplayer").height = window.innerHeight;\n'
			+ '</scr' + 'ipt>\n';
        s += '<scr' + 'ipt src="http://www.youtube.com/iframe_api"></scr' + 'ipt>\n';
		s += '<scr' + 'ipt>\n'
			+ 'var player;\n'
			+ 'var V = {\n'
			+ '  player : "" ,\n'
			+ '  vid : {vid:"' + this.lastVideo[0] + '",title:"' + this.lastVideo[1] + '"}\n'
			+ '}\n'
			+ 'function onYouTubeIframeAPIReady() {\n'
			+ '  V .player = new YT .Player ( "ytplayer" , {\n'
			+ '    events : {\n'
			+ '      "onStateChange" : "onPlayerStateChange",\n'
            + '      "onError" : "onPlayerError"\n'
			+ '    }\n'
			+ '  });\n'
			+ '}\n'
			+ 'function onPlayerStateChange ( ev ) {\n'
			+ '  if ( ev .data == YT .PlayerState .ENDED ) {\n'
			+ '    window .opener .getNextViedo ( V .vid, this ) ;\n'
			+ '  }\n'
			+ '}\n'
			+ 'function onPlayerError ( ev ) {\n'
			+ '    window .opener .getNextViedo ( V .vid, this ) ;\n'
			+ '}\n'
			+ 'function loadNextVideo ( n ) {\n'
			+ '  V .vid = n ;\n'
			+ '  V .player .loadVideoById ( n .vid ) ;\n'
			+ '  document.title = n .title ;\n'
			+ '}\n'
			+'</scr' + 'ipt>\n' ;
		var win = window .open( "" , "win" + Math .floor ( Math .random ( ) * 9999999 ) , "height=315,width=302,toolbar=no,scrollbars=no,menubar=no,location=no" ) ;
		win .document .write ( "<!doctype html>\n<html>\n<head>\n<style>\nbody{margin:0;padding:0;}\n</style>\n</head>\n<body>\n" + s +"\n</body>\n</html>");
		win .document .title = title ;
		win .document .close ( ) ;
		
	},
	showMe : function ( n ) {
		var vid = n .getAttribute ( "data-url" ) ;
		utube .showViedo ( vid , n .innerHTML ) ;
	},	
	showimg : function ( yt , song ) {
		$ ( "#bigimg" ) .innerHTML = '<img src="http://img.youtube.com/vi/'+yt+'/0.jpg"><div class="vidTitle">'+song+'</div>';
		$ ( "#bigimg" ) .style .display = "block";
	},
	hideimg : function (){
		$ ( "#bigimg" ).style .display = 'none';
	},
	showSongTitles : function ( n ) {
		return;
		var s = "" ;
		for ( var i in albums[ n .innerHTML ] ) {
			for ( j in albums [ n .innerHTML ] [ i ] ) {
				s += '<div class="songTitle">' + j + '</div>' ;
			}
		}
		$ ( "#songTitles" ) .innerHTML = s ;
		$ ( "#songTitles" ) .style .display = "block";
	},
	hideSongTitles : function ( ) {
		$ ( "#songTitles" ) .innerHTML = "" ;
		$ ( "#songTitles" ) .style .display = "none";
	},
	showAlbum : function ( albumName ) {
		var s = "" ;
		for ( var i in albums )
			if ( i == albumName )
				for ( var j in albums [ i ] )
					for ( var k in albums [ i ] [ j ] ) {
						s += '<div class="vidlink">'
						  +  '<img onclick="utube.showViedo(\'' + j + '\',\'' + k + '\')"'
							 + 'onmouseover="utube.showimg(\'' + j + '\',\'' + k + '\')"'
							 + 'onmouseout="utube.hideimg(\'' + j + '\',\'' + k + '\')"'
							 + 'src="http://img.youtube.com/vi/'+j+'/2.jpg">'
						  +  '<div>' + k + '</div>'
						  +  '</div>' ;
					}
		$ ( "#results-of-find" ) .innerHTML = s;
		$ ( "#albumname" ) .innerHTML = albumName;
	},
	find: function ( inputElId , resultsElId ) {
		var needle = $ ( "#" + inputElId ) .value ;
		var res = { } ; 
		for ( var name in albums )
			for ( var yt in albums [ name ] )
				for ( song in albums [ name ] [ yt ] )
					if( song.toLowerCase ( ) .indexOf ( needle .toLowerCase ( ) ) > -1 )
						res [ yt ] = albums [ name ] [ yt ] ;
		$ ( "#" + resultsElId ) .innerHTML = utube .vshow ( res ) ;
	},
	bindFind : function ( boundElId, inputElId , resultsElId ) {
		$ ( "#" + boundElId ) .onclick = function ( ) {
			utube .find ( inputElId , resultsElId);
		}
	},
	init : function ( ) {
		utube .albumnizeMovies ( ) ;
		var s = [ '<a id="music"></a><h2>Music Videos</h2>' ] ;
		for ( var i in albums ) {
			if ( albums [ i ] == null )
				continue ;
			if ( i == "The Guild S1" )
				s .push ( '<a id="webseries"></a><h2>Web Series</h2>' ) ;
			else if ( i == "Movies1" )
				s .push ( '<a id="movies"></a><h2>Movies</h2>' ) ;
			else if ( i == "Christian" )
				s .push ( '<h2>Movies</h2>' ) ;
			else if ( i == "HP Lovecraft Audio" )
				s .push ( '<a id="audio"></a><h2>Audio Books</h2>' ) ;
			else if ( i == "Total recall 2070" )
				s .push ( '<a id="tvseries"></a><h2>TV  Series</h2>' ) ;
			else if ( i == "The match game" )
				s .push ( '<a id="funny"></a><h2>Funny Videos</h2>' ) ;
			else if ( i == "Science Long (1hr each}" )
				s .push ( '<a id="misc"></a><h2>Miscellaneous</h2>' ) ;
			s .push ( '<a onmouseover="utube.showSongTitles(this)" onmouseout="utube.hideSongTitles()" class="catlink" href="#" onclick="utube.showAlbum(\'' + i + '\')">'+i+'</a>' ) ;
		}
		$ ( "#links1" ) .innerHTML = s.join ( '' ) ;
	},
	ignoreCase : true
}

utube .init ( ) ;
utube .bindFind ( "btn-find", "find-vid" , "results-of-find") ;


function findNextVideo ( vid ) {
  var needle = vid .vid ,
    numOfVids = utube .indexed .length ;
  for ( var i = 0 ; i < numOfVids ; i++ ) {
    if ( utube .indexed [ i ] [ 0 ] == needle ) {
      if ( i > numOfVids - 1 ){
        utube.lastVideo = utube .indexed [ 0 ] ;
      } else {
        utube .lastVideo = utube .indexed [ i + 1 ] ;
      }
      vid.vid = utube.lastVideo [ 0 ] ;
      vid .title = utube.lastVideo [ 1 ] ;    
      break;
    }
  }
  return vid ;
}

function getNextViedo ( vid , win ) {
  win .loadNextVideo ( findNextVideo ( vid ) ) ;
}

utube.showAlbum("Taylor Swift");
