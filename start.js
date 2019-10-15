// TODO fetch show info
// TODO fetch all pages from archive
// TODO prepare all the episodes as json
const request = require( 'request-promise-native' );
const cheerio = require( 'cheerio' );

const ArgumentParser = require( 'argparse' ).ArgumentParser;

const URLs = {
	showInfo: 'http://archive.bnt.bg/bg/productions/about/{ID}/',
};

const parseShowInfo = ( id ) => {
	const url = URLs.showInfo.replace( /\{ID\}/, id );

	return new Promise( ( resolve, reject ) => {
		request( url )
			.then( ( html ) => {
				const $ = cheerio.load( html, { decodeEntities: false } );
				const title = $( '.content h3' ).text();
				const showInfo = $( '.content .rich-text' ).html();

				resolve( {
					showId: id,
					showTitle: title,
					showInfo: showInfo
				} );

			} )
			.catch( reject ); // TODO better error handling
	} );
};


const parser = new ArgumentParser( {
	version: '0.0.1',
	addHelp: true,
	description: 'Parses BNT\'s archive for show information and links to video files',
} );


parser.addArgument(
	['-si', '--showInfo'],
	{
		help: 'Fetch information about a show'
	}
);

const args = parser.parseArgs();

if ( args.showInfo ) {
	parseShowInfo( args.showInfo ).then( console.log );
}
