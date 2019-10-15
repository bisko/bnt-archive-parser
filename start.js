// TODO parse Yargs
// TODO fetch show info
// TODO fetch all pages from archive
// TODO prepare all the episodes as json
const request = require('request-promise-native');
const cheerio = require('cheerio');
const URLs = {
	showInfo: 'http://archive.bnt.bg/bg/productions/about/{ID}/',
};

const parseShowInfo = ( argv ) => {
	const id = argv.id;
	const url = URLs.showInfo.replace(/\{ID\}/, id);

	return new Promise((resolve, reject) => {
		request(url)
			.then((html) => {
				const $ = cheerio.load(html, { decodeEntities: false });
				const title = $('.content h3').text();
				const showInfo = $('.content .rich-text').html();

				resolve({
					showId: id,
					showTitle: title,
					showInfo: showInfo
				});

			})
			.catch(reject); // TODO better error handling
	});
};


require( 'yargs' )
	.scriptName( 'bnt-archive-parser' )
	.usage( '$0 <cmd> [Yargs]' )
	.command( 'showinfo [id]', 'Fetch show info by ID', ( yargs ) => {
		yargs.positional( 'id', {
			type: 'number',
			default: null,
			describe: 'The show ID'
		} );
	}, (argv) => {
		parseShowInfo(argv).then(console.log)
	})
	.help()
	.argv;

