"use strict";

import R from 'ramda';
import * as Const from './const.js';

export default class Client {

    constructor(socket){

        this.socket = socket;

        this.disconnected = false;

        socket.on('login', this.login);

    }

    login(credentials){

        if (this.getClientCount() > Const.MAX_CLIENTS) {

            this.info('Refusing client connection: server is full');

            return this.socket.emit('loginFail', 'serverFull');
        }

        this.username = credentials.username;

        this.accountLevel = this.getAdminLevel();

        this.socket.on('disconnect', this.disconnect);

        //MasterConnector.loadCharacter(username, function(success:Bool, save:ClientCharacterSave):Void {
        //    if (!success) {
        //        socket.emit('loginFail', "internalError");
        //        return;
        //    }
        //
        //    if (save == null) {
        //        newAccount = true;
        //        socket.emit('newGame', {username: username, starters: ServerConst.pokemonStarters, characters:ServerConst.characterSprites} );
        //        socket.on('newGame', e_newGame);
        //    }else {
        //
        //        socket.emit('startGame', { username: username } );
        //        socket.on('startGame', function(data:Dynamic):Void{
        //            initCharacter(save);
        //        });
        //    }
        //});
    }

    getAdminLevel(){

        return !this.data.adminData[this.username] ? 0 : this.data.adminData[this.username].level;
    }


}