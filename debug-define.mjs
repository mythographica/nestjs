import('mnemonica/module').then(async (wrapper) => {
	try {
		wrapper.define('TestType', function() { this.x = 1; });
		console.log('SUCCESS');
	} catch(e) {
		console.log('ERROR:', e.message.substring(0, 200));
	}
});
