var Model = useModel('Model');

/**
 * Message Model
 */
function Message(){
    this.collection = 'messages';

    /**
     * get the user that send a message
     * @param  {string}   id       the ID of the message that we want to grab it's sender
     * @return {Function} callback contains the resaults
     */
    this.sender = function(id, callback){
        this.find(id, function(mess){
            User.find(mess.user_id, function(sender){
                return callback(sender);
            });
        });
    };

    this.reciever = function(id, callback){
        this.find(id, function(mess){
            User.find(mess.to, function(reciever){
                return callback(reciever);
            });
        });
    };
}

Message.prototype = new Model;
module.exports = new Message;
