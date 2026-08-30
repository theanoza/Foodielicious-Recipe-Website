const mongoose = require ('mongoose');
mongoose.connect(process.env.DATABASE_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Oh No missed connection :( '));
db.once('open', function(){
    console.log('Yeap!! :) Connected!!');
});


require('./Category');
require('./Recipe'); 