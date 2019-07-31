const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const url = 'mongodb://localhost:27017/edx-course-db/accounts';
mongoose.connect(url, { useNewUrlParser: true });



let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());




const accountSchema = mongoose.Schema({
    name: String,
    balance: Number
});

let Account = mongoose.model('Accounts', accountSchema);

app.get('/accounts', (req, res) => {
    Account.find((err, result) => {
        if (err) {
            return res.status(501).send();
        }
        res.send(result);
    });
});

app.post('/accounts', (req, res) => {
    let newAccount = new Account();
    newAccount = Object.assign(newAccount, req.body);

    newAccount.save((error, result) => {
        if (error) {
            return res.status(500).send();
        }
        else {
            newAccount.save(() => {
                res.status(201).send(result);
            });
        }
    });
});

app.put('/accounts/:id', (req, res) => {
    Account.findOne({ _id: req.params.id }, (error, accountToEdit) => {
        if (error) {
            return res.status(204).send();
        }
        else {
            if (accountToEdit != undefined) {
                accountToEdit = Object.assign(accountToEdit, req.body);
                accountToEdit.save((err, result) => {
                    if (err) res.status(501).send();
                    res.status(202).send(result);
                });
            }
            else {
                return res.status(204).send();
            }
        }
    });

});


app.delete('/accounts/:id', (req, res) => {
    Account.findOne({ _id: req.params.id }, (error, accountToDelete) => {
        if (error) {
            return res.status(204).send();
        }
        else {
            if(accountToDelete!=undefined){
                accountToDelete.remove((err, result) => {
                    if (err) return res.status(501).send();
                    return res.send(result);
                });
            }
            else {
                return res.status(204).send();
            }
        }
    });

});




app.listen(3000);
console.log('server started');

